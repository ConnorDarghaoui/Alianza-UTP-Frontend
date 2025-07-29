
import api from './client';
import type { AxiosError } from 'axios';

/**
 * BaseApiService provides a template for CRUD operations against a specific API endpoint.
 * It standardizes API communication, centralizes error handling, and ensures a consistent
 * response format `[data, error]`.
 *
 * @template T The data type of the resource being managed.
 */
export class BaseApiService<T> {
  private readonly endpoint: string;

  /**
   * @param endpoint The specific API endpoint for the resource (e.g., 'clubs', 'activities').
   */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Fetches all resources from the endpoint.
   * @returns A tuple `[T[] | null, AxiosError | null]`.
   */
  async getAll(): Promise<[T[] | null, AxiosError | null]> {
    try {
      const response = await api.get<T[]>(`/${this.endpoint}`);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }

  /**
   * Fetches a single resource by its ID.
   * @param id The ID of the resource to fetch.
   * @returns A tuple `[T | null, AxiosError | null]`.
   */
  async getById(id: string | number): Promise<[T | null, AxiosError | null]> {
    try {
      const response = await api.get<T>(`/${this.endpoint}/${id}`);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }

  /**
   * Creates a new resource.
   * @param data The data for the new resource.
   * @returns A tuple `[T | null, AxiosError | null]`.
   */
  async create(data: Partial<T>): Promise<[T | null, AxiosError | null]> {
    try {
      const response = await api.post<T>(`/${this.endpoint}`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }

  /**
   * Updates an existing resource.
   * @param id The ID of the resource to update.
   * @param data The new data for the resource.
   * @returns A tuple `[T | null, AxiosError | null]`.
   */
  async update(id: string | number, data: Partial<T>): Promise<[T | null, AxiosError | null]> {
    try {
      const response = await api.put<T>(`/${this.endpoint}/${id}`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }

  /**
   * Deletes a resource by its ID.
   * @param id The ID of the resource to delete.
   * @returns A tuple `[boolean | null, AxiosError | null]`.
   */
  async delete(id: string | number): Promise<[boolean | null, AxiosError | null]> {
    try {
      await api.delete(`/${this.endpoint}/${id}`);
      return [true, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }
}
