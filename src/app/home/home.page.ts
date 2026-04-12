import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, Profile } from '../services/profile.service';
import {
  IonFab, IonContent, IonCard, IonCardContent, IonButton,
  IonRefresher, IonRefresherContent, IonFabButton
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActionSheetController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonFab, IonCard, IonCardContent,
    IonContent, IonButton,
    IonRefresher, IonRefresherContent,
    IonFabButton
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

  ngOnInit() {}

  // 🔥 THIS IS THE KEY FIX (runs every time you return to page)
  ionViewWillEnter() {
    this.loadProfiles();
  }

  async loadProfiles() {
    this.profiles = await this.profileService.getProfiles();
  }

  async handleRefresh(event: any) {
    await this.loadProfiles();
    event.target.complete();
  }

  goToaddnew() {
    this.router.navigateByUrl('/addnew');
  }

  openProfile(index: number) {
    this.router.navigate(['/wsuggestion', index]);
  }

  async openMenu(event: any, index: number) {
    event.stopPropagation();

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
    const confirmDelete = window.confirm(`Delete ${name}?`);

    if (confirmDelete) {
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