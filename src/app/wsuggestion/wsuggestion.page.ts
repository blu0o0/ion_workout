import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonHeader, IonToolbar, IonTitle,
  IonContent, IonCard, IonCardContent,
  IonModal, IonButton, IonItem, IonInput,
  IonLabel, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';

import { ProfileService } from '../services/profile.service';

type BodyPart = 'upper' | 'core' | 'lower';

@Component({
  selector: 'app-wsuggestion',
  templateUrl: './wsuggestion.page.html',
  styleUrls: ['./wsuggestion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonCard, IonCardContent,
    IonModal, IonButton, IonItem, IonInput,
    IonLabel, IonSelect, IonSelectOption
  ]
})
export class WsuggestionPage implements OnInit {

  profile: any;
  index!: number;

  workouts: any[] = [];

  selectedWorkout: any = null;
  selectedIndex: number | null = null;

  isModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router
  ) {}

  goBack() {
    this.router.navigate(['/home']);
  }

  // =========================
  // EXERCISE DATABASE
  // =========================
  EXERCISES: Record<BodyPart, { name: string; img: string; level: number }[]> = {
    upper: [
      { name: 'Push-up', img: 'assets/pushup.jpg', level: 1 },
      { name: 'Wall push-up', img: 'assets/wallpushup.jpg', level: 1 },
      { name: 'Chair dips', img: 'assets/chairdips.jpg', level: 2 },
      { name: 'Dumbbell shoulder press', img: 'assets/shoulderpress.jpg', level: 3 },
      { name: 'Dumbbell curl', img: 'assets/curl.jpg', level: 2 },
      { name: 'Seated shoulder press', img: 'assets/seatedshoulder.jpg', level: 3 }
    ],

    core: [
      { name: 'Plank', img: 'assets/plank.jpg', level: 1 },
      { name: 'Plank (knees)', img: 'assets/plankknees.jpg', level: 1 },
      { name: 'Sit-ups', img: 'assets/situps.jpg', level: 2 },
      { name: 'Russian twist', img: 'assets/russiantwist.jpg', level: 2 },
      { name: 'Leg raises', img: 'assets/legraises.jpg', level: 3 }
    ],

    lower: [
      { name: 'Chair squat', img: 'assets/chairsquat.jpg', level: 1 },
      { name: 'Squat', img: 'assets/squat.jpg', level: 2 },
      { name: 'Lunges', img: 'assets/lunges.jpg', level: 3 },
      { name: 'Glute bridge', img: 'assets/glutebridge.jpg', level: 2 }
    ]
  };

  // =========================
  // INIT
  // =========================
  async ngOnInit() {
    this.index = Number(this.route.snapshot.paramMap.get('index'));

    const profiles = await this.profileService.getProfiles();
    this.profile = profiles[this.index];

    if (this.profile.workouts?.length) {
      this.workouts = this.profile.workouts;
    } else {
      this.workouts = this.generateWorkouts();
      this.profile.workouts = this.workouts;

      profiles[this.index] = this.profile;
      await this.profileService.setProfiles(profiles);
    }
  }

  // =========================
  // SMART DIFFICULTY
  // =========================
  getDifficulty() {
    const mass = this.profile.muscleMass;

    if (mass === 'high') return { sets: 4, reps: 12, count: 5 };
    if (mass === 'moderate') return { sets: 3, reps: 10, count: 4 };

    return { sets: 2, reps: 8, count: 3 }; // low
  }

  // =========================
  // SMART GENERATOR
  // =========================
  generateWorkouts() {

    const difficulty = this.getDifficulty();
    const workouts: any[] = [];

    const selectedParts: BodyPart[] = this.profile.bodyParts || [];

    const DAY_MAP: Record<BodyPart, string[]> = {
      upper: ['Monday', 'Thursday'],
      core: ['Tuesday', 'Friday'],
      lower: ['Wednesday', 'Saturday']
    };

    selectedParts.forEach((part) => {

      const pool = this.EXERCISES[part];

      // SORT by difficulty (easy → hard based on level)
      const sorted = [...pool].sort((a, b) => a.level - b.level);

      // pick ONLY best exercises based on difficulty
      const picked = sorted.slice(0, difficulty.count);

      picked.forEach((ex, i) => {

        workouts.push({
          name: ex.name,
          image: ex.img,
          reps: difficulty.reps,
          sets: difficulty.sets,
          day: [DAY_MAP[part][i % DAY_MAP[part].length]]
        });

      });
    });

    return workouts;
  }

  // =========================
  // OPEN WORKOUT
  // =========================
  openWorkout(workout: any, i: number) {
    this.selectedWorkout = { ...workout };
    this.selectedIndex = i;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedWorkout = null;
    this.selectedIndex = null;
  }

  // =========================
  // AUTO SAVE
  // =========================
  async autoSave() {
    if (this.selectedIndex === null) return;

    const profiles = await this.profileService.getProfiles();

    this.workouts[this.selectedIndex] = {
      ...this.selectedWorkout
    };

    this.profile.workouts = this.workouts;

    profiles[this.index] = this.profile;

    await this.profileService.setProfiles(profiles);
  }
}