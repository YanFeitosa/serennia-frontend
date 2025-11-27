import type { User } from '../../types';

export async function getUsers(): Promise<User[]> {
  // For now, we'll need to get users from the backend
  // This might need a new endpoint or we can use the collaborators endpoint
  // For audit logs, we can use the userId from the logs themselves
  // This is a placeholder - in a real system, you'd have a /users endpoint
  return [];
}

