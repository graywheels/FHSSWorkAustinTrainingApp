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
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { MatSelectModule } from "@angular/material/select";
// import { TaskStatus } from '../../../enums/task-status';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule, DatePipe, MatSelectModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})

export class TaskCardComponent {
  trpc = inject(TRPC_CLIENT)

  editMode = signal<boolean>(false);
  initialTaskValue = input.required<Task>(); //declares an input signal of type Task. 
  // The required marker means the parent component will error if it does not provide a Task.
  newTitle = linkedSignal(() => this.initialTaskValue().title); // a linkedSignal needs a computation function to be created. This function should return a value that the signal can be set to.
  newDescription = linkedSignal(() => this.initialTaskValue().description);
  newStatus = linkedSignal(() => this.initialTaskValue().status);

  taskCardState = trpcResource(this.trpc.taskManagement.updateTask.mutate, () => ({
    taskId: this.initialTaskValue().id,
    newTitle: this.newTitle(),
    newDescription: this.newDescription(),
    newStatus: this.newStatus()
  }), { valueComputation: () =>  this.initialTaskValue() }); // valueComputation works just like linkedSignals

  
  constructor() {
    effect(() => {
      const state = this.taskCardState.value()
      if (state) {
        this.newTitle.set(state.title)
        this.newDescription.set(state.description)
        this.newStatus.set(state.status)
      }
    })
  }

  save() {
    this.taskCardState.value.update((prevTask) => {
      if(prevTask === undefined) return undefined
      return {
        ...prevTask,
        title: this.newTitle(),
        description: this.newDescription(),
        status: this.newStatus(),
      }
    })
    this.taskCardState.refresh(); // manually call our update procedure through the trpc resource
    this.editMode.set(false)
  }

  cancel() {
    this.newTitle.set(this.taskCardState.value()?.title ?? '')
    this.newDescription.set(this.taskCardState.value()?.description ?? '')
    this.editMode.set(false);
    this.newStatus.set(this.taskCardState.value()?.status ?? 'Incomplete');
  }
  // ...
}
