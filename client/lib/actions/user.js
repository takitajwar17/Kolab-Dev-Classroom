"use server";

import User from "../models/userModel";

import { connect } from "../mongodb/mongoose";

export const createOrUpdateUser = async (
  id, first_name, last_name, image_url, email_addresses, username
) => {
  try {
    await connect();
    console.log({id, first_name, last_name, image_url, email_addresses, username})
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          image_url: image_url,
          email: email_addresses[0].email,
          userName: username,
        },
      },
      { new: true, upsert: true }
    );
    console.log(user)
    return user;
  } catch (error) {
    console.log("Error creating or updating user:", error);
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();

    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log("Error deleting user:", error);
  }
};
