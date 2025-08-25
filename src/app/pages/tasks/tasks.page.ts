import { Component, inject, signal, viewChild } from '@angular/core';
import { TaskCreateModalComponent } from '../../components/task-create/task-create-modal.component';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { ConfirmationDialog, trpcResource } from '@fhss-web-team/frontend-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  imports: [MatProgressSpinnerModule, MatPaginator, MatIconModule, MatButtonModule, TaskCardComponent, TaskCreateModalComponent],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss'
})
export class TasksPage {
  trpc = inject(TRPC_CLIENT);
  PAGE_SIZE = 12;
  pageOffset = signal(0);
  showCreateModal = signal(false);

  taskResource = trpcResource(
    this.trpc.taskManagement.getTasksByUser.mutate,
    () => ({
      pageSize: this.PAGE_SIZE,
      pageOffset: this.pageOffset(),
    }),
    { autoRefresh: true }
  );

  handlePageEvent(e: PageEvent) {
    this.pageOffset.set(e.pageIndex * e.pageSize);
  }

  openNewTaskModal(): void {
    this.showCreateModal.set(true);
  }

  handleModalSave(task: { title: string; description: string }) {
    // TODO: Call backend to create task, then refresh list
    this.showCreateModal.set(false);
    // Example: this.trpc.taskManagement.createTask.mutate(task).then(() => this.taskResource.refresh());
  }

  handleModalCancel() {
    this.showCreateModal.set(false);
  }

  async taskCreated(){
    this.showCreateModal.set(false);
    await this.taskResource.refresh();
  }

  paginator = viewChild.required(MatPaginator)
  async deleteTask(taskId: string){
    // manually call our delete procedure. No need for a trpcResource in this case
    await this.trpc.taskManagement.deleteTask.mutate({taskId});
    await this.taskResource.refresh();

    // if we are not on the first page. And if we just deleted the last task on the current page. 
    if ( this.pageOffset() != 0 && this.taskResource.value()?.data.length === 0 ){
      this.paginator().previousPage();
    }
  }
}
