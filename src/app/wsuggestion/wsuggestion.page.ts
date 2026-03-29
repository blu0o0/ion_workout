import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-wsuggestion',
  templateUrl: './wsuggestion.page.html',
  styleUrls: ['./wsuggestion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class WsuggestionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
