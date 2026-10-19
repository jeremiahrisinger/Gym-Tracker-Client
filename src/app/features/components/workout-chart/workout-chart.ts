import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { LiftingSetService } from '../../services/lifting-set-service';
import { TableColumn } from '../../../common/models/table-column';
import { CommonTable } from '../../../common/common-table/common-table';
import { ApiResponse } from '../../../core/models/api-response';
import { LiftingSet } from '../../models/lifting-set';
import { Error } from '../../../common/error/error';
import { PageTitle } from '../../../common/page-title/page-title';

@Component({
  imports: [CommonTable, PageTitle, Error],
  selector: 'app-workout-chart',
  styleUrl: './workout-chart.css',
  templateUrl: './workout-chart.html',
})
export class WorkoutChart implements OnInit {
  private liftingSetService = inject(LiftingSetService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  tableColumns: TableColumn[] = [
    { key: 'exercise', label: 'Exercise', sortable: true, filterable: true },
    { key: 'weight', label: 'Weight', sortable: true, filterable: true },
    { key: 'reps', label: 'Reps', sortable: true, filterable: true }
  ];

  errors: string[] = [];

  @ViewChild('benchChart') benchChartRef!: ElementRef<HTMLCanvasElement>;
  benchChartInstance: Chart | null = null;
  benchSets: any[] = [];

  @ViewChild('squatChart') squatChartRef!: ElementRef<HTMLCanvasElement>;
  squatChartInstance: Chart | null = null;
  squatSets: any[] = [];

  @ViewChild('deadliftChart') deadliftChartRef!: ElementRef<HTMLCanvasElement>;
  deadliftChartInstance: Chart | null = null;
  deadliftSets: any[] = [];


  ngOnInit(): void {
    this.loadSquatSets();
    this.loadBenchSets();
    this.loadDeadliftSets();
  }

  loadBenchSets(): void {
    this.liftingSetService.getSetsByExercise('Bench Press').subscribe({
      next: (response: ApiResponse<LiftingSet[]>) => {
        this.benchSets = response.data?.splice(-5) || [];
        this.changeDetectorRef.detectChanges();
        this.renderChart(this.benchChartInstance, this.benchChartRef, this.benchSets);
      },
      error: (err) => {
        console.error(err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadSquatSets(): void {
    this.liftingSetService.getSetsByExercise('Back Squat').subscribe({
      next: (response: ApiResponse<LiftingSet[]>) => {
        this.squatSets = response.data?.splice(-5) || [];
        this.changeDetectorRef.detectChanges();

        this.renderChart(this.squatChartInstance, this.squatChartRef, this.squatSets);
      },
      error: (err) => {
        console.error(err)
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadDeadliftSets(): void {
    this.liftingSetService.getSetsByExercise('Deadlift').subscribe({
      next: (response: ApiResponse<LiftingSet[]>) => {
        this.deadliftSets = response.data?.splice(-5) || [];
        this.changeDetectorRef.detectChanges();

        this.renderChart(this.deadliftChartInstance, this.deadliftChartRef, this.deadliftSets);
      },
      error: (err) => {
        console.error(err);
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  renderChart(chartInstance: Chart | null, chartRef: ElementRef<HTMLCanvasElement>, sets: any[]): void {
    if (chartInstance) {
      chartInstance.destroy();
    }
    const labels = sets.map((set, index) => `Set ${index + 1}`);
    const weightData = sets.map(set => (set.weight * Math.pow(set.reps, 0.12)));

    chartInstance = new Chart(chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels, // X-Axis labels
        datasets: [
          {
            label: 'Weight Lifted (lbs)',
            data: weightData, // Y-Axis data points
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 2,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
