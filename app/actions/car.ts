"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Car from "@/lib/models/Car";
import { revalidatePath } from "next/cache";

export async function addCar(prevState: any, formData: FormData) {
  try {
    // 1. Authentication Check
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to add a car." };
    }

    // 2. Extract Data
    const make = formData.get("make") as string;
    const model = formData.get("model") as string;
    const color = formData.get("color") as string;
    const licensePlate = (formData.get("licensePlate") as string)?.trim().toUpperCase();

    // 3. Basic Validation
    if (!make || !model || !licensePlate) {
      return { error: "Make, Model, and License Plate are required." };
    }

    await connectDB();

    // 4. Uniqueness Check
    const existingCar = await Car.findOne({ licensePlate });
    if (existingCar) {
      return { error: "A car with this license plate is already registered." };
    }

    // 5. Create Car
    await Car.create({
      userId: session.user.id,
      make,
      model,
      color,
      licensePlate,
    });

    // 6. Refresh the dashboard to show the new car
    revalidatePath("/dashboard");
    return { success: "Car added successfully!" };

  } catch (error) {
    console.error("Failed to add car:", error);
    return { error: "Failed to add car. Please try again." };
  }
}

// --- ADD THIS NEW FUNCTION ---
export async function deleteCar(carId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    await connectDB();
    
    // Find the car to ensure it belongs to the user
    const car = await Car.findOne({ _id: carId, userId: session.user.id });

    if (!car) {
      return { error: 'Car not found or you do not have permission.' };
    }

    // Delete the car
    await Car.findByIdAndDelete(carId);

    revalidatePath('/dashboard');
    return { success: 'Car deleted successfully.' };
  } catch (e) {
    return { error: 'Failed to delete car.' };
  }
}