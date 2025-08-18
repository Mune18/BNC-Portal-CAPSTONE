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
      const response = await this.account.create('unique()', registerData.email, registerData.password);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  setLoading(isLoading: boolean) {
    this.isLoadingSubject.next(isLoading);
  }

  async login(loginData: LoginData) {
    this.setLoading(true);
    try {
      const response = await this.account.createEmailPasswordSession(loginData.email, loginData.password);
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