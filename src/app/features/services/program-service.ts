import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../common/constants';
import { AuthService } from '../auth/services/auth-service';
import { Observable } from 'rxjs';
import { Program, ProgramDay } from '../models/program';
import { ApiResponse } from '../../core/models/api-response';
import { Exercise } from '../models/exercise';

@Service()
export class ProgramService {
  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/programs';
  private loginService = inject(AuthService);

  // Program Routes
  getPrograms(): Observable<ApiResponse<Program[]>> {
    return this.http.get<ApiResponse<Program[]>>(this.apiUrl);
  }

  createNewProgram(newProgram: Program): Observable<ApiResponse<Program>> {

    return this.http.post<ApiResponse<Program>>(this.apiUrl, newProgram);
  }

  getProgramById(programId: string): Observable<ApiResponse<Program>> {
    const url = `${this.apiUrl}/${programId}`;

    return this.http.get<ApiResponse<Program>>(url);
  }

  updateProgramById(updatedProgram: Program): Observable<ApiResponse<Program>> {
    const url = `${this.apiUrl}/${updatedProgram._id}`;

    return this.http.patch<ApiResponse<Program>>(url, updatedProgram);
  }

  deleteProgramById(programId: string): Observable<ApiResponse<Program>> {
    const url = `${this.apiUrl}/${programId}`;

    return this.http.delete<ApiResponse<Program>>(url);
  }

  // Program Day Routes
  addDayToProgram(programId: string, newProgramDay: ProgramDay): Observable<ApiResponse<Program>> {
    const url = `${this.apiUrl}/${programId}/days`;

    return this.http.post<ApiResponse<Program>>(url, newProgramDay);
  }

  getProgramDayById(programId: string, dayId: string): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/days/${dayId}`;

    return this.http.get<ApiResponse<ProgramDay>>(url);
  }

  updateProgramDay(programId: string, updatedProgramDay: ProgramDay): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/days/${updatedProgramDay._id}`;

    return this.http.patch<ApiResponse<ProgramDay>>(url, updatedProgramDay);
  }

  removeDayFromProgram(programId: string, day: ProgramDay): Observable<ApiResponse<Program>> {
    const url = `${this.apiUrl}/${programId}/days/${day._id}`;

    return this.http.delete<ApiResponse<Program>>(url);
  }


  // Exercise Routes
  addExerciseToProgramDay(programId: string, dayId: string, newExercise: any): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/days/${dayId}/exercises`;

    return this.http.post<ApiResponse<ProgramDay>>(url, newExercise);
  }

  removeExerciseFromProgramDay(programId: string, dayId: string, exercise: Exercise): Observable<ApiResponse<ProgramDay>> {
    const url = `${this.apiUrl}/${programId}/days/${dayId}/exercises/${exercise._id}`;

    return this.http.delete<ApiResponse<ProgramDay>>(url);
  }

  updateExerciseInProgramDay(programId: string, dayId: string, exercise: Exercise) {
    const url = `${this.apiUrl}/${programId}/days/${dayId}/exercises/${exercise._id}`;

    return this.http.patch<ApiResponse<ProgramDay>>(url, exercise);
  }
}
