import { Injectable } from '@angular/core';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { Router } from '@angular/router';
import { LoginData, RegisterData } from '../types/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAppwriteService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    router: Router
  ) {
    super(router);
  }

  async register(registerData: RegisterData) {
    try {
      // Convert username to email format for Appwrite (username@bnc.portal)
      const appwriteEmail = `${registerData.username}@bnc.portal`;
      const response = await this.account.create('unique()', appwriteEmail, registerData.password);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async attemptAccountCleanup() {
    try {
      // Try to delete current session if exists
      // This won't delete the account but will clean up the session
      await this.account.deleteSession('current');
      console.log('Session cleanup completed');
    } catch (error) {
      console.error('Session cleanup error:', error);
      // Don't throw - this is best effort cleanup
    }
  }

  setLoading(isLoading: boolean) {
    this.isLoadingSubject.next(isLoading);
  }

  async login(loginData: LoginData) {
    this.setLoading(true);
    try {
      // Convert username to email format for Appwrite (username@bnc.portal)
      const appwriteEmail = `${loginData.username}@bnc.portal`;
      const response = await this.account.createEmailPasswordSession(appwriteEmail, loginData.password);
      this.setLoading(false);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      this.setLoading(false);
      throw error;
    }
  }
  
  async logout() {
    try {
      const response = await this.account.deleteSession('current');
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getAccount() {
    return this.account.get();
  }

  getSession() {
    return this.account.getSession('current');
  }

  deleteSession(sessionId: string) {
    return this.account.deleteSession(sessionId);
  }
}