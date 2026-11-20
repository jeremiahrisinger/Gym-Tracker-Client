import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { Error } from '../../../common/error/error';
import { WorkoutService } from '../../services/workout-service';
import { Workout } from '../../models/workout';
import { Table } from '../../../common/components/table/table';
import { TableColumn } from '../../../common/models/table-column';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../core/models/api-response';


@Component({
  imports: [PageTitle, FormsModule, Error, Table],
  selector: 'app-workout-list',
  styleUrl: './workout-list.css',
  templateUrl: './workout-list.html',
})
export class WorkoutList implements OnInit {

  private workoutService = inject(WorkoutService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  errors: string[] = [];
  workouts: Workout[] = [];
  newWorkout: Workout = {
    name: '',
    notes: '',
    exercises: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Workout Name' },
    { key: 'date', label: 'Date' }
  ];

  ngOnInit(): void {
    this.loadWorkouts();
  }

  startWorkout(): void {
    this.createWorkout(this.newWorkout);
    this.editWorkout(this.newWorkout);
  }

  editWorkout(workout: Workout): void {
    this.router.navigate(['/tracker', workout._id]);
  }

  loadWorkouts(): void {
    this.workoutService.getWorkouts().subscribe({
      next: (response: ApiResponse<Workout[]>) => {
        this.workouts = response.data || [];
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  createWorkout(workout: Workout): void {
    this.workoutService.createWorkout(workout).subscribe({
      next: (response: ApiResponse<Workout>) => {
        this.loadWorkouts();
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not create workout:', err);
      }
    });
  }

  deleteWorkout(workout: Workout): void {
    this.workoutService.deleteWorkout(workout).subscribe({
      next: (response: ApiResponse<any>) => {
        this.loadWorkouts();
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not delete workout:', err);
      }
    });
  }
}
