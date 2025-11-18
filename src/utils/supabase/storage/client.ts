import { createClient } from "../client";

type UploadPDFFile = {
  file: File;
  bucket: string;
  folder?: string;
  fileName?: string;
}

export async function uploadPDFFile({
  file,
  bucket,
  folder,
  fileName,
}: UploadPDFFile) {
  const supabase = createClient()

  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const uniqueFileName = fileName || `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file); 

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message);
  }
}