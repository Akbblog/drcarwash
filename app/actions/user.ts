'use server';

import { auth } from '@/auth';
import connectDB from '@/lib/db';
import Car from '@/lib/models/Car';
import { revalidatePath } from 'next/cache';

type Result = {
  success?: string;
  error?: string;
};

export async function addCar(formData: FormData): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be logged in to add a car.' };
  }
  const userId = session.user.id;

  const data = {
    make: formData.get('make') as string,
    model: formData.get('model') as string,
    color: formData.get('color') as string,
    licensePlate: formData.get('licensePlate') as string,
  };

  if (!data.make || !data.model || !data.color || !data.licensePlate) {
    return { error: 'Please fill in all car fields.' };
  }

  try {
    await connectDB();
    await Car.create({ ...data, userId });

    // Revalidate dashboard page
    revalidatePath('/dashboard');

    return { success: 'Car added successfully' };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to add car.' };
  }
}
