import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { DraftSubmission } from "@/lib/model/messages";
import { getDraftSubmissions } from "@/lib/db/message-db";

type DraftSelectorDialogProps = {
  conversationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDraft: (draft: DraftSubmission) => void;
};

export function DraftSelectorDialog({
  conversationId,
  open,
  onOpenChange,
  onSelectDraft,
}: DraftSelectorDialogProps) {
  const [drafts, setDrafts] = useState<DraftSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getDraftSubmissions(conversationId)
      .then((res) => {
        setDrafts(res || []);
        // Preselect latest by created_at if available
        const latest =
          [...(res || [])].sort(
            (a, b) =>
              new Date(b.created_at || "").getTime() -
              new Date(a.created_at || "").getTime()
          )[0];
        setSelectedId(latest?.draft_id ?? null);
      })
      .catch((e) => {
        console.error("Failed to load drafts for conversation:", conversationId, e);
        setDrafts([]);
        setSelectedId(null);
      })
      .finally(() => setLoading(false));
  }, [open, conversationId]);

  const handleConfirm = () => {
    const chosen = drafts.find((d) => d.draft_id === selectedId);
    if (chosen) {
      onSelectDraft(chosen);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Draft</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-6 text-sm text-gray-500">Loading drafts…</div>
        ) : drafts.length === 0 ? (
          <div className="py-6 text-sm text-gray-500">
            No drafts for this conversation yet.
          </div>
        ) : (
          <ul className="mt-2 space-y-1">
            {drafts.map((draft) => {
              const selected = draft.draft_id === selectedId;
              const title = draft.draft_title || draft.draft_title || "Untitled Draft";
              return (
                <li key={draft.draft_id}>
                  <button
                    className={`w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 border ${
                      selected ? "border-blue-600" : "border-transparent"
                    }`}
                    onClick={() => setSelectedId(draft.draft_id!)}
                  >
                    <span
                      className={`inline-flex items-center justify-center rounded-full border w-5 h-5 ${
                        selected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-transparent"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1">
                      <div className={`text-sm ${selected ? "font-semibold" : ""}`}>{title}</div>
                      {draft.created_at && (
                        <div className="text-xs text-gray-500">
                          {new Date(draft.created_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!selectedId} onClick={handleConfirm}>Use Draft</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}