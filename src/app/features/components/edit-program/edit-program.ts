import { ChangeDetectorRef, Component, inject, input, OnInit } from '@angular/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { Error } from '../../../common/error/error';
import { Program, ProgramDay } from '../../models/program';
import { ProgramService } from '../../services/program-service';
import { ApiResponse } from '../../../core/models/api-response';
import { Table } from '../../../common/components/table/table';
import { TableColumn } from '../../../common/models/table-column';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../models/exercise';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [PageTitle, Error, Table, FormsModule, RouterLink],
  selector: 'app-edit-program',
  styleUrl: './edit-program.css',
  templateUrl: './edit-program.html',
})
export class EditProgram implements OnInit {
  private programService = inject(ProgramService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'exercises', label: 'Programmed Exercises', transform: (value) => this.getExerciseNames(value)}
  ]

  getExerciseNames(exercises: Exercise[]): string {
    return exercises.map(e => e.name).join(", ") || 'N/A';
  }
  errors: string[] = [];

  program: Program = {
    name: 'Untitled Program',
    days: [],
    createdAt: new Date,
    updatedAt: new Date
  }

  newDay: ProgramDay = {
    name: '',
    exercises:[],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  programId = input.required<string>();

  ngOnInit(): void {
    this.loadProgram();
  }

  loadProgram(): void {
    this.programService.getProgramById(this.programId()).subscribe({
      next: (response: ApiResponse<Program>) => {
        if (response.data) {
          this.program = response.data;
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

  addDay(){
    this.programService.addDayToProgram(this.programId(), this.newDay).subscribe({
      next: (response: ApiResponse<Program>) => {
        if (response.data) {
          this.program = response.data;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    })
  }

  deleteDayFromProgram(program:Program, day:ProgramDay){
    this.programService.removeDayFromProgram(this.programId(), day).subscribe({
      next: (response: ApiResponse<Program>) => {
        if (response.data) {
          this.program = response.data;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err) => {
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    })
  }

  editDayInProgram(day:ProgramDay){
    this.router.navigate(['/edit-program', this.program._id, day._id])
  }
}
