import { supabase } from "./supabaseClient";

export async function uploadImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `destinations/${fileName}`;

  // Upload to storage bucket
  const { error } = await supabase.storage
    .from("destinations")
    .upload(filePath, file);

  if (error) throw error;

  // Get the PUBLIC URL
  const { data } = supabase.storage
    .from("destinations")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
