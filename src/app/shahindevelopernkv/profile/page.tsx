"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { updateProfile, uploadPhoto } from "../actions";
import {
  Spinner,
  SkeletonList,
  Toast,
  PrimaryButton,
  inputCls,
  labelCls,
  cardCls,
} from "@/components/admin/ui";

interface ProfileData {
  name: string;
  role: string;
  tagline: string;
  intro: string;
  summary: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  photo: string;
}

const emptyProfile: ProfileData = {
  name: "",
  role: "",
  tagline: "",
  intro: "",
  summary: "",
  location: "",
  phone: "",
  email: "",
  linkedin: "",
  photo: "",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/shahindevelopernkv/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/profile")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) => {
          if (data) {
            setForm({
              name: data.name ?? "",
              role: data.role ?? "",
              tagline: data.tagline ?? "",
              intro: data.intro ?? "",
              summary: data.summary ?? "",
              location: data.location ?? "",
              phone: data.phone ?? "",
              email: data.email ?? "",
              linkedin: data.linkedin ?? "",
              photo: data.photo ?? "",
            });
          }
        })
        .catch(() => {
          showToast("Failed to load profile data.");
        })
        .finally(() => setLoading(false));
    }
  }, [status]);

  function showToast(message: string) {
    setMsg(message);
    setTimeout(() => setMsg(""), 3000);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      showToast("Profile updated successfully.");
    } catch {
      showToast("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const photoUrl = await uploadPhoto(formData);
      setForm((prev) => ({ ...prev, photo: photoUrl }));
      showToast("Photo uploaded. Save to apply changes.");
    } catch {
      showToast("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  }

  if (status === "unauthenticated") return null;

  const fields: { label: string; name: keyof ProfileData; type?: string; rows?: number }[] = [
    { label: "Name", name: "name" },
    { label: "Role", name: "role" },
    { label: "Tagline", name: "tagline" },
    { label: "Intro", name: "intro", type: "textarea", rows: 3 },
    { label: "Summary", name: "summary", type: "textarea", rows: 4 },
    { label: "Location", name: "location" },
    { label: "Phone", name: "phone" },
    { label: "Email", name: "email" },
    { label: "LinkedIn", name: "linkedin" },
  ];

  return (
    <div>
      <Toast message={msg} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information, bio, and contact details.
        </p>
      </div>

      {status === "loading" || loading ? (
        <SkeletonList rows={3} />
      ) : (
        <form onSubmit={handleSave}>
          <div className={`${cardCls} mb-6`}>
            {/* Photo section */}
            <div className="mb-8">
              <label className={labelCls}>Profile Photo</label>
              <div className="flex items-center gap-5">
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt="Profile"
                    className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 text-xs text-gray-400">
                    No photo
                  </div>
                )}
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                    {uploading && <Spinner className="h-4 w-4" />}
                    {uploading ? "Uploading..." : "Choose File"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                    />
                  </label>
                  {form.photo && (
                    <p className="mt-2 text-xs text-gray-500">{form.photo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <label htmlFor={field.name} className={labelCls}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      rows={field.rows}
                      className={inputCls}
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={form[field.name]}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <PrimaryButton type="submit" loading={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  );
}
