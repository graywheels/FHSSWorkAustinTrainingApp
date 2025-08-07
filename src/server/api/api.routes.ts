import { setAccess } from './user-management/set-access/set-access'
import { createUser } from './user-management/create-user/create-user';
import { deleteUser } from './user-management/delete-user/delete-user';
import { getUser } from './user-management/get-user/get-user';
import { getUsers } from './user-management/get-users/get-users';
import { router } from './trpc';
import { createTask } from './task-management/create-task/create-task';
import { deleteTask } from './task-management/delete-task/delete-task';
import { getTasksByUser } from './task-management/get-tasks-by-user/get-tasks-by-user';
import { updateTask } from './task-management/update-task/update-task';

export const appRouter = router({
  taskManagement: {
    getTasksByUser,
    createTask,
    deleteTask,
    updateTask,
  },
  userManagement: {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    setAccess,
  },
});
