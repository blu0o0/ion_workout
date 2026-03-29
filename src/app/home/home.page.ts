import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, Profile } from '../services/profile.service';
import { 
  IonFab
  ,IonContent,IonCard,IonCardContent,IonButton
  ,IonRefresher,IonRefresherContent
  } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActionSheetController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule,IonFab,IonCard,IonCardContent,IonContent
    ,IonButton,IonRefresher,IonRefresherContent
    

  ]
})
export class HomePage implements OnInit {

  handleRefresh(event: any) {
  // simulate loading (optional delay)
  setTimeout(() => {
    this.loadProfiles(); // reload data

    event.target.complete(); // stop spinner
  }, 1000);
}

  profiles: any[] = [];

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private actionSheetController: ActionSheetController,
  private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.profiles = this.profileService.getProfiles();
  }

  goToaddnew() {
    this.router.navigate(['/addnew']); // change if your route is different
  }

  openProfile(index: number) {
    this.router.navigate(['/profile', index]); // 4th page later
  }

  async openMenu(ev: any, index: number) {
  const actionSheet = await this.actionSheetController.create({
    header: 'Options',
    buttons: [
      {
        text: 'Edit',
        handler: () => {
          this.editProfile(index);
        }
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.confirmDelete(index);
        }
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
  const confirm = window.confirm('Are you sure you want to delete this profile?');

  if (confirm) {
    this.deleteProfile(index);
  }
}

deleteProfile(index: number) {
  this.profiles.splice(index, 1);
  localStorage.setItem('profiles', JSON.stringify(this.profiles));
  this.showDeletedToast();
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