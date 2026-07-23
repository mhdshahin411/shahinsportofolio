"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createCompetency, updateCompetency, deleteCompetency, updateMarqueeSkills } from "../actions";
import { Spinner, SkeletonList, Toast, PrimaryButton, inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface Skill { id: string; name: string; description: string }
interface Competency { id: string; title: string; accent: string; order: number; skills: Skill[] }
interface Marquee { id: string; name: string }

export default function SkillsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Competency[]>([]);
  const [marquee, setMarquee] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", accent: "blue", skills: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingMarquee, setSavingMarquee] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  const load = async () => {
    const [skills, mq] = await Promise.all([
      fetch("/api/admin/skills").then(r => r.json()),
      fetch("/api/admin/marquee").then(r => r.json()),
    ]);
    setItems(skills);
    setMarquee((mq as Marquee[]).map((m: Marquee) => m.name).join(", "));
    setLoading(false);
  };
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const startEdit = (c: Competency) => {
    setEditing(c.id);
    setForm({ title: c.title, accent: c.accent, skills: c.skills.map(s => (s.description ? `${s.name} | ${s.description}` : s.name)).join("\n") });
  };
  const startNew = () => { setEditing("new"); setForm({ title: "", accent: "blue", skills: "" }); };

  const save = async () => {
    setSaving(true);
    try {
      const skills = form.skills.split("\n").map(l => l.trim()).filter(Boolean).map(line => {
        const idx = line.indexOf("|");
        return idx === -1
          ? { name: line.trim(), description: "" }
          : { name: line.slice(0, idx).trim(), description: line.slice(idx + 1).trim() };
      });
      if (editing === "new") await createCompetency({ ...form, skills });
      else if (editing) await updateCompetency(editing, { ...form, skills });
      setEditing(null);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this competency group?")) return;
    setDeletingId(id);
    try {
      await deleteCompetency(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  const saveMarquee = async () => {
    setSavingMarquee(true);
    try {
      const skills = marquee.split(",").map(s => s.trim()).filter(Boolean);
      await updateMarqueeSkills(skills);
      setMsg("Marquee saved!");
      setTimeout(() => setMsg(""), 2000);
    } finally {
      setSavingMarquee(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Skills & Competencies</h1>
        <PrimaryButton loading={saving} onClick={startNew}>+ Add Group</PrimaryButton>
      </div>
      <Toast message={msg} />

      {editing && (
        <div className={`mb-6 ${cardCls}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Group Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Accent Color</label>
              <select value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))} className={inputCls}>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Skills — one per line, format: Name | Description</label>
            <textarea value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} rows={8} className={inputCls} placeholder={"Power BI | Interactive dashboards and DAX reporting.\nReactJS | Component-based UI and SPA development."} />
            <p className="mt-1 text-xs text-gray-400">The text after &quot;|&quot; is the short description shown under each skill card. Omit &quot;|&quot; for no description.</p>
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
            <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{c.skills.map(s => s.name).join(", ")}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(c)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">Edit</button>
                  <button
                    onClick={() => remove(c.id)}
                    disabled={deletingId === c.id}
                    className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {deletingId === c.id ? <Spinner className="h-3.5 w-3.5" /> : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-10 ${cardCls}`}>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Marquee Skills</h2>
        <label className={labelCls}>Skills (comma-separated, shown in scrolling banner)</label>
        <textarea value={marquee} onChange={e => setMarquee(e.target.value)} rows={3} className={inputCls} />
        <div className="mt-3">
          <PrimaryButton loading={savingMarquee} onClick={saveMarquee}>Save Marquee</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
