import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../common/constants';
import { LoginService } from '../auth/services/login-service';
import { Observable } from 'rxjs';
import { Workout } from '../models/workout';
import { LiftingSet } from '../models/lifting-set';

@Service()
export class WorkoutService {
  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/workouts';
  private loginService = inject(LoginService);


  getWorkouts(): Observable<Workout[]> {
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<Workout[]>(this.apiUrl, { params });
  }

  getWorkoutById(workoutId: string): Observable<Workout> {
    const url = `${this.apiUrl}/${workoutId}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<Workout>(url, { params });
  }

  deleteWorkoutById(workoutId: string): Observable<Workout> {
    const url = `${this.apiUrl}/delete/${workoutId}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.delete<Workout>(url, { params });
  }

  addWorkout(newWorkout: Workout): Observable<Workout> {
    const activeUser = this.loginService.currentUser();
    newWorkout.userId = activeUser?._id
    const payload = {
      ...newWorkout
    };
    console.log(payload);
    return this.http.post<Workout>(this.apiUrl, payload);
  }

  addSetToWorkout(workoutId: string, newSet: LiftingSet): Observable<Workout> {
    const url = `${this.apiUrl}/${workoutId}/add-set`;
    const activeUser = this.loginService.currentUser();
    newSet.userId = activeUser?._id
    const payload = {
      ...newSet
    };
    
    return this.http.patch<Workout>(url, payload);
  }

  removeSetFromWorkout(workoutId: string, set: any) {
    const url = `${this.apiUrl}/${workoutId}/delete-set`;
    console.log(url);
    const activeUser = this.loginService.currentUser();
    const userId = activeUser?._id || '';

    const payload = {
      ...set,
      userId
    };
    return this.http.patch<Workout>(url, payload);
  }
}
