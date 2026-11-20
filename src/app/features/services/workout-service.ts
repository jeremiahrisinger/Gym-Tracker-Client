import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../common/constants';
import { AuthService } from '../auth/services/auth-service';
import { Observable } from 'rxjs';
import { Workout } from '../models/workout';
import { Set } from '../models/set';
import { ApiResponse } from '../../core/models/api-response';
import { Exercise } from '../models/exercise';
import { ProgramDay } from '../models/program';

@Service()
export class WorkoutService {
  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/workouts';
  private loginService = inject(AuthService);


  getWorkouts(): Observable<ApiResponse<Workout[]>> {
    return this.http.get<ApiResponse<Workout[]>>(this.apiUrl);
  }

  createWorkout(newWorkout: Workout, programId?: string): Observable<ApiResponse<Workout>> {
    return this.http.post<ApiResponse<Workout>>(this.apiUrl, { ...newWorkout, programId});
  }

  getWorkout(workout: Workout): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${workout._id}`;

    return this.http.get<ApiResponse<Workout>>(url);
  }

  getWorkoutById(workoutId: string): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${workoutId}`;

    return this.http.get<ApiResponse<Workout>>(url);
  }

  getWorkoutsByProgramDay(programDayId: String): Observable<ApiResponse<Workout[]>> {
    const url = `${this.apiUrl}/by-day/${programDayId}`;

    return this.http.get<ApiResponse<Workout[]>>(url);
  }

  updateWorkout(updatedWorkout: Workout): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${updatedWorkout._id}`;

    return this.http.patch<ApiResponse<Workout>>(url, updatedWorkout);
  }

  deleteWorkout(workout: Workout): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${workout._id}`;

    return this.http.delete<ApiResponse<Workout>>(url);
  }

  deleteWorkoutById(workoutId: string): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${workoutId}`;

    return this.http.delete<ApiResponse<Workout>>(url);
  }


  addExerciseToWorkout(workout: Workout, newExercise: Exercise): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${workout._id}/exercises`;

    return this.http.post<ApiResponse<Workout>>(url, newExercise);
  }

  deleteExerciseFromWorkout(workout: Workout, exercise: Exercise): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${workout._id}/exercises/${exercise._id}`;

    return this.http.delete<ApiResponse<Workout>>(url);
  }

  updateExerciseInWorkout(workout: Workout, updatedExercise: Exercise): Observable<ApiResponse<Workout>> {
    const url = `${this.apiUrl}/${workout._id}/exercises/${updatedExercise._id}`;
    console.log(updatedExercise);
    return this.http.patch<ApiResponse<Workout>>(url, updatedExercise);
  }
}
