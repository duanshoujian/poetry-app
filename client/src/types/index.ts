export interface PoemAuthor {
  name: string;
  dynasty?: string;
  description?: string;
}

export interface Poem {
  id: string;
  title: string;
  author: string | PoemAuthor;
  authorId?: string;
  dynasty: string;
  type: string;
  content: string;
  excerpt?: string;
  translation?: string;
  annotation?: string;
  appreciation?: string;
}

export interface Author {
  id: string;
  name: string;
  dynasty: string;
  description?: string;
  poemCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PoemListParams {
  page?: number;
  pageSize?: number;
  dynasty?: string;
  type?: string;
  author?: string;
}

export interface SearchParams {
  q: string;
  type?: string;
}

export interface Stats {
  totalPoems: number;
  totalAuthors: number;
  dynastyCounts: Record<string, number>;
}
