import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number; // Average rating (e.g., 4.7)
  reviewCount: number; // Total number of reviews
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export const RatingDisplay = ({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
}: RatingDisplayProps) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${sizes[size]} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    // Half star
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <div key="half" className="relative">
          <Star className={`${sizes[size]} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${sizes[size]} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className={`${sizes[size]} text-gray-300`} />
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">{renderStars()}</div>
      <span className={`font-semibold ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && (
        <span className={`text-muted-foreground ${textSizes[size]}`}>
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};
