export type GenreType = {
  id: string;
  name: string;
};

export type RoleType = {
  name: string;
  description: string;
};

export type MovieType = {
  id: string;
  name: string;
  premiere: string;
  language: string;
  content: string;
  duration: number;
  rate: number;
  image: string;
  canComment: boolean;
  genres: GenreType[];
};

export type UserType = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: boolean;
  email: string;
  avatar: string;
  status: boolean;
};

export type JobType = {
  id: string;
  name: string;
};

export type PersonType = {
  id: string;
  name: string;
  gender: boolean;
  dateOfBirth: string | null;
  image: string;
  job: JobType;
};

export type TheaterType = {
  id: string;
  name: string;
  location: string;
};

export type MovieDetailType = {
  id: string;
  name: string;
  premiere: string;
  language: string;
  content: string;
  duration: number;
  rate: number;
  image: string;
  canComment: boolean;
  genres: GenreType[];
  director: PersonType;
  actors: PersonType[];
};

export type ShowtimeType = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSeat: number;
  emptySeat: number;
  status: string;
  theater: TheaterType;
  movie: MovieDetailType;
  room: RoomType;
};

export type SeatType = {
  id: string;
  locateRow: string;
  locateColumn: number;
  price: number;
  isCouple: boolean | null;
};

export type RoomType = {
  id: string;
  name: string;
  columns: number;
  rows: number;
  seats: SeatType[];
};

export type FeedbackType = {
  id: string;
  content: string;
  rate: number;
  date: string;
  time: string;
  byName: string;
  byEmail: string;
  movieId: string;
  status: boolean;
};

export type CouponType = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  minValue: number;
  description: string;
  image: string;
  publicId: string;
  status: boolean;
};

export type FoodType = {
  id: string;
  name: string;
  price: number;
  image: string;
  publicId: string;
};

export type FoodDetailType = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  publicId: string;
};

export type InvoiceType = {
  id: string;
  date: string;
  time: string;
  status: boolean;
  amount: number;
  user: UserType;
  showtime: ShowtimeType;
  room: RoomType;
  food: FoodDetailType;
  coupon: CouponType;
};

export type InvoiceDetailType = {
  id: string;
  price: number;
  ticketId: string;
  seat: SeatType;
};
