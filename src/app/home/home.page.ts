import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, Profile } from '../services/profile.service';
import { 
  IonFab
  ,IonContent,IonCard,IonCardContent
  } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule,IonFab,IonCard,IonCardContent,IonContent
    

  ]
})
export class HomePage implements OnInit {

  profiles: any[] = [];

  constructor(
    private profileService: ProfileService,
    private router: Router
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

}