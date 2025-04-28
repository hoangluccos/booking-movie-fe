export type GenreType = {
  id: string;
  name: string;
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

export interface CreateMovieRequest {
  name: string;
  content: string;
  premiere: string;
  duration: number;
  language: string;
  rate: number;
  genresId: string[]; // Change to genresId as string[]
  directorId: string;
  actorsId: string[];
  // Note: image is handled separately as a file in FormData, so it's not included here
}
