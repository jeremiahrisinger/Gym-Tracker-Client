import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../common/constants';
import { LoginService } from '../auth/services/login-service';
import { Observable } from 'rxjs';
import { Program, ProgramDay } from '../models/program';

@Service()
export class ProgramService {
  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/programs';
  private loginService = inject(LoginService);

  getPrograms(): Observable<Program[]> {
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<Program[]>(this.apiUrl, { params});

  }

  getProgramById(programId: string): Observable<Program> {
    const url = `${this.apiUrl}/${programId}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<Program>(url, { params });
  }

  getProgramDayByName(programId: string, programDayName: string): Observable<ProgramDay> {
    const url = `${this.apiUrl}/${programId}/days/${programDayName}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<ProgramDay>(url, { params });
  }

  deleteProgramById(programId: string): Observable<Program> {
    const url = `${this.apiUrl}/delete/${programId}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.delete<Program>(url, { params });
  }

  createNewProgram(newProgram: Program): Observable<Program> {
    const activeUser = this.loginService.currentUser();
    newProgram.userId = activeUser?.id
    const payload = {
      ...newProgram
    };
    console.log(payload);
    return this.http.post<Program>(this.apiUrl, payload);
  }

  updateProgramDay(programId: string, updatedProgramDay: ProgramDay): Observable<ProgramDay> {
    const url = `${this.apiUrl}/${programId}`;
    const activeUser = this.loginService.currentUser();
    updatedProgramDay.userId = activeUser?.id
    const payload = {
      ...updatedProgramDay
    };
    
    return this.http.put<ProgramDay>(url, payload);
  }

  addDayToProgram(programId: string, newProgramDay: ProgramDay): Observable<Program> {
    const url = `${this.apiUrl}/${programId}/add-day`;
    const activeUser = this.loginService.currentUser();
    newProgramDay.userId = activeUser?.id
    const payload = {
      ...newProgramDay
    };

    return this.http.patch<Program>(url, payload);
  }

  removeDayFromProgram(programId: string, day: any) {
    const url = `${this.apiUrl}/${programId}/delete-day`;
    console.log(url);
    const activeUser = this.loginService.currentUser();
    const userId = activeUser?.id || '';

    const payload = {
      ...day,
      userId
    };
    return this.http.patch<Program>(url, payload);
  }

  addSetToProgramDay(programId: string, programDayId: string, newProgramSet: any): Observable<ProgramDay> {
    const url = `${this.apiUrl}/${programId}/days/${programDayId}/add-set`;
    const activeUser = this.loginService.currentUser();
    newProgramSet.userId = activeUser?.id
    const payload = {
      ...newProgramSet
    };

    return this.http.patch<ProgramDay>(url, payload);
  }

  removeSetFromProgramDay(programId: string, programDayId: string, set: any): Observable<ProgramDay> {
    const url = `${this.apiUrl}/${programId}/days/${programDayId}/delete-set`;
    const activeUser = this.loginService.currentUser();
    const userId = activeUser?.id || '';

    const payload = {
      ...set,
      userId
    };

    return this.http.patch<ProgramDay>(url, payload);
  }
}
