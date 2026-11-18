"use client";

/** Delete submit button with a browser confirm — used in admin lists. */
export default function DeleteButton({ label = "Delete" }: { label?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm("Delete this permanently?")) e.preventDefault();
      }}
      className="text-sm font-semibold text-red-700 hover:underline"
    >
      {label}
    </button>
  );
}
