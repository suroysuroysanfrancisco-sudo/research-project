// src/lib/uploadImage.ts
import { supabase } from "./supabase";

export async function uploadImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `destinations/${fileName}`;

  const { data, error } = await supabase.storage
    .from("destinations") // bucket name
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // return PUBLIC URL
  const { data: { publicUrl } } = supabase.storage
    .from("destinations")
    .getPublicUrl(filePath);

  return publicUrl;
}
