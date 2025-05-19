type Role = "dispatch" | "rider" | "customer" | "vendor";

type AccountStatus = "pending" | "confirmed";

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
  profile_image: string;
  location: string;
  company_background_image: string;
  opening_hour: string;
  closing_hour: string;
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

export interface Prfile {
  full_name?: string;
  phone_number: string;
  bank_name?: string;
  bank_account_number?: string;
  bike_number?: string;
  business_name?: string;
  business_redistration_number?: string;
  business_address?: string;
  closing_hours?: string;
  openning_hours?: string;
}

type TransactionType = "credit" | "debit";

interface Transaction {
  amount: number;
  transaction_type: TransactionType;
}
interface Wallet {
  id: string;
  balance: number;
  escrow_balance: number;
  transactions: Transaction[];
}

export interface UserDetails {
  id: string;
  email: string;
  user_type: string;
  profile: Prfile;
}
export interface CurrentUserDetails extends UserDetails {
  wallet: Wallet;
}

export interface User {
  account_status: AccountStatus;
  sub: string;
  user_type: Role;
}
