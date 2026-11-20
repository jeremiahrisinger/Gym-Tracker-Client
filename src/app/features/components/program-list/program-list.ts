import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Table } from '../../../common/components/table/table';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProgramService } from '../../services/program-service';
import { DatePipe } from '@angular/common';
import { TableColumn } from '../../../common/models/table-column';
import { Program, ProgramDay } from '../../models/program';
import { WorkoutService } from '../../services/workout-service';
import { Workout } from '../../models/workout';
import { ApiResponse } from '../../../core/models/api-response';
import { Error } from '../../../common/error/error';
import { PageTitle } from '../../../common/components/page-title/page-title';

@Component({
  imports: [Table, FormsModule, RouterLink, Error, PageTitle],
  providers: [DatePipe],
  selector: 'app-program-list',
  styleUrl: './program-list.css',
  templateUrl: './program-list.html',
})
export class ProgramList implements OnInit {
  private programService = inject(ProgramService);
  private workoutService = inject(WorkoutService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);
  private router = inject(Router);

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Program Day' },
    { key: 'workoutCount', label: 'Workouts Done' },
    { key: 'createdAt', label: 'Date Created', transform: (value) => this.datePipe.transform(value, 'mediumDate') || '' }
  ];

  errors: string[] = [];

  newProgram: Program = {
    name: '',
    days: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  newWorkout: Workout = {
    programDayId: '',
    name: '',
    exercises: [],
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  programs: Program[] = [];

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService.getPrograms().subscribe({
      next: (response: ApiResponse<Program[]>) => {
        if (response.data) {
          this.programs = response.data;
          console.log(this.programs)
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err) => {
        console.error('Could not load data from Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  createNewProgram(): void {
    this.programService.createNewProgram(this.newProgram).subscribe({
      next: (response: ApiResponse<Program>) => {
        if (response.data) {
          this.newProgram = response.data;
          this.changeDetectorRef.detectChanges();
          this.router.navigate(['/edit-program', response.data?._id]);
        }
      },
      error: (err) => {
        console.error('Could not add new program to Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }

    });
  }

  startWorkout(programId: string, rowItem: any): void {
    this.newWorkout = {
      programDayId: rowItem._id,
      name: `${rowItem.name}`,
      exercises: rowItem.exercises,
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Starting workout for program day:', this.newWorkout);
    this.createNewWorkout(programId);
  }

  createNewWorkout(programId: string): void {
    this.workoutService.createWorkout(this.newWorkout, programId).subscribe({
      next: (response: ApiResponse<Workout>) => {
        if (response.data) {
          console.log(response);
          this.newWorkout = response.data;
          this.changeDetectorRef.detectChanges();
          this.router.navigate(['/tracker', response.data._id]);
        }
      },
      error: (err) => {
        console.error('Could not add new workout to Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }

    });
  }

  increaseWorkoutCount(programId: string, programDay: ProgramDay) {
    if (!programDay.workoutCount || programDay.workoutCount === undefined) {
      programDay.workoutCount = 0;
    }
    programDay.workoutCount++;

    console.log(programDay)
    this.programService.updateProgramDay(programId, programDay).subscribe({
      next: (response: ApiResponse<ProgramDay>) => {
        this.loadPrograms();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not update workout count on Express server:', err);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
}
