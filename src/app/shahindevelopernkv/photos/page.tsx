"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { uploadPhoto, updateProfilePhoto } from "../actions";
import { SkeletonList, Toast, PrimaryButton } from "@/components/admin/ui";

export default function PhotosPage() {
  const { status } = useSession();
  const router = useRouter();
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === "unauthenticated") router.push("/shahindevelopernkv/login"); }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/profile").then(r => r.json()).then(d => { setCurrentPhoto(d.photo || ""); setLoading(false); });
    }
  }, [status]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const input = document.querySelector<HTMLInputElement>("#photo-input");
    const file = input?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const path = await uploadPhoto(formData);
      await updateProfilePhoto(path);

      setCurrentPhoto(path);
      setPreview("");
      setMsg("Photo uploaded and set as portrait!");
      setTimeout(() => setMsg(""), 3000);

      // Reload profile to get fresh data for the partial update
      fetch("/api/admin/profile").then(r => r.json()).then(d => setCurrentPhoto(d.photo || ""));
    } finally {
      setUploading(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Photos</h1>
      <Toast message={msg} />

      {loading ? (
        <SkeletonList rows={2} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Current Portrait</h2>
            {currentPhoto ? (
              <img src={currentPhoto} alt="Current portrait" className="h-64 w-full rounded-xl border border-gray-200 object-cover object-top" />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 text-gray-400">No photo set</div>
            )}
            <p className="mt-2 text-xs text-gray-500">Path: {currentPhoto || "none"}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Upload New Photo</h2>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#16a34a] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#15803d]"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-4 h-48 w-full rounded-xl border border-gray-200 object-cover object-top" />
            )}
            <div className="mt-4">
              <PrimaryButton loading={uploading} onClick={handleUpload} className="w-full">
                Upload & Set as Portrait
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
