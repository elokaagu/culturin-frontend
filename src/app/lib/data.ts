import { listUsers } from "../../libs/repositories/userRepository";

export const fetchUsers = async () => {
  try {
    const users = await listUsers();
    return users;
  } catch (_error) {
    return [];
  }
};
