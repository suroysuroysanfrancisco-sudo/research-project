import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PanoramaViewer } from "@/components/PanoramaViewer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Info,
  MessageSquare,
} from "lucide-react";
import { RatingDisplay } from "@/components/RatingDisplay";
import { ReviewForm, ReviewData } from "@/components/ReviewForm";
import { ReviewsList, Review } from "@/components/ReviewsList";

const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className="relative h-full min-h-[500px] rounded-xl overflow-hidden shadow-sm group">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>
    </div>
  );
};

const DestinationSingle = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      console.log("Loaded destination data:", data);
      console.log("Hotspots count:", data.hotspots?.length || 0);
      setData(data);
    }
    setLoading(false);
    
    // Load reviews
    loadReviews();
  };

  const loadReviews = async () => {
    const { data: reviewsData } = await supabase
      .from("destination_reviews")
      .select("*")
      .eq("destination_id", id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (reviewsData && reviewsData.length > 0) {
      setReviews(reviewsData);
      // Calculate average rating
      const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
      setAvgRating(avg);
    }
  };

  const handleSubmitReview = async (reviewData: ReviewData) => {
    const { error } = await supabase
      .from("destination_reviews")
      .insert({
        destination_id: id,
        ...reviewData,
        is_approved: true,
      });

    if (!error) {
      loadReviews(); // Refresh reviews
    } else {
      throw error;
    }
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
          style={{ backgroundImage: `url(${data.thumbnail_url || data.image_url})` }}
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
            {reviews.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-white/90 text-sm px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-white/90 text-sm px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-primary" /> 2–3 hours
            </span>
            <span className="inline-flex items-center gap-1 bg-white/90 text-sm px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4 text-primary" /> {data.address}
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-10">

            {/* ABOUT & PARALLAX IMAGE GRID */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-card rounded-xl p-8 shadow-sm flex flex-col">
                <h2 className="text-2xl font-semibold mb-4">
                  About This Destination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {data.long_description}
                </p>
              </div>

              {/* Parallax Image (Replacing Highlights) */}
              <ParallaxImage src={data.thumbnail_url || data.image_url} alt={data.title} />
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
                {data.panorama_images && data.panorama_images.length > 0 ? (
                  <PanoramaViewer
                    panoramas={data.panorama_images}
                    hotspots={data.hotspots || []}
                  />
                ) : data.image_url ? (
                  <PanoramaViewer
                    panoramas={[{
                      id: 'default',
                      name: data.title,
                      url: data.image_url,
                      isDefault: true,
                      order: 0
                    }]}
                    hotspots={data.hotspots || []}
                  />
                ) : (
                  <div className="w-full h-[70vh] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    No 360° panorama available
                  </div>
                )}
              </div>
            </div>
            
            {/* REVIEWS & RATINGS */}
            <div className="bg-card rounded-xl p-8 shadow-sm mt-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Reviews & Ratings
                </h3>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {reviews.length > 0 && (
                <div className="mb-8">
                  <RatingDisplay
                    rating={avgRating}
                    reviewCount={reviews.length}
                    size="lg"
                  />
                </div>
              )}

              <ReviewsList reviews={reviews} />
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

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          destinationId={id!}
          destinationName={data.title}
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default DestinationSingle;
