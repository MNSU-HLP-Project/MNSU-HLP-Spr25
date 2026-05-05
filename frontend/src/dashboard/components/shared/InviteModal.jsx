import { useState, useEffect } from "react";
import { generateInvite, getClasses } from "../../../utils/api";
import { FaLink, FaCopy, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const InviteModal = ({ userRole = "Supervisor", onClose }) => {
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userRole === "Supervisor") {
      getClasses().then(setClassList).catch(console.error);
    }
  }, [userRole]);

  // Close on Escape
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  const handleGenerate = async () => {
    setError("");
    if (userRole === "Supervisor" && !selectedClass) {
      setError("Please select a class first.");
      return;
    }
    setGenerating(true);
    try {
      const link = await generateInvite(selectedClass || undefined);
      setInviteLink(link);
      setCopied(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate invite link. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const inviteMessage =
    userRole === "Admin"
      ? "Send this link to a supervisor:"
      : userRole === "Superuser"
      ? "Send this link to an admin:"
      : "Share this link with students to join the class:";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <FaLink className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Invite to Class</h2>
                <p className="text-sm text-green-100">Generate a one-time invite link</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl leading-none transition"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Class picker (Supervisor only) */}
          {userRole === "Supervisor" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => { setSelectedClass(e.target.value); setError(""); setInviteLink(""); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <option value="">— Choose a class —</option>
                {classList.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60"
          >
            {generating ? "Generating…" : "Generate Invite Link"}
          </button>

          {/* Result */}
          {inviteLink && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{inviteMessage}</p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="flex-1 text-xs text-gray-700 font-mono break-all">{inviteLink}</p>
                <button
                  onClick={handleCopy}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    copied
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-gray-400">This link can be used multiple times until you generate a new one.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
