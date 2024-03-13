import { connectMongoDB } from "../../../lib/mongodb";
import User from "../models/User";

export const fetchUsers = async () => {
  try {
    connectMongoDB();
    const users = await User.find();
    return users;
  } catch (error) {}
};
