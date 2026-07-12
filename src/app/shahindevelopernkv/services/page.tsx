"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createService, updateService, deleteService } from "../actions";

interface Service { id: string; name: string; order: number }

export default function ServicesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/services").then(r => r.json()).then(setItems);
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (s: Service) => { setEditing(s.id); setForm({ name: s.name }); };
  const startNew = () => { setEditing("new"); setForm({ name: "" }); };

  const save = async () => {
    if (editing === "new") await createService(form);
    else if (editing) await updateService(editing, form);
    setEditing(null);
    setMsg("Saved!");
    setTimeout(() => setMsg(""), 2000);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await deleteService(id);
    load();
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0f1219]">Services</h1>
        <button onClick={startNew} className="rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]">+ Add</button>
      </div>
      <p className="mb-6 text-sm text-gray-500">The service list shown in the About section.</p>
      {msg && <div className="mb-4 rounded-lg bg-[#16a34a]/10 px-4 py-2 text-sm text-[#16a34a]">{msg}</div>}

      {editing && (
        <div className="mb-6 rounded-2xl bg-[#1a1f2e] p-6">
          <label className="mb-1 block text-xs text-gray-400">Service name</label>
          <input value={form.name} onChange={e => setForm({ name: e.target.value })} className="w-full rounded-lg border border-transparent bg-[#0f1219] px-3 py-2 text-sm text-white focus:border-[#16a34a] focus:outline-none" />
          <div className="mt-4 flex gap-3">
            <button onClick={save} className="rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]">Save</button>
            <button onClick={() => setEditing(null)} className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(s => (
          <div key={s.id} className="flex items-center justify-between rounded-2xl bg-[#1a1f2e] p-5">
            <p className="font-medium text-white">{s.name}</p>
            <div className="flex gap-2">
              <button onClick={() => startEdit(s)} className="rounded-lg bg-[#252a3a] px-3 py-1.5 text-xs text-gray-300 hover:bg-[#16a34a] hover:text-white">Edit</button>
              <button onClick={() => remove(s.id)} className="rounded-lg bg-[#252a3a] px-3 py-1.5 text-xs text-gray-300 hover:bg-red-600 hover:text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
