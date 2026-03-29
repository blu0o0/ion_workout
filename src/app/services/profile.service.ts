import { Injectable } from '@angular/core';

export interface Profile {
  name: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private storageKey = 'profiles';

  constructor() {}

  getProfiles(): Profile[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }



  addProfile(profile: Profile) {
    const profiles = this.getProfiles();
    profiles.push(profile);
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
  }

}