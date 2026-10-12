import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonTable } from '../../../common/common-table/common-table';
import { Router, RouterLink } from '@angular/router';
import { ProgramService } from '../../services/program-service';
import { TableColumn } from '../../../common/models/table-column';
import { LiftingSet } from '../../models/lifting-set';
import { ProgramSet } from '../../models/program';

@Component({
  imports: [FormsModule, CommonTable, RouterLink],
  providers: [DatePipe],
  selector: 'app-edit-program-day',
  styleUrl: './edit-program-day.css',
  templateUrl: './edit-program-day.html',
})
export class EditProgramDay {
  private programService = inject(ProgramService);
  private datePipe = inject(DatePipe);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);


  tableColumns: TableColumn[] = [
    { key: 'liftingSet', label: 'Exercise', sortable: true, filterable: true, transform: (value) => value?.exercise || 'Unknown Exercise' },
    { key: 'liftingSet', label: 'Sets', sortable: true, filterable: false, transform: (value) => value?.sets !== undefined ? value.sets.toString() : '0' },
    { key: 'liftingSet', label: 'Reps', sortable: true, filterable: false, transform: (value) => value?.reps !== undefined ? value.reps.toString() : '0' },
    { key: 'liftingSet', label: 'Weight', sortable: true, filterable: false, transform: (value) => value?.weight !== undefined ? value.weight.toString() : '0' },
    { key: 'repIncrement', label: 'Rep Increment', sortable: true, filterable: false },
    { key: 'setIncrement', label: 'Set Increment', sortable: true, filterable: false },
    { key: 'weightIncrement', label: 'Weight Increment', sortable: true, filterable: false }
  ];

  id = input.required<string>();
  dayName = input.required<string>();

  programDay: any;

  newProgramSet: ProgramSet = {
    liftingSet: {
      exercise: '',
      sets: 0,
      reps: 0,
      weight: 0,
      rateOfPerceivedExertion: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: ''
    },
    setIncrement: 0,
    repIncrement: 0,
    weightIncrement: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  ngOnInit(): void {
    this.loadProgramDay();
  }

  loadProgramDay(): void {
    this.programService.getProgramDayByName(this.id(), this.dayName()).subscribe({
      next: (data: any) => {
        this.programDay = data.programDay;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  addProgramSet(): void {
    this.programService.addSetToProgramDay(this.id(), this.dayName(), this.newProgramSet).subscribe({
      next: (data: any) => {
        this.programDay.updatedAt = new Date();
        this.programDay.programSets = [...this.programDay.programSets, data.addedSet];
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  deleteProgramSet(rowItem: any): void {
    const confirmDelete = confirm('Are you absolutely sure you want to delete this program set? This cannot be undone.');

    if (!confirmDelete) return;

    this.programService.removeSetFromProgramDay(this.id(), this.dayName(), rowItem).subscribe({
      next: (response) => {
        const index = this.programDay.programSets.indexOf(rowItem);
        if (index > -1) {
          this.programDay.programSets.splice(index, 1);
          this.changeDetectorRef.detectChanges();
        }

        this.programDay = response;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Could not load data from Express server:', err);
      }
    });
  }
}

