import { Component, input, model, NgModule } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

export type InputType = 'text' | 'number' | 'date' | 'time' | 'email' | 'password';
export type SizeType = 'small' | 'medium' |'large';

@Component({
  imports: [MatIcon, FormsModule],
  selector: 'app-input',
  styleUrl: './input.css',
  templateUrl: './input.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class Input {
  label = input.required<string>();
  name = input.required<string>();
  type = input<InputType>('number');
  helpText = input<string>();
  required = input<boolean>(false);
  min = input<number>(0);
  size = input<SizeType>('small');
  value = model<number| string | undefined | null>(null);
  placeholder = input<string>();

}
