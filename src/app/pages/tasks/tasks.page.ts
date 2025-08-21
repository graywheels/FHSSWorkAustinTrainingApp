import { Component, inject, signal, viewChild } from '@angular/core';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { ConfirmationDialog, trpcResource } from '@fhss-web-team/frontend-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  imports: [MatProgressSpinnerModule, MatPaginator, MatIconModule, MatButtonModule, TaskCardComponent],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss'
})

export class TasksPage {

  trpc = inject(TRPC_CLIENT);

  PAGE_SIZE = 12;
  pageOffset = signal(0);

  taskResource = trpcResource(
    this.trpc.taskManagement.getTasksByUser.mutate,
    () => ({
      pageSize: this.PAGE_SIZE,
      pageOffset: this.pageOffset(),
    }),
    { autoRefresh: true }
  );
getTasks: any;

  handlePageEvent(e: PageEvent) {
    this.pageOffset.set(e.pageIndex * e.pageSize);
  }


}
