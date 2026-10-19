import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonTable } from '../../../common/common-table/common-table';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProgramService } from '../../services/program-service';
import { DatePipe } from '@angular/common';
import { TableColumn } from '../../../common/models/table-column';
import { Program } from '../../models/program';
import { WorkoutService } from '../../services/workout-service';
import { Workout } from '../../models/workout';
import { ApiResponse } from '../../../core/models/api-response';
import { Error } from '../../../common/error/error';
import { PageTitle } from '../../../common/page-title/page-title';

@Component({
  imports: [CommonTable, FormsModule, RouterLink, Error, PageTitle],
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
    { key: 'name', label: 'Program Day', sortable: true, filterable: true },
    { key: 'completionCount', label: 'Workouts Done', sortable: true, filterable: true },
    { key: 'createdAt', label: 'Date Created', sortable: true, filterable: true, transform: (value) => this.datePipe.transform(value, 'mediumDate') || '' }
  ];

  errors: string[] = [];

  newProgram: Program = {
    name: '',
    programDays: [],
    programLength: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  newWorkout: Workout = {
    programDayId: '',
    name: '',
    sets: [],
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

  startWorkout(rowItem: any): void {
    this.newWorkout = {
      programDayId: rowItem._id,
      name: 'Week ' + rowItem.completionCount + ': ' + rowItem.name,
      sets: rowItem.programSets.map((programSet: any) => programSet.liftingSet),
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Starting workout for program day:', this.newWorkout);
    this.createNewWorkout();
    //this.increaseProgramDayCompletionCount(rowItem);
  }

  // increaseProgramDayCompletionCount(rowItem: any) {
  //   rowItem.completionCount += 1;
  //   this.programService.updateProgramDay(rowItem._id).subscribe({
  //     next: (data: any) => {
  //       console.log('Program day completion count increased:', data);
  //       this.changeDetectorRef.detectChanges();
  //     },
  //     error: (err) => {
  //       console.error('Could not update program day completion count on Express server:', err);
  //          this.errors = [err.error.message];
   //         this.changeDetectorRef.detectChanges();
  //     }
  //   });
  // }

  createNewWorkout(): void {
    this.workoutService.addWorkout(this.newWorkout).subscribe({
      next: (response: any) => {
        this.newWorkout = response.data;
        this.changeDetectorRef.detectChanges();
        this.router.navigate(['/tracker', response.data.id]);
      },
      error: (err) => {
        console.error('Could not add new workout to Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }

    })
  }

}
