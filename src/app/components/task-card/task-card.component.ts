import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { boolean } from 'zod/v4';
import { Task } from '../../../../prisma/client';
import { Component, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
// import { TRPC_CLIENT } from '../../../utils/trpc.client';
// import { TaskStatus } from '../../../enums/task-status';
// import { StatusMenuComponent } from "../status-menu/status-menu.component";

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})

export class TaskCardComponent {
  editMode = signal<boolean>(false);
  initialTaskValue = input.required<Task>(); //declares an input signal of type Task. 
  // The required marker means the parent component will error if it does not provide a Task.
  newTitle = linkedSignal(() => this.initialTaskValue().title); // a linkedSignal needs a computation function to be created. This function should return a value that the signal can be set to.
  newDescription = linkedSignal(() => this.initialTaskValue().description);
}
