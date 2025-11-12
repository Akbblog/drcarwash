'use server';

import { auth } from '@/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Car from '@/lib/models/Car'; // <-- Import the Car model
import { revalidatePath } from 'next/cache'; // <-- Import for revalidating

// Define a reusable state type
type State = {
  error?: string;
  success?: string;
};

// This is your existing function for saving the address
export async function updateServiceDetails(prevState: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be logged in to update details.' };
  }
  const userId = session.user.id;

  const data = {
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    zip: formData.get('zip') as string,
    notes: formData.get('notes') as string,
    preferredDay1: formData.get('preferredDay1') as string,
    preferredTime1: formData.get('preferredTime1') as string,
    preferredDay2: formData.get('preferredDay2') as string,
    preferredTime2: formData.get('preferredTime2') as string,
  };

  if (!data.address || !data.city || !data.zip || !data.preferredDay1 || !data.preferredDay2) {
    return { error: 'Please fill in all required fields.' };
  }

  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, data);
    revalidatePath('/dashboard');
    return { success: 'Details saved successfully!' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while saving details.' };
  }
}

// --- THIS IS THE NEW FUNCTION YOU NEED TO ADD ---
export async function addCar(prevState: State, formData: FormData): Promise<State> {
  const make = formData.get('make') as string;
  const model = formData.get('model') as string;
  const color = formData.get('color') as string;
  const licensePlate = formData.get('licensePlate') as string;

  // 1. Validate input
  if (!make || !model || !color || !licensePlate) {
    return { error: 'Please fill in all vehicle fields.' };
  }

  // 2. Get user session
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be logged in to add a car.' };
  }
  const userId = session.user.id;

  try {
    await connectDB();

    // 3. Create the new car in the database
    await Car.create({
      userId,
      make,
      model,
      color,
      licensePlate,
    });

    // 4. Revalidate the dashboard path to show the new car
    revalidatePath('/dashboard');

    // 5. Return a success message
    return { success: 'Vehicle added successfully!' };

  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while adding the car.' };
  }
}