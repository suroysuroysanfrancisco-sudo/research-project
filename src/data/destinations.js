import { supabase } from "@/lib/supabase";

export const fetchDestinations = async () => {
  const { data, error } = await supabase.from("destinations").select("*");

  if (error) {
    console.error("Error loading destinations:", error);
    return [];
  }

  return data.map((d) => ({
    id: d.id,
    title: d.title,
    shortDescription: d.short_description,
    longDescription: d.long_description,
    image: d.image_url,
    address: d.address,
    mapEmbed: d.map_embed,
    hotspot: {
      top: d.hotspot_top,
      left: d.hotspot_left,
    },
  }));
};
