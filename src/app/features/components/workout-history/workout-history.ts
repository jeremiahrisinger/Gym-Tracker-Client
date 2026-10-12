import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonTable } from '../../../common/common-table/common-table';
import { TableColumn } from '../../../common/models/table-column';
import { WorkoutService } from '../../services/workout-service';
import { Workout } from '../../models/workout';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageTitle } from '../../../common/page-title/page-title';

@Component({
  imports: [CommonTable, FormsModule, RouterLink, PageTitle],
  providers: [DatePipe],
  selector: 'app-workout-history',
  styleUrl: './workout-history.css',
  templateUrl: './workout-history.html',
})
export class WorkoutHistory implements OnInit {

  private workoutService = inject(WorkoutService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);
  private router = inject(Router);

  tableColumns: TableColumn[] = [
    { key: 'exercise', label: 'Exercise', sortable: true, filterable: true },
    { key: 'sets', label: 'Sets', sortable: true, filterable: true },
    { key: 'reps', label: 'Reps', sortable: true, filterable: true },
    { key: 'weight', label: 'Weight', sortable: true, filterable: true },
    { key: 'rateOfPerceivedExertion', label: 'RPE', sortable: true, filterable: true },
    { key: 'notes', label: 'Notes', sortable: false, filterable: true }
  ];

  newWorkout: Workout = {
    programDayId: '',
    name: '',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    sets: []
  };

  workouts: Workout[] = [];

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.workoutService.getWorkouts().subscribe({
      next: (data) => {
        this.workouts = data;
        this.changeDetectorRef.detectChanges(); // Trigger change detection to update the view
      },
      error: (err) => {
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  createNewWorkout(): void {
    this.workoutService.addWorkout(this.newWorkout).subscribe({
      next: (data: any) => {
        this.newWorkout = data;
        this.changeDetectorRef.detectChanges();
        this.router.navigate(['/tracker', data.id]);
      },
      error: (err) => {
        console.error('Could not add new workout to Express server:', err);
      }

    })
  }
}
