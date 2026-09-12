// src/dtos/task.dto.ts
export interface CreateTaskDto {
  title: string;
  description?: string;
  email: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean | string;
  email?: string;
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  user?: {
    email: string;
  };
}