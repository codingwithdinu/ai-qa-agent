import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import api from "../../api/client";

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;

  onRecordingStarted: (
    recordingId: string,
    url: string
  ) => void;
}

export function RecordingModal({
  open,
  onClose,
  onRecordingStarted,
}: RecordingModalProps) {

  const { selectedWorkspace } = useAppContext();

  const [url, setUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open) return null;

  const startRecording =
    async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await api.post(
            "/record/start",
            {
              url,
              sessionId: "demo-session",
              workspaceId:
                selectedWorkspace?.id,
            }
          );

        const result =
          response.data;

        try {

        } catch (error: any) {

          console.log(
            error.response?.data
          );

        }

        localStorage.setItem(
          "recordingId",
          result.recordingId
        );

        onRecordingStarted(
          result.recordingId,
          url
        );

        onClose();

      } catch {

        setError(
          "Server connection failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6">

        <h2 className="text-2xl font-semibold text-white">
          Start Recording
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Enter website URL to begin recording user actions.
        </p>

        <div className="mt-6">

          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            className="input-shell w-full"
          />

        </div>

        {
          error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )
        }

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2 text-sm text-slate-300"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={startRecording}
            className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-medium text-black"
          >
            {
              loading
                ? "Starting..."
                : "Start Recording"
            }
          </button>

        </div>

      </div>

    </div>
  );
}