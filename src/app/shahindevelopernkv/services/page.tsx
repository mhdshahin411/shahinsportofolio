"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createService, updateService, deleteService } from "../actions";
import {
  Spinner,
  SkeletonList,
  Toast,
  PrimaryButton,
  inputCls,
  labelCls,
  cardCls,
} from "@/components/admin/ui";

interface Service { id: string; name: string; order: number }

export default function ServicesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/services").then(r => r.json()).then((data) => { setItems(data); setLoading(false); });
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (s: Service) => { setEditing(s.id); setForm({ name: s.name }); };
  const startNew = () => { setEditing("new"); setForm({ name: "" }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === "new") await createService(form);
      else if (editing) await updateService(editing, form);
      setEditing(null);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    setDeletingId(id);
    try {
      await deleteService(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <PrimaryButton onClick={startNew}>+ Add</PrimaryButton>
      </div>
      <p className="mb-6 text-sm text-gray-500">The service list shown in the About section.</p>
      <Toast message={msg} />

      {editing && (
        <div className={`${cardCls} mb-6`}>
          <label className={labelCls}>Service name</label>
          <input value={form.name} onChange={e => setForm({ name: e.target.value })} className={inputCls} />
          <div className="mt-4 flex gap-3">
            <PrimaryButton loading={saving} onClick={save}>Save</PrimaryButton>
            <button onClick={() => setEditing(null)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <SkeletonList rows={4} />
      ) : (
        <div className="space-y-3">
          {items.map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-gray-900">{s.name}</p>
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
