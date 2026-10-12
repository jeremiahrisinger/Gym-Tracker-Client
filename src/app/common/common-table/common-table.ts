import { Component, input, output } from '@angular/core';
import { TableColumn } from '../models/table-column';
import { MatIconModule } from '@angular/material/icon';


@Component({
  imports: [MatIconModule],
  selector: 'app-common-table',
  styleUrl: './common-table.css',
  templateUrl: './common-table.html',
})
export class CommonTable {
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  emptyMessage = input<string>('No data available');
  name = input<string>('');
  scrollable = input<boolean>(false);
  includeDeleteButton = input<boolean>(false);
  includeEditButton = input<boolean>(false);
  includeCustomButton = input<boolean>(false);
  customButtonLabel = input<string>('');
  customButtonIcon = input<string>('add');
  deleteRow = output<any>();
  editRow = output<any>();
  rowItem = output<any>();
}
