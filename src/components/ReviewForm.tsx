import { useState } from "react";
import { StarRating } from "./StarRating";
import { X, Send, Calendar, User, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export interface ReviewData {
  user_name: string;
  user_email?: string;
  rating: number;
  title?: string;
  comment: string;
  visit_date?: string;
}

interface ReviewFormProps {
  destinationId: string;
  destinationName: string;
  onSubmit: (review: ReviewData) => Promise<void>;
  onClose: () => void;
}

export const ReviewForm = ({
  destinationId,
  destinationName,
  onSubmit,
  onClose,
}: ReviewFormProps) => {
  const [formData, setFormData] = useState<ReviewData>({
    user_name: "",
    user_email: "",
    rating: 0,
    title: "",
    comment: "",
    visit_date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!formData.comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success("Review submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-background/95 backdrop-blur-md border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="relative h-32 bg-primary/10 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-primary mb-1">
                Write a Review
              </h2>
              <p className="text-muted-foreground font-medium px-4">
                Share your experience at {destinationName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-background rounded-full transition-colors backdrop-blur-sm shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Rating Section - Centered & Prominent */}
            <div className="flex flex-col items-center justify-center pb-6 border-b border-border/50">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                How was your experience?
              </label>
              <StarRating
                value={formData.rating}
                onChange={(rating) => setFormData({ ...formData, rating })}
                size="xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Your Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) =>
                    setFormData({ ...formData, user_name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.user_email}
                  onChange={(e) =>
                    setFormData({ ...formData, user_email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Visit Date & Title */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Visit Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) =>
                    setFormData({ ...formData, visit_date: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review Title (Optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-3 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Your Review <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="What did you like or dislike? How was the atmosphere?"
                rows={5}
                className="w-full px-4 py-3 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-6 py-4 border border-input rounded-xl font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:hover:shadow-none"
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Review <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

