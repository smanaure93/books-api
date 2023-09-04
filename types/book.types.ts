export type Book = {
  id?: number;
  title: string;
  chapters: number;
  pages: number;
};

export type CreateBookRequest = Book & { authors: number[] };
