"use client";

/** Spinning loader icon. Size/color via className (uses currentColor). */
export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/** Pulsing grey placeholder block. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

/** A skeleton card list shown while data loads. */
export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-3 h-3 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

/** Toast-style success/info banner. */
export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#16a34a]/20 bg-[#16a34a]/10 px-4 py-2.5 text-sm font-medium text-[#15803d]">
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}

/** Primary button that shows a spinner + disables while `loading`. */
export function PrimaryButton({
  children,
  loading,
  onClick,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

/** Shared light-theme input classes. */
export const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#16a34a] focus:outline-none focus:ring-1 focus:ring-[#16a34a]";
export const labelCls = "mb-1 block text-xs font-medium text-gray-600";
export const cardCls = "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";
