"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateResumeSummary } from "../actions";
import { SkeletonList, Toast, PrimaryButton, inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default function ResumePage() {
  const { status } = useSession();
  const router = useRouter();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/resume").then(r => r.json()).then(d => { setText(d.text || ""); setLoading(false); });
    }
  }, [status]);

  const save = async () => {
    setSaving(true);
    try {
      await updateResumeSummary(text);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Resume Summary</h1>
      <Toast message={msg} />

      {loading ? (
        <SkeletonList rows={2} />
      ) : (
        <>
          <div className={cardCls}>
            <label className={labelCls}>Professional Summary (shown on the resume page)</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={10}
              className={`${inputCls} leading-relaxed`}
            />
            <div className="mt-4">
              <PrimaryButton loading={saving} onClick={save}>Save</PrimaryButton>
            </div>
          </div>

          <div className={`mt-6 ${cardCls}`}>
            <h2 className="mb-2 text-lg font-bold text-gray-900">Preview</h2>
            <p className="text-sm leading-relaxed text-gray-500">{text}</p>
          </div>
        </>
      )}
    </div>
  );
}
