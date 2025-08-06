import { describe } from "vitest";
import { prisma, User } from "../../../../../../prisma/client";
import { appRouter } from "../../../api.routes";
import { generateDummyUserData } from "../../../../dummy/helpers/dummy-user";
import { faker } from "@faker-js/faker";

describe('Create task', () => {
  let requestingUser: User;
  let createTask: ReturnType<typeof appRouter.createCaller>['taskManagement']['createTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: ['manage-tasks'],
        roles: [],
      }),
    });
    createTask = appRouter.createCaller({userId: requestingUser.id}).taskManagement.createTask;
  });

})