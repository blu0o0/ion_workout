import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selectgoal',
  templateUrl: './selectgoal.page.html',
  styleUrls: ['./selectgoal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SelectgoalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
