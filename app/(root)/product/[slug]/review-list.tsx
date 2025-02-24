"use client";

import { Review } from "@/types";
import { useState } from "react";
import Link from "next/link";
import ReviewForm from "./review-form";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <p>No reviews yet</p>}
      {userId ? (
        <>{/* <ReviewForm /> */}</>
      ) : (
        <div>
          Please{" "}
          <Link
            className="text-blue-400 px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            Sign in
          </Link>
          to add a review
        </div>
      )}
      <div className="flex flex-col gap-3">{/* Review List */}</div>
    </div>
  );
};

export default ReviewList;
