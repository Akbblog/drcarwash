'use client';

// Import any actions you need for updating user data (e.g., updateUserData)
// import { updateUserData } from '@/app/actions/user'; 
import { useState } from 'react';

// 1. 🔑 DEFINING THE PROPS INTERFACE
// This is the essential fix for the 'userData does not exist' error.
interface AddressFormProps {
  userData: {
    address: any; 
    city: any; 
    zip: any; 
    notes: any; 
    preferredDay1: any; 
    preferredTime1: any; 
    preferredDay2: any; 
    preferredTime2: any; 
    phone: any; 
  };
}

// 2. 🎯 UPDATING THE COMPONENT SIGNATURE
export default function AddressForm({ userData }: AddressFormProps) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Placeholder for your form submission logic
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        
        // ... Your actual form submission logic will go here
        
        setPending(false);
    };

    return (
        <div className="bg-[#111] border border-white/5 p-6 rounded-xl">
            <h3 className="text-white uppercase tracking-widest font-bold mb-6">
                Service Preferences
            </h3>

            {error && (
                <p className="mb-4 p-3 bg-red-500/10 text-red-500 text-xs text-center border border-red-500/20">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Example of using the passed prop for default values */}
                <div>
                    <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">
                        Address
                    </label>
                    <input
                        name="address"
                        type="text"
                        defaultValue={userData.address || ''} 
                        placeholder="Your Service Address"
                        required
                        className="w-full bg-black border border-white/10 px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#ff3366] transition-colors"
                    />
                </div>
                {/* Add the rest of your AddressForm fields here */}
                
                <p className="text-[#999] text-xs pt-2">
                    (You can fill in the remaining form fields here, using other `userData` properties like `userData.city` for default values.)
                </p>
                
                <button
                    type="submit"
                    disabled={pending}
                    className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-[#ff3366] hover:text-white transition-all disabled:opacity-50"
                >
                    {pending ? 'SAVING...' : 'SAVE PREFERENCES'}
                </button>
            </form>
        </div>
    );
}