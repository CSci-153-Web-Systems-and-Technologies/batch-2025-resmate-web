'use client';
import { Button } from "@/components/ui/button";
import { DraftSubmission, VersionFeedback } from "@/lib/model/messages";
import { useEffect, useState } from "react";
import { getVersionFeedbacks } from "@/lib/db/message-db";
import { VersionCard } from "./version-card";
import { SubmitDraftModal } from "../modal/submission";

type DraftAreaProps = {
  draft: DraftSubmission | null;
  initialVersions?: VersionFeedback[];
}

export function DraftArea({
  draft,
  initialVersions,
}: DraftAreaProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [versions, setVersions] = useState<VersionFeedback[]>(initialVersions ?? []);

  const draftId = draft?.draft_id;

  useEffect(() => {
    // If initial versions are provided (from a preloaded bundle), use them.
    if (initialVersions && initialVersions.length) {
      setVersions(initialVersions);
      return;
    }

    // Otherwise, fall back to fetching versions for the draft on demand.
    const fetchVersions = async () => {
      if (!draftId) return;
      const fetchedVersions = await getVersionFeedbacks(draftId!);
      setVersions(fetchedVersions ?? []);
    };

    fetchVersions();
  }, [draftId, initialVersions]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Section Title */}
      <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
        <h2 className="text-base md:text-lg font-semibold truncate">{draft?.draft_title}</h2>
        <Button
          disabled={!draftId}
          className="whitespace-nowrap"
          onClick={() => setIsOpenModal(true)}
        >
          Submit Modified Draft
        </Button>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-6 space-y-6">
        {versions.map((version) => {

          return (
            <VersionCard
              key={version.version_id}
              version={version}            
            />
          )
        })}
      </div>

      <SubmitDraftModal isOpen={isOpenModal} onOpenChange={setIsOpenModal} draft={draft} />
    </div>
  )
}