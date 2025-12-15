import { Suspense } from "react";
import AnnotatorClient from "./annotator-client";
import { Skeleton } from "antd";

export default function AnnotationPage(
  { params }: { params: { versionId: string }} 
) {
  // Fetch version details server-side if needed
  // For example, to check if the version is closed or to get the file URL
  const versionId = params.versionId;

  return (
    <Suspense fallback={<Skeleton />}>
      <AnnotatorClient
        versionId={params.versionId}
      />
    </Suspense>
  );
}