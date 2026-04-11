import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonItem, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { ProfileService } from '../services/profile.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-addnew',
  templateUrl: './addnew.page.html',
  styleUrls: ['./addnew.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonItem, IonSelectOption, IonSelect]
})
export class AddnewPage implements OnInit {

  name = '';
  gender = '';
  age: any = '';
  weight: any = '';
  height: any = '';
  bodyParts: String[] = [];
muscleMass: any = '';

  editIndex: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['index'] !== undefined) {
        this.editIndex = Number(params['index']);
        this.loadProfile(this.editIndex);
      }
    });
  }

  async loadProfile(index: number) {
    const profiles = await this.profileService.getProfiles();
    const profile = profiles[index];

    if (profile) {
      this.name = profile.name;
      this.gender = profile.gender;
      this.age = profile.age;
      this.weight = profile.weight;
      this.height = profile.height;
      this.bodyParts = profile.bodyParts || [];
this.muscleMass = profile.muscleMass || '';
    }
  }

  async addProfile() {
    const profile = {
      name: this.name,
      gender: this.gender,
      age: Number(this.age),
      weight: Number(this.weight),
      height: Number(this.height),
      bodyParts: this.bodyParts,      
  muscleMass: this.muscleMass 
    };

    if (this.editIndex !== null) {

      const profiles = await this.profileService.getProfiles();
      profiles[this.editIndex] = profile;
      await this.profileService.setProfiles(profiles);
    } else {
 
      await this.profileService.addProfile(profile);
    }

    await this.showSavedToast();
    this.router.navigate(['/home']);
  }

  gohome() {
    this.router.navigate(['/home']);
  }

  async showSavedToast() {
    const toast = await this.toastController.create({
      message: this.editIndex !== null ? 'Profile updated!' : 'Profile saved!',
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }

  
}