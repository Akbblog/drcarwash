import React, { FormEvent, useState } from "react";

type Car = {
  id?: string;
  _id?: string;
  make?: string;
  model?: string;
  licensePlate?: string;
  color?: string;
};

type Props = {
  form: any;
  setForm: (f: any) => void;
  saving?: boolean;
  onSave: (e?: FormEvent) => void;
  onCancel?: () => void;
  ownedCars?: Car[];
  createCar?: (payload: { make: string; model: string; licensePlate: string; color?: string; userId: string }) => Promise<void>;
  deleteCar?: (id: string) => Promise<void>;
  ownerId?: string | number | null;
  carsPage?: number;
  carsTotalPages?: number;
  setCarsPage?: (n: number) => void;
  refreshCars?: (p?: number) => Promise<void>;
  showToast?: (msg: string, type?: "success" | "error") => void;
};

export default function UserEditor({
  form,
  setForm,
  saving = false,
  onSave,
  onCancel,
  ownedCars = [],
  createCar,
  deleteCar,
  ownerId,
  carsPage,
  carsTotalPages,
  setCarsPage,
  refreshCars,
  showToast = () => {},
}: Props) {
  const inputCls = "w-full bg-black border border-white/10 px-4 py-3 text-white text-sm rounded";

  const [carForm, setCarForm] = useState({ make: "", model: "", licensePlate: "", color: "" });
  const [carLoading, setCarLoading] = useState(false);

  const handleAddCar = async () => {
    if (!createCar) return;
    if (!carForm.make || !carForm.model || !carForm.licensePlate) {
      showToast("Make, model and license plate are required", "error");
      return;
    }
    if (!ownerId) {
      showToast("Missing user id", "error");
      return;
    }
    setCarLoading(true);
    try {
      await createCar({ ...carForm, userId: String(ownerId) });
      setCarForm({ make: "", model: "", licensePlate: "", color: "" });
      if (refreshCars) await refreshCars(1);
      showToast("Car added");
    } catch (e: any) {
      console.error(e);
      showToast((e?.message) ?? "Failed to add car", "error");
    }
    setCarLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{form?.name || "User"}</h3>
          <div className="text-sm text-white/70">{form?.email}</div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="text-sm text-white/60 hover:text-white">✕</button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <input className={inputCls} value={form.name || ""} onChange={(e)=>setForm((s:any)=>({...s, name: e.target.value}))} placeholder="Name" />
        <input className={inputCls} value={form.email || ""} onChange={(e)=>setForm((s:any)=>({...s, email: e.target.value}))} placeholder="Email" />
        <input className={inputCls} value={form.phone || ""} onChange={(e)=>setForm((s:any)=>({...s, phone: e.target.value}))} placeholder="Phone" />
        <input className={inputCls} value={form.address || ""} onChange={(e)=>setForm((s:any)=>({...s, address: e.target.value}))} placeholder="Address" />
        <div className="grid grid-cols-2 gap-2">
          <input className={inputCls} value={form.city || ""} onChange={(e)=>setForm((s:any)=>({...s, city: e.target.value}))} placeholder="City" />
          <input className={inputCls} value={form.zip || ""} onChange={(e)=>setForm((s:any)=>({...s, zip: e.target.value}))} placeholder="ZIP" />
        </div>
        <textarea rows={2} className={inputCls} value={form.notes || ""} onChange={(e)=>setForm((s:any)=>({...s, notes: e.target.value}))} placeholder="Notes" />
      </div>

      <div className="flex gap-2">
        <button onClick={(e)=>onSave && onSave(e as any)} disabled={saving} className="px-4 py-2 bg-white text-black rounded font-semibold">
          {saving ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="px-4 py-2 border border-white/10 rounded text-sm">Cancel</button>
        )}
      </div>

      <div className="pt-4">
        <div className="text-sm text-[#999] uppercase tracking-widest mb-2">Cars</div>
        <div className="space-y-2">
          {ownedCars.map((c) => (
            <div key={(c.id ?? c._id)} className="flex items-center justify-between bg-gray-900/30 p-2 rounded">
              <div>
                <div className="font-medium text-white">{c.make} {c.model}</div>
                <div className="text-xs text-white/70">{c.licensePlate}{c.color ? ` • ${c.color}` : ''}</div>
              </div>
              {deleteCar && (
                <button onClick={async ()=>{ await deleteCar(String(c.id ?? c._id)); }} className="px-2 py-1 text-xs bg-red-600 rounded text-white">Delete</button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input placeholder="Make" className={inputCls} value={carForm.make} onChange={(e)=>setCarForm(s=>({...s, make: e.target.value}))} />
          <input placeholder="Model" className={inputCls} value={carForm.model} onChange={(e)=>setCarForm(s=>({...s, model: e.target.value}))} />
          <input placeholder="License" className={inputCls} value={carForm.licensePlate} onChange={(e)=>setCarForm(s=>({...s, licensePlate: e.target.value}))} />
          <div className="flex gap-2">
            <input placeholder="Color" className={inputCls} value={carForm.color} onChange={(e)=>setCarForm(s=>({...s, color: e.target.value}))} />
            <button onClick={handleAddCar} disabled={carLoading} className="px-3 py-2 bg-[var(--accent)] text-white rounded">{carLoading? 'Adding...' : 'Add'}</button>
          </div>
        </div>

        {typeof carsPage !== "undefined" && (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <div>Page {carsPage} of {carsTotalPages ?? 1}</div>
            <div className="flex gap-2">
              <button onClick={async ()=>{ if(setCarsPage) setCarsPage(1); if(refreshCars) await refreshCars(1); }} className="px-2 py-0.5 rounded bg-[var(--accent)] text-white">First</button>
              <button onClick={async ()=>{ const p = Math.max(1, (carsPage||1)-1); if(setCarsPage) setCarsPage(p); if(refreshCars) await refreshCars(p); }} className="px-2 py-0.5 rounded bg-[var(--accent)] text-white">Prev</button>
              <input type="number" min={1} max={carsTotalPages||1} value={carsPage} onChange={async (e)=>{ const v = Math.max(1, Math.min(carsTotalPages||1, Number(e.target.value||1))); if(setCarsPage) setCarsPage(v); if(refreshCars) await refreshCars(v); }} className="w-16 rounded border p-1 bg-white text-sm" />
              <button onClick={async ()=>{ const p = Math.min(carsTotalPages||1, (carsPage||1)+1); if(setCarsPage) setCarsPage(p); if(refreshCars) await refreshCars(p); }} className="px-2 py-0.5 rounded bg-[var(--accent)] text-white">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}