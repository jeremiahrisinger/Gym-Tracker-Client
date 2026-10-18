import { Component, inject, OnInit, ChangeDetectorRef, input } from '@angular/core';
import { LiftingSet } from '../../models/lifting-set';
import { LiftingSetService } from '../../services/lifting-set-service';
import { FormsModule } from '@angular/forms';
import { CommonTable } from '../../../common/common-table/common-table';
import { TableColumn } from '../../../common/models/table-column';
import { WorkoutService } from '../../services/workout-service';
import { Workout } from '../../models/workout';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageTitle } from '../../../common/page-title/page-title';
import { Error } from '../../../common/error/error';


@Component({
  imports: [FormsModule, CommonTable, RouterLink, PageTitle, Error],
  providers: [DatePipe],
  selector: 'app-workout-tracker',
  styleUrl: './workout-tracker.css',
  templateUrl: './workout-tracker.html',
})
export class WorkoutTracker implements OnInit {

  private workoutService = inject(WorkoutService);
  private datePipe = inject(DatePipe);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  tableColumns: TableColumn[] = [
    { key: 'exercise', label: 'Exercise', sortable: true, filterable: true },
    { key: 'sets', label: 'Sets', sortable: true, filterable: true },
    { key: 'reps', label: 'Reps', sortable: true, filterable: true },
    { key: 'weight', label: 'Weight', sortable: true, filterable: true },
    { key: 'rateOfPerceivedExertion', label: 'RPE', sortable: true, filterable: true },
    { key: 'createdAt', label: 'Date', sortable: true, filterable: false, transform: (value) => this.datePipe.transform(value, 'mediumTime') || '' },
    { key: 'notes', label: 'Notes', sortable: false, filterable: true }
  ];

  id = input.required<string>();
  errors: string[] = [];
  newSet: LiftingSet = {
    exercise: '',
    weight: 0,
    sets: 1,
    reps: 0,
    rateOfPerceivedExertion: "1",
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  workout: any;

  ngOnInit(): void {
    this.loadWorkout();
  }

  loadWorkout(): void {
    this.workoutService.getWorkoutById(this.id()).subscribe({
      next: (response: any) => {
        this.workout = response.data;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  deleteWorkout(): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this full workout log history? This cannot be undone.');

    if (!confirmDelete) return;

    this.workoutService.deleteWorkoutById(this.id()).subscribe({
      next: (response: any) => {
        console.log(`response: ${response.message}`);
        this.router.navigate(['/workouts']);
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not load data from Express server:', err);
      }
    });

  }

  addSet(): void {
    this.workoutService.addSetToWorkout(this.id(), this.newSet).subscribe({
      next: (response: any) => {
        console.log(`response: ${response.message}`);
        console.log('New set added:', response.addedSet);
        this.workout.sets = [...this.workout.sets, response.addedSet];
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not add new set to Express server:', err);
      }
    });
  }

  deleteSet(rowItem: any): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this set? This cannot be undone.');

    if (!confirmDelete) return;

    this.workoutService.removeSetFromWorkout(this.id(), rowItem).subscribe({
      next: (response: any) => {
        console.log(`response: ${response.message}`);
        console.log('Workout after set deletion:', response.workout);
        this.workout = response.workout;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not delete set from Express server:', err);
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
