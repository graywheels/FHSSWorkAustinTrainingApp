import {
  byuAccountService,
  type UserServiceType,
} from '@fhss-web-team/backend-utils';
import { User, prisma } from '../../../prisma/client';
import { DEFAULT_ROLE, Role } from '../../security';

/**
 * Allows developers to implement custom user provisioning logic,
 * including sending the client to a specific route after first login.
 * If no custom provisioning is required, this function should
 * do nothing and return null.
 * @param user The user object to be provisioned.
 * @returns A string representing the frontend route to navigate to,
 * or null if no navigation is needed.
 */
async function customProvisioning(user: User): Promise<string | null> {
  return null;
}

class UserService implements UserServiceType<Role, User> {
  /**
   * Creates a new user in the database using the provided NetID and optional roles.
   * Retrieves BYU account information associated with the given NetID.
   *
   * @param netId - The NetID of the user to create.
   * @param roles - Optional array of roles to assign to the user.
   * @returns A promise that resolves to the newly created {@link User} object.
   * @throws Error if the BYU account for the given NetID is not found.
   */
  public async createUser(
    netId: string,
    roles: Role[] = DEFAULT_ROLE ? [DEFAULT_ROLE] : [],
  ): Promise<User> {
    const byu = (await byuAccountService.getAccountsByNetId(netId))[0];
    if (!byu) throw new Error('User BYU account not found');

    return await prisma.user.create({ data: { ...byu, roles } });
  }

  /**
   * Updates the user information in the database using data retrieved from the BYU account service.
   *
   * @param netId - The NetID of the user whose information is to be updated.
   * @returns A promise that resolves to the updated {@link User} object.
   * @throws If the BYU account for the given NetID is not found.
   */
  public async updateUserInfo(netId: string): Promise<User> {
    const byu = (await byuAccountService.getAccountsByNetId(netId))[0];
    if (!byu) throw new Error('User BYU account not found');

    return await prisma.user.update({ where: { netId }, data: byu });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLogin: new Date(),
      },
    });
  }
  findUser(by: { netId?: string; userId?: string }): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: by.userId, netId: by.netId },
    });
  }
  getAllIds = () =>
    prisma.user.findMany({
      orderBy: { netId: 'asc' },
      select: { netId: true, id: true },
    });

  customProvisioning = customProvisioning;
}

export const userService = new UserService();
