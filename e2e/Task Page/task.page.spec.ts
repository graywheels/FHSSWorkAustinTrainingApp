import { expect, Page, test } from '@playwright/test';
import { prisma } from '../../prisma/client';
import generateDummyUserData from '../User Helper Functions/generateDummyUserData';
import { TaskCreateManyInput } from '../../prisma/generated/models/Task';

async function signInTestUser(page: Page): Promise<string> {
  const dummyUser = generateDummyUserData({ permissions: ['manage-tasks'] }); // don't forget to give the test user required permissions; different describe groups may use different sets.
  const createdUser = await prisma.user.create({ data: dummyUser });

  await page.goto(`http://localhost:4200/proxy?net_id=${createdUser.netId}`);
  return createdUser.id;
}

test.describe('Task page', () => {
    let id: string; // id is stored out here so that it can be used in afterEach and other tests in the describe group.

    test.beforeEach(async ({ page }) => {
      id = await signInTestUser(page);
      await page.goto('http://localhost:4200/tasks');
    })

    test.afterEach(async () => {
      await prisma.user.delete({ where: { id } })
    })
  // Tests will go here

    // ...
    test('pagination buttons', async ({ page }) => {
      const createArray: TaskCreateManyInput[] = [];
      // Create 100 tasks. With a loop like this it's easy to create as many (or as few) as needed for the test.
      for (let i = 0; i < 100; i++) {
        createArray.push({
          title: `pagination test: ${i}`,
          description: i.toString(),
          status: 'Complete',
          ownerId: id,
        });
      }
      const tasks = await prisma.task.createManyAndReturn({ data: createArray });

      // testing goes here

      const deleteConditions = tasks.map(task => ({ id: task.id }));
      await prisma.task.deleteMany({ where: { OR: deleteConditions } }); // delete all tasks where the id equals any of our created task ids.
    });
    // ...
// ...
});