'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })} // <-- Sign out and redirect to home
      className="text-[#999] hover:text-white uppercase tracking-widest text-xs transition-colors"
    >
      [ Sign Out ]
    </button>
  );
}