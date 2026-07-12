"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createStat, updateStat, deleteStat } from "../actions";
import {
  Spinner,
  SkeletonList,
  Toast,
  PrimaryButton,
  inputCls,
  labelCls,
  cardCls,
} from "@/components/admin/ui";

interface Stat { id: string; value: string; label: string; order: number }

export default function StatsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Stat[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ value: "", label: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/stats").then(r => r.json()).then((data) => { setItems(data); setLoading(false); });
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (s: Stat) => { setEditing(s.id); setForm({ value: s.value, label: s.label }); };
  const startNew = () => { setEditing("new"); setForm({ value: "", label: "" }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === "new") await createStat(form);
      else if (editing) await updateStat(editing, form);
      setEditing(null);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this stat?")) return;
    setDeletingId(id);
    try {
      await deleteStat(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Stats</h1>
        <PrimaryButton onClick={startNew}>+ Add</PrimaryButton>
      </div>
      <p className="mb-6 text-sm text-gray-500">The numbers shown in the About section (they count up on the site).</p>
      <Toast message={msg} />

      {editing && (
        <div className={`${cardCls} mb-6`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Value (e.g. 3+, 10+, 6)</label>
              <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Label</label>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <PrimaryButton loading={saving} onClick={save}>Save</PrimaryButton>
            <button onClick={() => setEditing(null)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <SkeletonList rows={4} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-2xl font-bold text-[#16a34a]">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(s)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">Edit</button>
                <button onClick={() => remove(s.id)} disabled={deletingId === s.id} className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                  {deletingId === s.id ? <Spinner className="h-3.5 w-3.5" /> : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
