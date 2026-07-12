"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createCertification, updateCertification, deleteCertification } from "../actions";
import { Spinner, SkeletonList, Toast, PrimaryButton, inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface Cert { id: string; title: string; issuer: string; code: string; order: number }

export default function CertificationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Cert[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", issuer: "", code: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/certifications").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (c: Cert) => { setEditing(c.id); setForm({ title: c.title, issuer: c.issuer, code: c.code }); };
  const startNew = () => { setEditing("new"); setForm({ title: "", issuer: "", code: "" }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === "new") await createCertification(form);
      else if (editing) await updateCertification(editing, form);
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
      await deleteCertification(id);
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
          <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
          <p className="text-sm text-gray-500">Manage your certifications.</p>
        </div>
        <PrimaryButton onClick={startNew}>+ Add</PrimaryButton>
      </div>
      <Toast message={msg} />

      {editing && (
        <div className={`mb-6 ${cardCls}`}>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Issuer</label>
              <input value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Code</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={inputCls} />
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
          {items.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-500">{c.issuer} · {c.code}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">Edit</button>
                <button onClick={() => remove(c.id)} disabled={deletingId === c.id} className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                  {deletingId === c.id ? <Spinner className="h-3.5 w-3.5" /> : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
