import { Component, inject, OnInit, ChangeDetectorRef, input, computed, signal } from '@angular/core';
import { Set } from '../../models/set';
import { FormsModule } from '@angular/forms';
import { Table } from '../../../common/components/table/table';
import { TableColumn } from '../../../common/models/table-column';
import { WorkoutService } from '../../services/workout-service';
import { Workout } from '../../models/workout';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { Error } from '../../../common/error/error';
import { ApiResponse } from '../../../core/models/api-response';
import { isMetricMatch, Metric } from '../../models/metric';
import { Exercise } from '../../models/exercise';
import { Tabs } from '../../../common/components/tabs/tabs';
import { TabItem } from '../../../common/models/tab-item';
import { SectionHeader } from '../../../common/components/section-header/section-header';
import { Input } from '../../../common/components/input/input';


@Component({
  imports: [FormsModule, Table, Tabs, PageTitle, Error, SectionHeader, Input],
  providers: [DatePipe],  
  selector: 'app-workout-tracker',
  styleUrl: './workout-tracker.css',
  templateUrl: './workout-tracker.html',
})
export class WorkoutTracker implements OnInit {
  private workoutService = inject(WorkoutService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  tableColumns: TableColumn[] = [
    { key: 'setNumber', label: 'Set' },
    { 
      key: 'completed', 
      label: 'Status', 
      help: 'A circle with an X means the set is incomplete, a cirlce with a checkmark mean the set is complete.',
      useMatIcon: true, 
      transform: (value) => value ? 'check_circle' : 'cancel ' },
    { 
      key: 'target', 
      label: 'Target', 
      help: 'The reps, weight, pause, and tempo in the programmed set.',
      transform: (value) => { if (value) { return `${value.reps} @ ${value.weight}lbs RPE: ${value.rpe} Pause: ${value.pauseTop} | ${value.pauseMiddle} | ${value.pauseBottom} Tempo: ${value.ecentricTempo} | ${value.concentricTempo}` } else { return `N/A` } } },
    { 
      key: 'actual', 
      label: 'Reps', 
      help: 'The number of whole reps completed in this set.',
      transform: (value) => value.reps || 0 
    },
    { 
      key: 'actual', 
      label: 'Weight', 
      transform: (value) => `${value.weight || 0} lbs` 
    },
    { 
      key: 'actual', 
      label: 'RPE', 
      help:'Rate of Perceived Exertion (Rating of Perceived Effort) is a subjective scale (1-10) used to measure how hard your body works during physical activity, exercise, or training.',
      transform: (value) => value.rpe || 1 },
    { 
      key: 'actual', 
      label: 'Pauses', 
      help: 'Pause is the number of seconds you staticly hold the exercise at the top, middle, or bottom of the rep. Top | Middle | Bottom',
      transform: (value) => `${value.pauseTop || 0}" | ${value.pauseMiddle || 0}" | ${value.pauseBottom || 0}"` 
    },
    { 
      key: 'actual', 
      label: 'Tempo', 
      help: 'Eccentric tempo is the number of seconds spent lowering or resisting a weight as a muscle lengthens, while concentric tempo is the number of seconds spent lifting or pushing a weight as a muscle shortens. Ecentric | Concentric',
      transform: (value) => `${value.ecentricTempo || 0}" | ${value.concentricTempo || 0}"` 
    },
  ];

  workoutId = input.required<string>();
  errors: string[] = [];
  editMode = false;

  newExercise: Exercise = {
    name: '',
    sets: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  newSet: Set = {
    setNumber: 1,
    target: undefined,
    actual: {
      reps: 0,
      weight: 0,
      rpe: 1,
      pauseTop: 0,
      pauseMiddle: 0,
      pauseBottom: 0,
      ecentricTempo: 0,
      concentricTempo: 0
    },
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  newMetric: Metric = {
    reps: 0,
    weight: 0,
    rpe: 1,
    pauseTop: 0,
    pauseMiddle: 0,
    pauseBottom: 0,
    ecentricTempo: 0,
    concentricTempo: 0
  };

  workout: Workout = {
    exercises: [],
    name: '',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  tabItems = computed<TabItem[]>(() =>
    this.workout.exercises.map((ex) => ({
      id: ex._id || 0,
      label: ex.name,
      badge: ex.sets.length
    }))
  );
  activeTab = signal<TabItem>(this.tabItems()[0]);

  activeExercise = computed(() => { return this.workout.exercises[0]; });


  ngOnInit(): void {
    this.loadWorkout();
  }

  getActiveExercise(): Exercise {
    this.activeExercise = computed(() => {
      const exercise = this.workout.exercises.find(e => e._id === this.activeTab().id);
      return exercise || this.workout.exercises[0];
    });

    return this.activeExercise();
  }

  resetActiveExercise(tabIndex: number) {
    this.tabItems = computed<TabItem[]>(() =>
      this.workout.exercises.map((ex) => ({
        id: ex._id || 0,
        label: ex.name,
        badge: ex.sets.length
      }))
    );
    this.activeTab = signal<TabItem>(this.tabItems()[tabIndex]);

    this.activeExercise = computed(() => {
      const exercise = this.workout.exercises.find(e => e._id === this.activeTab().id);
      return exercise || this.workout.exercises[0];
    });

    this.changeDetectorRef.detectChanges();
  }

  loadWorkout(): void {
    this.workoutService.getWorkoutById(this.workoutId()).subscribe({
      next: (response: ApiResponse<Workout>) => {
        if (response.data) {
          this.workout = response.data;

          this.resetActiveExercise(0);
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  deleteWorkout(): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this full workout log history? This cannot be undone.');

    if (!confirmDelete) return;

    this.workoutService.deleteWorkout(this.workout).subscribe({
      next: (response: ApiResponse) => {
        this.router.navigate(['/workouts']);
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    });

  }

  addExercise(): void {
    const sameExercise = this.workout.exercises.find(
      e => e.name.toLowerCase() === this.newExercise.name.toLowerCase()
    );
    if (sameExercise) {
      this.resetActiveExercise(this.workout.exercises.indexOf(sameExercise));
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.workoutService.addExerciseToWorkout(this.workout, this.newExercise).subscribe({
      next: (response: ApiResponse<Workout>) => {
        if (response.data) {
          this.workout = response.data;
          this.resetActiveExercise(this.tabItems().length)
          this.changeDetectorRef.detectChanges();

        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not add new exercise to Express server:', err);
      }
    });
  }

  editSetInExercise(metric: Set) {
    this.newSet = metric;
    if (this.newSet.actual) {
      this.newMetric = this.newSet.actual;
    }
    this.editMode = true;
  }

  deleteExercise(exercise: Exercise): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this exercise and its sets? This cannot be undone.');

    if (!confirmDelete) return;

    this.workoutService.deleteExerciseFromWorkout(this.workout, exercise).subscribe({
      next: (response: ApiResponse<Workout>) => {
        if (response.data) {
          this.workout = response.data;
          this.changeDetectorRef.detectChanges();
          this.loadWorkout();
        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not delete exercise from Express server:', err);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  addSetToExercise(exercise: Exercise, newMetric: Metric): void {
    this.newSet.actual = newMetric;
    this.newSet.setNumber = exercise.sets.length + 1;
    exercise.sets.push(this.newSet);

    this.workoutService.updateExerciseInWorkout(this.workout, exercise).subscribe({
      next: (response: ApiResponse<Workout>) => {
        if (response.data) {
          this.workout = response.data;
          this.changeDetectorRef.detectChanges();
          this.newMetric = {
            reps: 0,
            weight: 0,
            rpe: 1,
            pauseTop: 0,
            pauseMiddle: 0,
            pauseBottom: 0,
            ecentricTempo: 0,
            concentricTempo: 0
          };
        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not add set to exercise on Express server:', err);
        exercise.sets.pop();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  markSetComplete(exercise: Exercise, set: Set) {
    this.newSet = set;
    if (set.target) {
      this.updateSetInExercise(exercise, set.target!)
    }
    this.changeDetectorRef.detectChanges();

  }

  updateSetInExercise(exercise: Exercise, newMetric: Metric): void {
    this.newSet.actual = newMetric;
    this.newSet.completed = isMetricMatch(this.newSet.target, this.newSet.actual);

    const updatedSets = exercise.sets.map(s => s._id === this.newSet._id ? this.newSet : s);
    exercise.sets = updatedSets;
    this.workoutService.updateExerciseInWorkout(this.workout, exercise).subscribe({
      next: (response: ApiResponse<Workout>) => {
        if (response.data) {
          this.workout = response.data;
          this.newMetric = {
            reps: 0,
            weight: 0,
            rpe: 1,
            pauseTop: 0,
            pauseMiddle: 0,
            pauseBottom: 0,
            ecentricTempo: 0,
            concentricTempo: 0
          };
          this.changeDetectorRef.detectChanges();

        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not add set to exercise on Express server:', err);
        exercise.sets.pop();
        this.changeDetectorRef.detectChanges();
      }
    });
    this.editMode = false;

  }

  deleteSetFromExercise(exercise: Exercise, setToDelete: Set): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this set? This cannot be undone.');

    if (!confirmDelete) return;

    exercise.sets = exercise.sets.filter(set => set !== setToDelete);

    this.workoutService.updateExerciseInWorkout(this.workout, exercise).subscribe({
      next: (response: ApiResponse<Workout>) => {
        if (response.data) {
          this.workout = response.data;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        console.error('Could not delete set from exercise on Express server:', err);
        exercise.sets.push(setToDelete);
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
