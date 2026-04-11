import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonHeader, IonToolbar, IonTitle,
  IonContent, IonCard, IonCardContent,
  IonModal, IonButton, IonItem, IonInput,IonLabel,IonSelect,IonSelectOption
} from '@ionic/angular/standalone';

import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-wsuggestion',
  templateUrl: './wsuggestion.page.html',
  styleUrls: ['./wsuggestion.page.scss'],
  standalone: true,
  imports: [
  CommonModule,
  FormsModule, // ✅ ADD THIS

  IonHeader, IonToolbar, IonTitle,
  IonContent, IonCard, IonCardContent,
  IonModal, IonButton, IonItem, IonInput, IonLabel,IonSelect,IonSelectOption
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
  private router: Router   // ✅ ADD THIS
) {}

goBack() {
  this.router.navigate(['/home']);
}

 async ngOnInit() {
  this.index = Number(this.route.snapshot.paramMap.get('index'));

  const profiles = await this.profileService.getProfiles();
  this.profile = profiles[this.index];

  // ✅ USE SAVED WORKOUTS IF THEY EXIST
  if (this.profile.workouts && this.profile.workouts.length > 0) {
    this.workouts = this.profile.workouts;
  } else {
    this.generateWorkouts();
    this.profile.workouts = [...this.workouts];

    // save initial generated workouts once
    profiles[this.index] = this.profile;
    await this.profileService.setProfiles(profiles);
  }
}
  generateWorkouts() {
    const p = this.profile;

    // ✅ SAFETY CHECK
    if (!p) return;

    const intensity =
      p.muscleMass === 'high' ? 6 :
      p.muscleMass === 'moderate' ? 10 : 15;

    const reps = p.age > 30 ? 10 : 15;

    const workouts: any[] = [];

    if (p.bodyParts?.includes('upper')) {
      workouts.push({
        name: 'Push Ups',
        reps,
        sets: intensity,
        day: ['Monday'],
        image: 'assets/pushup.jpg'
      });
    }

    if (p.bodyParts?.includes('core')) {
      workouts.push({
        name: 'Plank',
        reps: '30 sec',
        sets: intensity,
        day: ['wednesday'],
        image: 'assets/plank.jpg'
      });
    }

    if (p.bodyParts?.includes('lower')) {
      workouts.push({
        name: 'Squats',
        reps,
        sets: intensity,
        day: ['Monday'],
        image: 'assets/squats.jpg'
      });
    }

    this.workouts = workouts;
  }

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

async saveWorkout() {
  if (this.selectedIndex === null) return;

  const profiles = await this.profileService.getProfiles();

  // 🔥 OVERWRITE suggested workout directly
  this.workouts[this.selectedIndex] = {
    ...this.selectedWorkout
  };

  // 🔥 SAVE BACK TO PROFILE
  this.profile.workouts = this.workouts;

  profiles[this.index] = this.profile;

  await this.profileService.setProfiles(profiles);

}
async autoSave() {
  if (this.selectedIndex === null) return;

  const profiles = await this.profileService.getProfiles();

  // update workout instantly
  this.workouts[this.selectedIndex] = {
    ...this.selectedWorkout
  };

  this.profile.workouts = this.workouts;
  profiles[this.index] = this.profile;

  await this.profileService.setProfiles(profiles);
}
}