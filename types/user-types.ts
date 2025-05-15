type Role =
  | "Dispatch Provider"
  | "Rider"
  | "staff"
  | "Regular User"
  | "Restaurant Service Provider"
  | "Laundry Service Provider";

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

export interface Company {
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

// Type for an array of companies
export type CompanyResponse = Company[];

export type Login = {
  username: string;
  password: string;
};
