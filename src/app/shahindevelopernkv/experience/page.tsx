"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createExperience, updateExperience, deleteExperience } from "../actions";
import { Spinner, SkeletonList, Toast, PrimaryButton, inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface Bullet { id: string; text: string; order: number }
interface Experience { id: string; title: string; period: string; company: string; location: string; order: number; bullets: Bullet[] }

export default function ExperiencePage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", period: "", company: "", location: "", bullets: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/experience").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (e: Experience) => {
    setEditing(e.id);
    setForm({ title: e.title, period: e.period, company: e.company, location: e.location, bullets: e.bullets.map(b => b.text).join("\n") });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ title: "", period: "", company: "", location: "", bullets: "" });
  };

  const save = async () => {
    const bullets = form.bullets.split("\n").map(b => b.trim()).filter(Boolean);
    setSaving(true);
    try {
      if (editing === "new") {
        await createExperience({ ...form, bullets });
      } else if (editing) {
        await updateExperience(editing, { ...form, bullets });
      }
      setEditing(null);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    setDeletingId(id);
    try {
      await deleteExperience(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience</h1>
          <p className="text-sm text-gray-500">Manage your work experience entries.</p>
        </div>
        <PrimaryButton onClick={startNew}>+ Add</PrimaryButton>
      </div>
      <Toast message={msg} />

      {editing && (
        <div className={`mb-6 ${cardCls}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Period</label>
              <input value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Bullet Points (one per line)</label>
            <textarea value={form.bullets} onChange={e => setForm(f => ({ ...f, bullets: e.target.value }))} rows={6} className={inputCls} />
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
            <div key={e.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{e.title}</h3>
                  <p className="text-sm text-gray-500">{e.company}{e.location ? ` — ${e.location}` : ""}</p>
                  <p className="text-xs text-gray-400">{e.period}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(e)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">Edit</button>
                  <button onClick={() => remove(e.id)} disabled={deletingId === e.id} className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                    {deletingId === e.id ? <Spinner className="h-3.5 w-3.5" /> : "Delete"}
                  </button>
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {e.bullets.map(b => (
                  <li key={b.id} className="flex gap-2 text-xs text-gray-500">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
