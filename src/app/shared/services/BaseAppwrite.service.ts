import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Avatars, Client, Databases, Storage, Graphql } from 'appwrite';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseAppwriteService {
  protected client!: Client;
  protected account!: Account;
  protected avatar!: Avatars;
  protected database!: Databases;
  protected storage!: Storage;
  protected graphql!: Graphql;

  constructor(protected router: Router) {
    this.initializeAppwrite();
  }

  private initializeAppwrite(): void {
    this.client = new Client()
      .setEndpoint(environment.appwriteUrl)
      .setProject(environment.appwriteProjectId);

    this.account = new Account(this.client);
    this.avatar = new Avatars(this.client);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.graphql = new Graphql(this.client);
  }
}