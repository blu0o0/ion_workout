import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

constructor(
  private router: Router,
  private profileService: ProfileService,
  private toastController: ToastController
) {}

async addProfile() {
  const profile = {
    name: this.name,
    gender: this.gender,
    age: Number(this.age),
    weight: Number(this.weight),
    height: Number(this.height)
  };

  this.profileService.addProfile(profile);

  await this.showSavedToast();

  this.router.navigate(['/home']);
}

  gohome() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {}

  async showSavedToast() {
  const toast = await this.toastController.create({
    message: 'Profile saved successfully!',
    duration: 2000,
    position: 'bottom'
  });

  await toast.present();
}

}