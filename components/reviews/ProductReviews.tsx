"use client"

import { useState, useEffect } from "react"
import { Star, CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: number
  product_id: number
  user_id?: number
  guest_name?: string
  user_name?: string
  rating: number
  title?: string
  review_text: string
  is_verified_purchase: boolean
  helpful_count: number
  not_helpful_count: number
  created_at: string
}

interface ProductReviewsProps {
  productId: number
  averageRating?: number
  reviewCount?: number
}

export default function ProductReviews({ productId, averageRating, reviewCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    review_text: "",
    guest_name: "",
    guest_email: ""
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  async function fetchReviews() {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?product_id=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.review_text || formData.review_text.length < 10) {
      toast({
        title: "Error",
        description: "Review must be at least 10 characters long",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          ...formData
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message || "Review submitted successfully"
        })
        setFormData({
          rating: 5,
          title: "",
          review_text: "",
          guest_name: "",
          guest_email: ""
        })
        setShowReviewForm(false)
        // Optionally refresh reviews
        fetchReviews()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit review",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }
          />
        ))}
      </div>
    )
  }

  function RatingBreakdown() {
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = reviews.filter(r => r.rating === rating).length
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
      return { rating, count, percentage }
    })

    return (
      <div className="space-y-2 mb-6">
        {distribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center gap-3">
            <span className="text-sm text-foreground w-12">{rating} star</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6 bg-card border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Customer Reviews</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-5xl font-bold text-foreground">
                {averageRating?.toFixed(1) || "0.0"}
              </div>
              <div>
                <StarRating rating={Math.round(averageRating || 0)} size={24} />
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {reviewCount || 0} reviews
                </p>
              </div>
            </div>
          </div>
          <div>
            {reviews.length > 0 && <RatingBreakdown />}
          </div>
        </div>

        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Review Title (Optional)
              </label>
              <Input
                type="text"
                placeholder="Summarize your review"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-input border-border text-foreground"
                maxLength={100}
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Review *
              </label>
              <Textarea
                placeholder="Share your experience with this product..."
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                className="bg-input border-border text-foreground min-h-[120px]"
                required
                minLength={10}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 10 characters ({formData.review_text.length}/10)
              </p>
            </div>

            {/* Guest Info (if not logged in) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.guest_email}
                  onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          All Reviews ({reviews.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-8 text-center bg-card border-border">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6 bg-card border-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} size={16} />
                    {review.is_verified_purchase && (
                      <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        <CheckCircle size={12} />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-foreground mb-1">{review.title}</h4>
                  )}
                  <p className="text-sm text-muted-foreground">
                    By {review.user_name || review.guest_name || "Anonymous"} •{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-foreground leading-relaxed mb-4">
                {review.review_text}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Was this helpful?</span>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition">
                  <ThumbsUp size={16} />
                  <span>{review.helpful_count}</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition">
                  <ThumbsDown size={16} />
                  <span>{review.not_helpful_count}</span>
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
