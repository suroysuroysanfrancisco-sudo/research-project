import { supabase } from "./supabase";

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `destinations/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("destinations")
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError);
    throw new Error("Upload failed");
  }

  // Get public URL
  const { data } = supabase.storage
    .from("destinations")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
