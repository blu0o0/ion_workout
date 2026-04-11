import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(private profileService: ProfileService) {
    this.initApp();
  }

  async initApp() {
    await this.profileService.init(); 
  }
}