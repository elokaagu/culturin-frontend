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

// Function to generate a username from a user's name
function generateUsername(name: string) {
  let names = name.split(" ");
  let firstName = names[0];
  let lastName = names.length > 1 ? names[names.length - 1] : "";
  return `${firstName}${lastName}`.replace(/[.\s]/g, "").toLowerCase();
}

// Function to update existing users
async function updateExistingUsers() {
  const users = await User.find({ username: { $exists: false } });

  const userUpdates = users.map((user) => {
    // Avoid overwriting if username already exists
    if (!user.username) {
      user.username = generateUsername(user.name);

      // Ensure userId is set, otherwise create a new one
      if (!user.userId) {
        user.userId = uuidv4();
      }

      return user.save();
    }
  });

  await Promise.all(userUpdates.filter(Boolean)); // Filter out any undefined from map
  console.log("All users have been updated.");
}

// Run the update
updateExistingUsers()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error("Error updating users:", error);
    mongoose.disconnect();
  });
