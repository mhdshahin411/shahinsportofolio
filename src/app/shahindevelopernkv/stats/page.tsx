"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createStat, updateStat, deleteStat } from "../actions";

interface Stat { id: string; value: string; label: string; order: number }

export default function StatsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Stat[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ value: "", label: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/stats").then(r => r.json()).then(setItems);
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (s: Stat) => { setEditing(s.id); setForm({ value: s.value, label: s.label }); };
  const startNew = () => { setEditing("new"); setForm({ value: "", label: "" }); };

  const save = async () => {
    if (editing === "new") await createStat(form);
    else if (editing) await updateStat(editing, form);
    setEditing(null);
    setMsg("Saved!");
    setTimeout(() => setMsg(""), 2000);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this stat?")) return;
    await deleteStat(id);
    load();
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0f1219]">Stats</h1>
        <button onClick={startNew} className="rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]">+ Add</button>
      </div>
      <p className="mb-6 text-sm text-gray-500">The numbers shown in the About section (they count up on the site).</p>
      {msg && <div className="mb-4 rounded-lg bg-[#16a34a]/10 px-4 py-2 text-sm text-[#16a34a]">{msg}</div>}

      {editing && (
        <div className="mb-6 rounded-2xl bg-[#1a1f2e] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Value (e.g. 3+, 10+, 6)</label>
              <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="w-full rounded-lg border border-transparent bg-[#0f1219] px-3 py-2 text-sm text-white focus:border-[#16a34a] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Label</label>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className="w-full rounded-lg border border-transparent bg-[#0f1219] px-3 py-2 text-sm text-white focus:border-[#16a34a] focus:outline-none" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={save} className="rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]">Save</button>
            <button onClick={() => setEditing(null)} className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(s => (
          <div key={s.id} className="flex items-center justify-between rounded-2xl bg-[#1a1f2e] p-5">
            <div>
              <p className="text-2xl font-bold text-[#16a34a]">{s.value}</p>
              <p className="text-sm text-gray-400">{s.label}</p>
            </div>
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
