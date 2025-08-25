import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';

@Component({
  selector: 'app-task-create-modal',
  imports: [MatIconModule, MatCardModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './task-create-modal.component.html',
  styleUrls: ['./task-create-modal.component.scss']
})
export class TaskCreateModalComponent {
  trpc = inject(TRPC_CLIENT);

  @Output() cancelHandler = new EventEmitter<void>();  //Events the parent can listen to
  @Output() saveHandler = new EventEmitter<{ title: string; description: string }>();

  newTitle = signal('');
  newDescription = signal('');

  createTask = trpcResource(this.trpc.taskManagement.createTask.mutate, () => ({
    title: this.newTitle(),
    description: this.newDescription(),
  }));

  async save() {
    await this.createTask.refresh();
    if (!this.createTask.error()) {
      this.saveHandler.emit({  //if there’s no error, it emits saveHandler with the values so the parent can
        title: this.newTitle(),  // so it can close the modal and refresh the task list
        description: this.newDescription(),
      });
    }
  }

  onCancel() {
    this.newTitle.set('');
    this.newDescription.set('');
    this.cancelHandler.emit();
  }
}
