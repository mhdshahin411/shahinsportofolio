"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

/**
 * Registers the admin service worker, injects the admin PWA manifest/meta
 * (so the install prompt only appears inside the admin), and shows an
 * "Install app" button when the browser offers installation.
 */
export default function AdminPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/shahindevelopernkv" })
        .catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <>
      {/* Admin-only PWA metadata (hoisted to <head> by React) */}
      <link rel="manifest" href="/admin.webmanifest" />
      <link rel="apple-touch-icon" href="/admin-icon.svg" />
      <meta name="theme-color" content="#16a34a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Shahin Admin" />

      {deferred && !hidden && (
        <button
          onClick={install}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#16a34a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#16a34a]/30 transition-transform hover:-translate-y-0.5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Install App
        </button>
      )}
    </>
  );
}
