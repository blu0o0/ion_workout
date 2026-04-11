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
  // EXERCISE DATABASE (IMPROVED)
  // level = difficulty weight
  // =========================
  EXERCISES: Record<BodyPart, any[]> = {
    upper: [
      { name: 'Wall push-up', img: 'assets/wallpushup.jpg', level: 1 },
      { name: 'Push-up', img: 'assets/pushup.jpg', level: 2 },
      { name: 'Chair dips', img: 'assets/chairdips.jpg', level: 3 },
      { name: 'Dumbbell curl', img: 'assets/curl.jpg', level: 3 },
      { name: 'Dumbbell shoulder press', img: 'assets/shoulderpress.jpg', level: 4 }
    ],

    core: [
      { name: 'Plank (knees)', img: 'assets/plankknees.jpg', level: 1 },
      { name: 'Plank', img: 'assets/plank.jpg', level: 2 },
      { name: 'Sit-ups', img: 'assets/situps.jpg', level: 3 },
      { name: 'Russian twist', img: 'assets/russiantwist.jpg', level: 3 },
      { name: 'Leg raises', img: 'assets/legraises.jpg', level: 4 }
    ],

    lower: [
      { name: 'Chair squat', img: 'assets/chairsquat.jpg', level: 1 },
      { name: 'Squat', img: 'assets/squat.jpg', level: 2 },
      { name: 'Glute bridge', img: 'assets/glutebridge.jpg', level: 3 },
      { name: 'Lunges', img: 'assets/lunges.jpg', level: 4 }
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
  // FITNESS LEVEL
  // =========================
  getLevel() {
    const mass = this.profile.muscleMass;

    if (mass === 'high') return { reps: 12, sets: 4, count: 6, days: 6 };
    if (mass === 'moderate') return { reps: 10, sets: 3, count: 5, days: 5 };

    return { reps: 8, sets: 2, count: 3, days: 4 };
  }

  // =========================
  // SMART DAY SYSTEM
  // NO SAME MUSCLE BACK-TO-BACK
  // =========================
  buildSchedule(selected: BodyPart[], daysCount: number) {

    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const schedule: Record<number, BodyPart> = {};

    let dayIndex = 0;
    let lastPart: BodyPart | null = null;

    for (let i = 0; i < daysCount; i++) {

      let part = selected[i % selected.length];

      // avoid same muscle twice in a row
      if (part === lastPart) {
        part = selected[(i + 1) % selected.length];
      }

      schedule[dayIndex] = part;
      lastPart = part;
      dayIndex++;
    }

    return { schedule, days: allDays.slice(0, daysCount) };
  }

  // =========================
  // MAIN GENERATOR (IMPROVED AI STYLE)
  // =========================
  generateWorkouts() {

    const level = this.getLevel();
    const selectedParts: BodyPart[] = this.profile.bodyParts || [];

    const { schedule, days } = this.buildSchedule(selectedParts, level.days);

    const workouts: any[] = [];

    let dayCounter = 0;

    days.forEach((day) => {

      const part = schedule[dayCounter];

      const pool = this.EXERCISES[part];

      const sorted = [...pool]
        .sort((a, b) => a.level - b.level)
        .slice(0, level.count);

      sorted.forEach((ex) => {
        workouts.push({
          name: ex.name,
          image: ex.img,
          reps: level.reps,
          sets: level.sets,
          day: [day],
          part
        });
      });

      dayCounter++;
    });

    return workouts;
  }

  // =========================
  // OPEN MODAL
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