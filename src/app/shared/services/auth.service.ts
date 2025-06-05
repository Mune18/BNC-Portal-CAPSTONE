import { Injectable } from '@angular/core';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { Router } from '@angular/router';
import { LoginData, RegisterData } from '../types/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAppwriteService {
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

    async login(loginData: LoginData) {
    try {
      const response = await this.account.createEmailPasswordSession(loginData.email, loginData.password);
      return response;
    } catch (error) {
      console.error('Login error:', error);
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
}