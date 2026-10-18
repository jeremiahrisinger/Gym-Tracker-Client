import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { ProgramService } from '../../services/program-service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TableColumn } from '../../../common/models/table-column';
import { Program, ProgramDay } from '../../models/program';
import { CommonTable } from '../../../common/common-table/common-table';
import { FormsModule } from '@angular/forms';
import { PageTitle } from '../../../common/page-title/page-title';
import { MatIconModule } from '@angular/material/icon';
import { Error } from '../../../common/error/error';
import { ApiResponse } from '../../../core/models/api-response';

@Component({
  imports: [FormsModule, CommonTable, RouterLink, PageTitle, MatIconModule, Error],
  providers: [DatePipe],
  selector: 'app-edit-program',
  styleUrl: './edit-program.css',
  templateUrl: './edit-program.html',
})
export class EditProgram {

  private programService = inject(ProgramService);
  private datePipe = inject(DatePipe);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'createdAt', label: 'Created Date', sortable: true, filterable: false, transform: (value) => this.datePipe.transform(value, 'mediumDate') || '' }
  ];
  errors: string[] = [];
  id = input.required<string>();

  newProgramDay: ProgramDay = {
    name: '',
    programSets: [],
    completionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  program: any;

  ngOnInit(): void {
    this.loadProgram();
  }

  loadProgram(): void {
    this.programService.getProgramById(this.id()).subscribe({
      next: (response: ApiResponse<Program>) => {
        console.log(`response: ${response.message}`);
        this.program = response.data;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Could not load data from Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deleteProgram(): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this program? This cannot be undone.');

    if (!confirmDelete) return;

    this.programService.deleteProgramById(this.id()).subscribe({
      next: (response: ApiResponse) => {
        console.log(`response: ${response.message}`);
        this.router.navigate(['/programs']);
      },
      error: (err) => {
        console.error('Could not load data from Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });

  }

  addProgramDay(): void {
    this.programService.addDayToProgram(this.id(), this.newProgramDay).subscribe({
      next: (response: ApiResponse) => {
        this.program.programDays = [...this.program.programDays, response.data];
        this.changeDetectorRef.detectChanges();
        this.router.navigate(['/edit-program-day', this.id(), response.data?.addedDay.name]);
      },
      error: (err) => {
        console.error('Could not add new programDay to Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deleteProgramDay(rowItem: any): void {
    this.programService.removeDayFromProgram(this.id(), rowItem).subscribe({
      next: (response: ApiResponse<Program>) => {
        console.log(`response: ${response.data}`);
        this.program = response.data;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Could not delete day from Express server:', err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  editProgramDay(rowItem: any): void {
    console.log(rowItem);
    this.router.navigate(['/edit-program-day', this.id(), rowItem.name]);
  }
}
