'use client';

import { deleteCar } from '@/app/actions/car';
import { useTransition } from 'react';

type Car = {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
  color: string;
};

export default function CarList({ cars }: { cars: Car[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (carId: string) => {
    if (confirm('Are you sure you want to delete this car?')) {
      startTransition(async () => {
        await deleteCar(carId);
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">
        Registered Vehicles{' '}
        <span className="text-[#FF991C]">({cars.length})</span>
      </h2>

      {cars.length === 0 ? (
        <div className="p-12 bg-[#111] border border-white/5 rounded-xl text-center">
          <p className="text-[#999] uppercase tracking-widest mb-4">
            Your garage is empty
          </p>
          <p className="text-white/30 text-sm">
            Use the form on the left to add your first vehicle.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="group bg-[#111] border border-white/5 p-6 rounded-xl relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-3xl">🚗</div>
                <span className="px-3 py-1 bg-white/5 text-[10px] text-[#999] uppercase tracking-widest rounded-full">
                  {car.color || 'Standard'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {car.make} {car.model}
              </h3>
              <div className="text-[#FF991C] font-mono text-sm uppercase tracking-wider mb-4">
                [{car.licensePlate}]
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(car._id)}
                disabled={isPending}
                className="absolute bottom-4 right-4 text-xs text-[#666] uppercase tracking-widest hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}