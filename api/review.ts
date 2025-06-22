import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";
import { ErrorResponse } from "./auth";
import {
  ReposrtResponse,
  ReportCreate,
  ReviewCreate,
  VendorReviewResponse,
  ReportStatusUpdate,
  ReviewCreateResponse,
} from "@/types/review-types";

const REPORT_BASE_URL = "/reports";
const REVIEW_BASE_URL = "/reviews";

// <<<<< ---------- REPORT ---------- >>>>>

// Fetch report
export const fetchReport = async (
  reportId: string
): Promise<ReposrtResponse[]> => {
  try {
    const response: ApiResponse<ReposrtResponse[] | ErrorResponse> =
      await apiClient.get(`${REPORT_BASE_URL}/${reportId}/detail`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error fetching report.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Fetch reports
export const fetchCurrentReports = async (): Promise<ReposrtResponse[]> => {
  try {
    const response: ApiResponse<ReposrtResponse[] | ErrorResponse> =
      await apiClient.get(`${REPORT_BASE_URL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error fetching reports.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Create Report
export const createReport = async (
  reportData: ReportCreate
): Promise<ReposrtResponse> => {
  const data = {
    description: reportData.description,
    reporting: reportData.reporting,
    issue_type: reportData.issue_type,
    delivery_id: reportData.delivery_id || "",
    dispatch_id: reportData.dispatch_id,
    vendor_id: reportData.vendor_id,
    customer_id: reportData.customer_id,
    reporter_id: reportData.reporter_id,
  };
  try {
    const response: ApiResponse<ReposrtResponse | ErrorResponse> =
      await apiClient.post(`${REPORT_BASE_URL}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error creating report.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
// Update Report
export const updateReportStatus = async (
  reportData: ReportStatusUpdate,
  reportId: string
): Promise<ReportStatusUpdate> => {
  const data = {
    issue_status: reportData.issue_status,
  };
  try {
    const response: ApiResponse<ReposrtResponse | ErrorResponse> =
      await apiClient.post(`${REPORT_BASE_URL}/${reportId}/update}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error updating report status.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// <<<<< ---------- REVIEW ---------- >>>>>
// Fetch reviews
export const fetchCurrentReviews = async (
  vendorId: string
): Promise<VendorReviewResponse[]> => {
  try {
    const response: ApiResponse<VendorReviewResponse[] | ErrorResponse> =
      await apiClient.get(`${REVIEW_BASE_URL}/${vendorId}/vendor-reviews`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error fetching reviews.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Create Review
export const createReview = async (
  reviewData: ReviewCreate
): Promise<ReviewCreateResponse> => {
  const data = {
    order_id: reviewData.order_id,
    item_id: reviewData.item_id,
    reviewee_id: reviewData.reviewee_id,
    rating: reviewData.rating || "",
    comment: reviewData.comment,
    review_type: reviewData.review_type,
  };
  try {
    const response: ApiResponse<ReviewCreateResponse | ErrorResponse> =
      await apiClient.post(`${REVIEW_BASE_URL}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error creating review.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
