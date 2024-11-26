"use server";

import { headers } from "next/headers";
import { auth } from "@clerk/nextjs";

export const getCourse = async (courseId) => {
  try {
    const { userId } = auth();
    const headersList = headers();
    const domain = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const url = `${protocol}://${domain}/api/courses/${courseId}`;
    
    console.log("Fetching course from:", url, "with userId:", userId);
    
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId, // Pass the userId in a custom header
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Response Error:", {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
      throw new Error(`Failed to fetch course: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Course data received:", data);
    return data;
  } catch (error) {
    console.error("Error in getCourse:", error);
    throw error;
  }
};
