export interface Review {
  id: string;
  rating: number | null;
  comment?: string | null;
  createdAt: string;
  reviewerName: string;
  reviewerAvatar?: string | null;
}

export interface CreateReviewPayload {
  serviceId: string;
  rating: number;
  comment?: string;
}
