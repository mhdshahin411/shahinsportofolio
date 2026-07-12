"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createProject, updateProject, deleteProject } from "../actions";
import { Spinner, SkeletonList, Toast, PrimaryButton, inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface Tag { id: string; name: string }
interface Project { id: string; title: string; category: string; accent: string; description: string; link: string; order: number; tags: Tag[] }

export default function ProjectsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "", accent: "blue", description: "", link: "", tags: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = () => fetch("/api/admin/projects").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (p: Project) => {
    setEditing(p.id);
    setForm({ title: p.title, category: p.category, accent: p.accent, description: p.description, link: p.link, tags: p.tags.map(t => t.name).join(", ") });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ title: "", category: "", accent: "blue", description: "", link: "", tags: "" });
  };

  const save = async () => {
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    setSaving(true);
    try {
      if (editing === "new") {
        await createProject({ ...form, tags });
      } else if (editing) {
        await updateProject(editing, { ...form, tags });
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
    if (!confirm("Delete this project?")) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Manage your portfolio projects.</p>
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
              <label className={labelCls}>Category</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Accent</label>
              <select value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))} className={inputCls}>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Link</label>
              <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className={inputCls} />
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
          {items.map(p => (
            <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <p className="mt-1 text-xs text-gray-500">{p.tags.map(t => t.name).join(", ")}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">Edit</button>
                  <button onClick={() => remove(p.id)} disabled={deletingId === p.id} className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                    {deletingId === p.id ? <Spinner className="h-3.5 w-3.5" /> : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
