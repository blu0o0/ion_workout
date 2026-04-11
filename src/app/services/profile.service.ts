import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

export interface Profile {
  name: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  bodyParts: String[];
  muscleMass: String;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private storageKey = 'profiles';
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    this._storage = await this.storage.create();
  }

  getProfiles(): Profile[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  setProfiles(profiles: Profile[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
  }


  async addProfile(profile: Profile) {
    const profiles = await this.getProfiles();
    profiles.push(profile);
    await this.setProfiles(profiles);
  }

  async deleteProfile(index: number) {
    const profiles = await this.getProfiles();
    profiles.splice(index, 1);
    await this.setProfiles(profiles);
  }
}