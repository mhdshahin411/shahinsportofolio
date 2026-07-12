"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createEducationItem, updateEducationItem, deleteEducationItem } from "../actions";
import { Spinner, SkeletonList, Toast, PrimaryButton, inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface Education { id: string; degree: string; school: string; period: string; detail: string; order: number }

export default function EducationPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Education[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ degree: "", school: "", period: "", detail: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/education").then(r => r.json()).then((d) => { setItems(d); setLoading(false); });
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (e: Education) => { setEditing(e.id); setForm({ degree: e.degree, school: e.school, period: e.period, detail: e.detail }); };
  const startNew = () => { setEditing("new"); setForm({ degree: "", school: "", period: "", detail: "" }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === "new") await createEducationItem(form);
      else if (editing) await updateEducationItem(editing, form);
      setEditing(null);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    setDeletingId(id);
    try {
      await deleteEducationItem(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Education</h1>
        <PrimaryButton loading={saving} onClick={startNew}>+ Add</PrimaryButton>
      </div>
      <Toast message={msg} />

      {editing && (
        <div className={`mb-6 ${cardCls}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Degree</label>
              <input value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Period</label>
              <input value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>School</label>
              <input value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Detail (e.g. CGPA)</label>
              <input value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} className={inputCls} />
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
        <div className="space-y-3">
          {items.map(e => (
            <div key={e.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="font-semibold text-gray-900">{e.degree}</h3>
                <p className="text-sm text-gray-500">{e.school}</p>
                <p className="text-xs text-gray-500">{e.period}{e.detail ? ` · ${e.detail}` : ""}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(e)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">Edit</button>
                <button
                  onClick={() => remove(e.id)}
                  disabled={deletingId === e.id}
                  className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  {deletingId === e.id ? <Spinner className="h-3.5 w-3.5" /> : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
