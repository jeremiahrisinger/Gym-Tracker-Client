import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TabItem } from '../../../common/models/tab-item';
import { TableColumn } from '../../../common/models/table-column';
import { ApiResponse } from '../../../core/models/api-response';
import { Exercise } from '../../models/exercise';
import { Metric } from '../../models/metric';
import { Set } from '../../models/set';
import { Workout } from '../../models/workout';
import { WorkoutService } from '../../services/workout-service';
import { FormsModule } from '@angular/forms';
import { Table } from '../../../common/components/table/table';
import { Tabs } from '../../../common/components/tabs/tabs';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { SectionHeader } from '../../../common/components/section-header/section-header';
import { Error } from '../../../common/error/error';
import { ProgramDay } from '../../models/program';
import { ProgramService } from '../../services/program-service';

@Component({
  imports: [FormsModule, Table, Tabs, PageTitle, SectionHeader, Error, RouterLink],
  selector: 'app-edit-day',
  styleUrl: './edit-day.css',
  templateUrl: './edit-day.html',
})
export class EditDay implements OnInit {
  private programService = inject(ProgramService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  tableColumns: TableColumn[] = [
    { key: 'setNumber', label: 'Set' },
    { key: 'target', label: 'Reps', transform: (value) => value.reps },
    { key: 'target', label: 'Weight', transform: (value) => `${value.weight} lbs` },
    { key: 'target', label: 'RPE', transform: (value) => value.rpe },
    { key: 'target', label: 'Pauses', transform: (value) => `${value.pauseTop}" | ${value.pauseMiddle}" | ${value.pauseBottom}"` },
    { key: 'target', label: 'Tempo', transform: (value) => `${value.ecentricTempo}" | ${value.concentricTempo}"` },
  ];

  programId = input.required<string>();
  dayId = input.required<string>();

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
    target: {
      reps: 0,
      weight: 0,
      rpe: 1,
      pauseTop: 0,
      pauseMiddle: 0,
      pauseBottom: 0,
      ecentricTempo: 0,
      concentricTempo: 0
    },
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

  programDay: ProgramDay = {
    exercises: [],
    name: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  tabItems = computed<TabItem[]>(() =>
    this.programDay.exercises.map((ex) => ({
      id: ex._id || 0,
      label: ex.name,
      badge: ex.sets.length
    }))
  );
  activeTab = signal<TabItem>(this.tabItems()[0]);

  activeExercise = computed(() => { return this.programDay.exercises[0]; });


  ngOnInit(): void {
    this.loadProgramDay();
  }

  getActiveExercise(): Exercise {
    this.activeExercise = computed(() => {
      const exercise = this.programDay.exercises.find(e => e._id === this.activeTab().id);
      return exercise || this.programDay.exercises[0];
    });

    return this.activeExercise();
  }

  resetActiveExercise(tabIndex: number) {
    console.log(tabIndex)
    this.tabItems = computed<TabItem[]>(() =>
      this.programDay.exercises.map((ex) => ({
        id: ex._id || 0,
        label: ex.name,
        badge: ex.sets.length
      }))
    );
    this.activeTab = signal<TabItem>(this.tabItems()[tabIndex]);

    this.activeExercise = computed(() => {
      const exercise = this.programDay.exercises.find(e => e._id === this.activeTab().id);
      return exercise || this.programDay.exercises[0];
    });

    this.changeDetectorRef.detectChanges();
  }

  loadProgramDay(): void {
    this.programService.getProgramDayById(this.programId(), this.dayId()).subscribe({
      next: (response: ApiResponse<ProgramDay>) => {
        if (response.data) {
          console.log(response.data)
          this.programDay = response.data;

          this.resetActiveExercise(0);
          console.log(this.tabItems)
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

  deleteProgramDay(): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this full program day? This cannot be undone.');

    if (!confirmDelete) return;

    this.programService.removeDayFromProgram(this.programId(), this.programDay).subscribe({
      next: (response: ApiResponse) => {
        this.router.navigate(['/edit-program', this.programId()]);
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    });

  }

  addExercise(): void {

    console.log(this.programDay)
    console.log(this.newExercise)
    const sameExercise = this.programDay.exercises.find(
      e => e.name.toLowerCase() === this.newExercise.name.toLowerCase()
    );
    console.log(sameExercise);
    if (sameExercise) {
      this.resetActiveExercise(this.programDay.exercises.indexOf(sameExercise));
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.programService.addExerciseToProgramDay(this.programId(), this.dayId(), this.newExercise).subscribe({
      next: (response: ApiResponse<ProgramDay>) => {
        if (response.data) {
          this.programDay = response.data;
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
    console.log(metric)
    this.newSet = metric;
    if (this.newSet.target) {
      this.newMetric = this.newSet.target;
    }
    this.editMode = true;
  }

  deleteExercise(exercise: Exercise): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this exercise and its sets? This cannot be undone.');

    if (!confirmDelete) return;

    this.programService.removeExerciseFromProgramDay(this.programId(), this.dayId(), exercise).subscribe({
      next: (response: ApiResponse<ProgramDay>) => {
        if (response.data) {
          this.programDay = response.data;
          this.changeDetectorRef.detectChanges();
          this.loadProgramDay();
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
    console.log(newMetric)
    this.newSet.target = newMetric;
    this.newSet.setNumber = exercise.sets.length + 1;
    exercise.sets.push(this.newSet);
    console.log(exercise)
    this.programService.updateExerciseInProgramDay(this.programId(), this.dayId(), exercise).subscribe({
      next: (response: ApiResponse<ProgramDay>) => {
        if (response.data) {
          this.programDay = response.data;
          console.log(this.programDay)
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
  }

  updateSetInExercise(exercise: Exercise, newMetric: Metric): void {
    this.newSet.target = newMetric;
    const updatedSets = exercise.sets.map(s => s._id === this.newSet._id ? this.newSet : s);
    exercise.sets = updatedSets;
    this.programService.updateExerciseInProgramDay(this.programId(), this.dayId(), exercise).subscribe({
      next: (response: ApiResponse<ProgramDay>) => {
        if (response.data) {
          this.programDay = response.data;
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
    exercise.sets = exercise.sets.filter(set => set !== setToDelete);

    this.programService.updateExerciseInProgramDay(this.programId(), this.dayId(), exercise).subscribe({
      next: (response: ApiResponse<ProgramDay>) => {
        if (response.data) {
          this.programDay = response.data;
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
