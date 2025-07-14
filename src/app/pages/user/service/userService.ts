import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Get all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/api/users');
  }

  // Get user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`/api/users/${id}`);
  }

  // Create new user
  createUser(user: any): Observable<any> {
    return this.http.post<any>('/api/users', user);
  }

  // Update user
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`/api/users/${id}`, user);
  }

  // Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`/api/users/${id}`);
  }
} 