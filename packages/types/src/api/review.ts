export interface Review {
  id: string;
  serviceId: string;
  reviewerUserId: string;
  rating: number | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  reviewerName: string;
  reviewerAvatar: string | null;
}

export interface CreateReviewPayload {
  serviceId: string;
  rating: number;
  comment?: string;
}
