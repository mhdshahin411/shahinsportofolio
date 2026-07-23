"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateSiteContent } from "../actions";
import { SkeletonList, Toast, PrimaryButton, inputCls, labelCls, cardCls } from "@/components/admin/ui";

const FIELDS: { key: string; label: string; hint: string; rows?: number }[] = [
  { key: "heroTagline", label: "Hero tagline", hint: "The line under the dot at the top of the hero.", rows: 3 },
  { key: "workHeading", label: "Work section heading", hint: "The big heading above your projects." },
  { key: "contactHeading", label: "Contact heading", hint: "Use a line break for two lines (e.g. \"Let's build\" then \"something\")." },
  { key: "contactText", label: "Contact description", hint: "The paragraph under the contact heading.", rows: 3 },
];

export default function ContentPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/content").then(r => r.json()).then(d => { setForm(d || {}); setLoading(false); });
    }
  }, [status]);

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteContent(form);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
      <p className="mb-6 text-sm text-gray-500">Edit the headings and copy across your homepage sections.</p>
      <Toast message={msg} />

      {loading ? (
        <SkeletonList rows={4} />
      ) : (
        <div className={cardCls}>
          <div className="space-y-5">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                {f.rows ? (
                  <textarea
                    value={form[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    rows={f.rows}
                    className={inputCls}
                  />
                ) : (
                  <input
                    value={form[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className={inputCls}
                  />
                )}
                <p className="mt-1 text-xs text-gray-400">{f.hint}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <PrimaryButton loading={saving} onClick={save}>Save</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
