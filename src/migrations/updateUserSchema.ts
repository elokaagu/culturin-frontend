require("dotenv").config();
import mongoose from "mongoose";
import User from "../app/models/User";
import { v4 as uuidv4 } from "uuid";

// Create a connection to the database
mongoose.connect(
  process.env.MONGODB_URI as string,
  {
    useUnifiedTopology: true,
  } as any
);

// Function to update existing users
async function updateExistingUsers() {
  const users = await User.find({ username: { $exists: false } });

  const userUpdates = users.map((user) => {
    // Avoid overwriting if username already exists
    if (!user.userId) {
      user.userId = uuidv4();
      return user.save();
    }
  });

  await Promise.all(userUpdates);
  console.log("All users have been updated.");
}

// Run the update
updateExistingUsers()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error("Error updating users:", error);
    mongoose.disconnect();
  });
