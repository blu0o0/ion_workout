import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, Profile } from '../services/profile.service';
import { 
  IonFab, IonContent, IonCard, IonCardContent, IonButton,
  IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActionSheetController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, IonFab, IonCard, IonCardContent,
    IonContent, IonButton, IonRefresher, IonRefresherContent
  ]
})
export class HomePage implements OnInit {

  profiles: Profile[] = [];

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadProfiles();
  }

  async loadProfiles() {
    this.profiles = await this.profileService.getProfiles();
  }

  async handleRefresh(event: any) {
    await this.loadProfiles();
    event.target.complete();
  }

  goToaddnew() {
    this.router.navigate(['/addnew']);
  }

  openProfile(index: number) {
    this.router.navigate(['/profile', index]);
  }

  async openMenu(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Edit',
          handler: () => this.editProfile(index)
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.confirmDelete(index)
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async confirmDelete(index: number) {
    const name = this.profiles[index].name;
    const confirm = window.confirm(`Delete ${name}?`);

    if (confirm) {
      await this.deleteProfile(index);
    }
  }

  async deleteProfile(index: number) {
    await this.profileService.deleteProfile(index);
    await this.loadProfiles();
    await this.showDeletedToast();
  }

  async showDeletedToast() {
    const toast = await this.toastController.create({
      message: 'Deleted',
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }

  editProfile(index: number) {
    this.router.navigate(['/addnew'], {
      queryParams: { index }
    });
  }
}