import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LiftingSet } from '../models/lifting-set';
import { LoginService } from '../auth/services/login-service';
import { BASE_URL } from '../../common/constants';

@Service()
export class LiftingSetService {
  
  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/liftingSets';
  private loginService = inject(LoginService);


  getSets(): Observable<LiftingSet[]> {
   const params = this.loginService.getUserIdAsParam();

    return this.http.get<LiftingSet[]>(this.apiUrl, { params });
  }

  getSetsByExercise(exercise: string): Observable<LiftingSet[]> {
    const params = this.loginService.getUserIdAsParam()
      .set('exercise', exercise);

    return this.http.get<LiftingSet[]>(this.apiUrl, { params });
  }

  addSet(newSet: LiftingSet): Observable<LiftingSet> {
    const activeUser = this.loginService.currentUser();
    console.log(activeUser);
    newSet.userId = activeUser?.id
    const payload = {
      ...newSet
    };
    console.log(payload);
    return this.http.post<LiftingSet>(this.apiUrl, payload);
  }
}
