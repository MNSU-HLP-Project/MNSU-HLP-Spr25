import { useEffect } from "react";

/**
 * Reusable confirmation dialog.
 *
 * Props:
 *   open        – boolean, whether to show the dialog
 *   title       – heading text
 *   message     – body text
 *   confirmLabel – label for the confirm button (default "Delete")
 *   onConfirm   – called when the user confirms
 *   onCancel    – called when the user cancels or clicks the backdrop
 *   danger      – boolean, red confirm button (default true)
 */
const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  danger = true,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onCancel?.(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        {/* Icon + Title */}
        <div className="flex items-start gap-3">
          <div className={`shrink-0 rounded-full p-2 ${danger ? "bg-red-100" : "bg-yellow-100"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${danger ? "text-red-600" : "text-yellow-600"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {message && <p className="mt-1 text-sm text-gray-600">{message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium text-sm text-white transition ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
