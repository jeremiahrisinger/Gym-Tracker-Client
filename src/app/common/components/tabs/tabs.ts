import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { TabItem } from '../../models/tab-item';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [CommonModule],
  selector: 'app-tabs',
  styleUrl: './tabs.css',
  templateUrl: './tabs.html',
})
export class Tabs {
  tabs = input.required<TabItem[]>();
  initialIndex = input<number>(0);
  title = input<string>('');
  activeId = input.required<number|undefined>();

  tabChange = output<TabItem>();

  selectTab(tab: TabItem) {
    this.tabChange.emit(tab);
  }

}
