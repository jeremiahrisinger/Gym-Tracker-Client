import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Set } from '../models/set';
import { AuthService } from '../auth/services/auth-service';
import { BASE_URL } from '../../common/constants';
import { ApiResponse } from '../../core/models/api-response';

@Service()
export class LiftingSetService {

  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/liftingSets';
  private loginService = inject(AuthService);


  getSets(): Observable<ApiResponse<Set[]>> {

    return this.http.get<ApiResponse<Set[]>>(this.apiUrl);
  }

  getSetsByExercise(exercise: string): Observable<ApiResponse<Set[]>> {
    const params = new HttpParams().set('exercise', exercise);

    return this.http.get<ApiResponse<Set[]>>(this.apiUrl, { params });
  }

  addSet(newSet: Set): Observable<ApiResponse<Set>> {
    return this.http.post<ApiResponse<Set>>(this.apiUrl, newSet);
  }
}
