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
import { Input } from '../../../common/components/input/input';
import { Exercise } from '../../models/exercise';


@Component({
  imports: [PageTitle, FormsModule, Error, Table, Input],
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
    { key: 'exercises', label: 'Exercies', asList: true, transform: (value) => this.getExercisesAsString(value) }
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
        this.changeDetectorRef.detectChanges();

      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not create workout:', err);
      }
    });
  }

  deleteWorkout(workout: Workout): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this full workout? This cannot be undone.');

    if (!confirmDelete) return;

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

  getExercisesAsString(exercises: Exercise[]): string[] {
    var ret: string[] = [];
    var str = '';
    exercises.forEach(e => {
      var reps = e.sets.map(s => (s.target?.reps! | s.actual?.reps!)).sort((a, b) => a - b);
      var weights = e.sets.map(s => (s.target?.weight! | s.actual?.weight!)).sort((a, b) => a - b);
      var weightStr = this.rangeToString(weights[0], weights[weights.length - 1]);

      str = `${e.name}`;
      if (e.sets.length !== 0) {
        str += ` - ${e.sets.length} x `
          + this.rangeToString(reps[0], reps[reps.length - 1]);
      }

      if (weightStr !== '0') {
        str += ` @ `
          + weightStr
          + `lbs`;
      }
      ret.push(str);
    });

    return ret;
  }

  rangeToString(num: number, num2: number): string {
    if (num === num2) {
      return `${num | 0}`
    } else {
      return `${num | 0} - ${num2 | 0}`
    }
  }
}

