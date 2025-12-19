import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Viewer360 } from "@/components/Viewer360";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Info,
} from "lucide-react";

const DestinationSingle = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setData(data);
    setLoading(false);
  };

  if (loading) return <div className="pt-40 text-center">Loading...</div>;
  if (!data) return <div className="pt-40 text-center">Destination not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{data.title} | Camotes Island Explorer</title>
      </Helmet>

      <Navigation />

      {/* HERO */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.cover_image || data.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />

        <div className="relative container mx-auto px-4 max-w-6xl">
          <Link
            to="/destinations"
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-6"
          >
            ← Back to Destinations
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4"
          >
            {data.title}
          </motion.h1>

          <p className="text-white/80 max-w-2xl mb-6">
            {data.subtitle || data.short_description}
          </p>

          {/* META CHIPS */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1 bg-white/90 text-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" /> 4.7 Rating
            </span>
            <span className="inline-flex items-center gap-1 bg-white/90 text-sm px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-primary" /> 2–3 hours
            </span>
            <span className="inline-flex items-center gap-1 bg-white/90 text-sm px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4 text-primary" /> {data.location}
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto px-4 max-w-6xl pb-24">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-10">

            {/* ABOUT */}
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                About This Destination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {data.long_description}
              </p>
            </div>

            {/* HIGHLIGHTS */}
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Highlights</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(data.highlights || []).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TRAVELER TIPS */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Traveler Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Bring waterproof camera or phone case</li>
                <li>Wear water shoes – surfaces can be slippery</li>
                <li>Best visited early morning for fewer crowds</li>
                <li>Water is cold — perfect on hot days</li>
              </ul>
            </div>

            {/* VIRTUAL TOUR */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Virtual Tour</h3>
              <div className="rounded-xl overflow-hidden shadow-md">
                <Viewer360 imageUrl={data.image_url} title={data.title} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8 lg:sticky lg:top-32 h-fit">

            {/* MAP */}
            <div className="bg-card rounded-xl overflow-hidden shadow-sm">
              <iframe
                src={data.map_embed}
                className="w-full h-[260px]"
                loading="lazy"
              />
              <div className="p-4 text-sm text-muted-foreground">
                {data.address}
              </div>
            </div>

            {/* QUICK INFO */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold mb-4">Quick Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Best Time to Visit</span>
                  <span className="font-medium">Year-round</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrance Fee</span>
                  <span className="font-medium">₱50</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities</span>
                  <span className="font-medium">Swimming, Sightseeing</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DestinationSingle;
