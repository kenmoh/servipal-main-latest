type IssueType =
  | "damage_items"
  | "wrong_items"
  | "late_delivery"
  | "rider_behaviour"
  | "customer_behaviour"
  | "others";

type IssueStatus = "pending" | "investigating" | "resolved" | "dismissed";

type ReportingType = "vendor" | "customer" | "dispatch";

export type ReviewerType = "order" | "product";

export interface ReportCreate {
  order_id?: string;
  delivery_id?: string;
  dispatch_id?: string;
  vendor_id?: string;
  reporter_id: string;
  customer_id?: string;
  description: string;
  issue_type: IssueType;
  reporting: ReportingType;
}

export interface ReposrtResponse extends ReportCreate {
  id: string;
  issue_status: IssueStatus;
  created_at: string;
  updated_at: string;
}

export interface ReportStatusUpdate {
  issue_status: IssueStatus;
}

export interface ReviewCreate {
  order_id?: string;
  item_id?: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  review_type: ReviewerType;
}

export interface ReviewCreateResponse {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewerProfile {
  id: string;
  full_name: string;
  profile_image_url: string;
}

export interface VendorReviewResponse {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: ReviewerProfile;
}
