import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../common/constants';
import { LoginService } from '../auth/services/login-service';
import { Observable } from 'rxjs';
import { Program, ProgramDay } from '../models/program';
import { ApiResponse } from '../../core/models/api-response';

@Service()
export class ProgramService {
  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/programs';
  private loginService = inject(LoginService);

  getPrograms(): Observable<ApiResponse<Program[]>> {
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<ApiResponse<Program[]>>(this.apiUrl, { params});

  }

  getProgramById(programId: string): Observable<ApiResponse<Program>> {
    const url = `${this.apiUrl}/${programId}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<ApiResponse<Program>>(url, { params });
  }

  getProgramDayByName(programId: string, programDayName: string): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/days/${programDayName}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<ApiResponse<ProgramDay>>(url, { params });
  }

  deleteProgramById(programId: string): Observable<ApiResponse<Program>> {
    const url = `${this.apiUrl}/delete/${programId}`;
    const params = this.loginService.getUserIdAsParam();

    return this.http.delete<ApiResponse<Program>>(url, { params });
  }

  createNewProgram(newProgram: Program): Observable<ApiResponse<Program>> {
    const activeUser = this.loginService.currentUser();
    newProgram.userId = activeUser?._id
    const payload = {
      ...newProgram
    };
    console.log(payload);
    return this.http.post<ApiResponse<Program>>(this.apiUrl, payload);
  }

  updateProgramDay(programId: string, updatedProgramDay: ProgramDay): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}`;
    const activeUser = this.loginService.currentUser();
    updatedProgramDay.userId = activeUser?._id
    const payload = {
      ...updatedProgramDay
    };
    
    return this.http.put<ApiResponse<ProgramDay>>(url, payload);
  }

  addDayToProgram(programId: string, newProgramDay: ProgramDay): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/add-day`;
    const activeUser = this.loginService.currentUser();
    newProgramDay.userId = activeUser?._id
    const payload = {
      ...newProgramDay
    };

    return this.http.patch<ApiResponse<ProgramDay>>(url, payload);
  }

  removeDayFromProgram(programId: string, day: any) : Observable<ApiResponse<Program>>{
    const url = `${this.apiUrl}/${programId}/delete-day`;
    console.log(url);
    const activeUser = this.loginService.currentUser();
    const userId = activeUser?._id || '';

    const payload = {
      ...day,
      userId
    };
    return this.http.patch<ApiResponse<Program>>(url, payload);
  }

  addSetToProgramDay(programId: string, programDayId: string, newProgramSet: any): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/days/${programDayId}/add-set`;
    const activeUser = this.loginService.currentUser();
    newProgramSet.userId = activeUser?._id
    const payload = {
      ...newProgramSet
    };

    return this.http.patch<ApiResponse<ProgramDay>>(url, payload);
  }

  removeSetFromProgramDay(programId: string, programDayId: string, set: any): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/days/${programDayId}/delete-set`;
    const activeUser = this.loginService.currentUser();
    const userId = activeUser?._id || '';

    const payload = {
      ...set,
      userId
    };

    return this.http.patch<ApiResponse<ProgramDay>>(url, payload);
  }
}
