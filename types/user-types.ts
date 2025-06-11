export const phoneRegEx =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

type Role = "dispatch" | "rider" | "customer" | "vendor";

type AccountStatus = "pending" | "confirmed";

export interface Bank {
  id: number;
  code: string;
  name: string;
}

export type UserReturn = {
  id: string;
  dispatch_id: string;
  full_name: string;
  bank_name: string;
  email: string;
  username: string;
  phone_number: string;
  bank_account_number: string;
  account_holder_name: string;
  location: string;
  profile_image: string;
  user_type: Role;
  company_name: string;
  company_reg_number: string;
  notification_token: string;
  plate_number: string;
  is_suspended: true;
  account_status: AccountStatus;
  confirm_email: number;
  opening_hour: string;
  closing_hour: string;
  confirm_phone_number: number;
  created_at: string;
  updated_at: string;
  dispatch: string;
};

interface Review {
  rating: string;
  comment: string;
  name: string;
  profile_image: string;
  created_at: string;
}

export interface CompanyProfile {
  id: string;
  company_name: string;
  email: string;
  phone_number: string;
  profile_image_url: string;
  location: string;
  backdrop_image_url: string;
  opening_hour: string;
  closing_hour: string;
  total_items: number;
  total_orders: number;
  rating: {
    average_rating: string;
    number_of_ratings: number;
    reviews: Review[];
  };
}

export type Login = {
  username: string;
  password: string;
};

export interface RiderProfile {
  profile_image_url?: string;
  full_name: string;
  email: string;
  phone_number: string;
  business_address: string;
  business_name: string;
  bike_number: string;
}

export interface Profile {
  user_id: string;
  full_name?: string;
  phone_number: string;
  bank_name?: string;
  bank_account_number?: string;
  bike_number?: string;
  business_name?: string;
  business_registration_number?: string;
  business_address?: string;
  closing_hours?: string;
  opening_hours?: string;
}

export interface UserProfileUpdate {
  phoneNumber: string;
  companyRegNo: string;
  location: string;
  companyName: string;
  openingHour: string;
  closingHour: string;
  accountNumber: string;
  bankName: string;
}

type TransactionType = "credit" | "debit";

interface Transaction {
  id: string;
  wallet_id: string;
  created_at: string;
  amount: number;
  transaction_type: TransactionType;
}
export interface Wallet {
  id: string;
  balance: number;
  escrow_balance: number;
  transactions: Transaction[];
}

export interface UserDetails {
  id: string;
  email: string;
  user_type: string;
  profile: Profile;
}
export interface CurrentUserDetails extends UserDetails {
  wallet: Wallet;
}

export interface User {
  account_status: AccountStatus;
  sub: string;
  user_type: Role;
  email: string;
}

export interface RiderResponse {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  bike_number: string;
  profile_image_url: string;
  stats: {
    total_deliveries: number;
    pending_deliveries: number;
    completed_deliveries: number;
  };
}

export interface ImageUrl {
  profile_image_url?: string;
  backdrop_image_url?: string;
}

export interface RiderUpdate {
  fullName: string;
  phoneNumber: string;
  bikeNumber: string;
}
