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
