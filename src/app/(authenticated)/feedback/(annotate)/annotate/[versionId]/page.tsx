export default async function AnnotationPage({ 
  params 
}: { 
  params: Promise<{ versionId: string}> 
}) {
  const versionId = (await params).versionId;

  return (
    <div>
      Annotation Page: {versionId}
    </div>
  )
}