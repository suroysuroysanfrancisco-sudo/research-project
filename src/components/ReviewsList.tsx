import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  visit_date?: string;
  created_at: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

export const ReviewsList = ({ reviews }: ReviewsListProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative group">
      {/* Carousel Container */}
      <div className="overflow-hidden p-1" ref={emblaRef}>
        <div className="flex gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-0"
            >
              <div className="h-full bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {getInitials(review.user_name)}
                    </span>
                  </div>

                  {/* User Info & Rating */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <h4 className="font-semibold truncate">
                        {review.user_name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(review.created_at)}
                  </span>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  {review.title && (
                    <h5 className="font-medium mb-2 truncate">{review.title}</h5>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {review.comment}
                  </p>
                </div>
                
                {review.visit_date && (
                   <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                     Visited {formatDate(review.visit_date)}
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {reviews.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 flex items-center justify-center bg-background border rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-muted"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 flex items-center justify-center bg-background border rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-muted"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};
