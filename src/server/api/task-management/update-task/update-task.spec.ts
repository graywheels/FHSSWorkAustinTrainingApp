import { describe, expect, it } from "vitest";
import { Status, User, prisma } from "../../../../../prisma/client";
import { generateDummyUserData } from "../../../dummy/helpers/dummy-user";
import { appRouter } from "../../api.routes";
import { generateDummyTaskData } from "../../../dummy/helpers/dummy-task";
import { faker } from "@faker-js/faker";

describe('Update task', () => {
  let requestingUser: User;
  let updateTask: ReturnType<typeof appRouter.createCaller>['taskManagement']['updateTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: ['manage-tasks'],
        roles: [],
      }),
    });
    updateTask = appRouter.createCaller({userId: requestingUser.id}).taskManagement.updateTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  })

  it('it updates the task when set to complete', async () => {
    const taskData = generateDummyTaskData({ownerId: requestingUser.id, status: 'Incomplete'})
    const task = await prisma.task.create({data: taskData});

    try{
      const title = faker.book.title();
      const description = faker.commerce.productDescription();
      const status: Status = 'Complete';

      const updatedTask = await updateTask({
        taskId: task.id, 
        newTitle: title, 
        newDescription: description, 
        newStatus: status
      })

      expect(updatedTask).toBeDefined();
      expect(updatedTask.title).toBe(title);
      expect(updatedTask.description).toBe(description);
      expect(updatedTask.status).toBe(status);
      expect(updatedTask.completedAt).toBeInstanceOf(Date);

    } finally{
      await prisma.task.delete({where: {id: task.id}})
    }
  })

  it('updates the task when taken off complete',async () => {
    const taskData = generateDummyTaskData({ownerId: requestingUser.id, status: 'Complete'})
    const task = await prisma.task.create({data: taskData});

    try{
      const title = faker.book.title();
      const description = faker.commerce.productDescription();
      const status: Status = 'Incomplete';

      const updatedTask = await updateTask({
        taskId: task.id, 
        newTitle: title, 
        newDescription: description, 
        newStatus: status
      })

      expect(updatedTask).toBeDefined();
      expect(updatedTask.title).toBe(title);
      expect(updatedTask.description).toBe(description);
      expect(updatedTask.status).toBe(status);
      expect(updatedTask.completedAt).toBeNull();

    } finally{
      await prisma.task.delete({where: {id: task.id}})
    }
  })

  it('errors if the task is not found',async () => {
    let error

    try{
      await updateTask({ taskId: faker.string.uuid()})
    }
    catch (err) {
      error = err
    }

    expect(error).toBeDefined();
    expect(error).toHaveProperty('code', 'NOT_FOUND');
  })
})