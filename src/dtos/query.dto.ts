// src/dtos/query.dto.ts
export interface QueryOptionsDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  completed?: boolean;
  search?: string;
}