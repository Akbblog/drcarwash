'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { joinWaitingList } from '@/app/actions/user';
import { useEffect } from 'react';

// This is the button that shows pending state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      // Using a blue-ish color to distinguish from the pink subscribe button
      className="w-full py-3 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-blue-700 transition-all disabled:opacity-50"
    >
      {pending ? 'JOINING...' : 'JOIN WAITING LIST'}
    </button>
  );
}

// This is the main component that wraps the button in a form
export default function WaitingListButton() {
  // We use useFormState to handle errors from the server action
  const [state, formAction] = useFormState(joinWaitingList, {});

  useEffect(() => {
    if (state?.error) {
      // You can replace this with a toast notification
      alert(`Error: ${state.error}`);
    }
    // Success is handled automatically because the server action revalidates
    // the page, and the dashboard will show the new "You're on the list" state.
  }, [state]);

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}