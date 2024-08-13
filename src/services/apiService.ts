import axios, { AxiosResponse } from 'axios';

export default class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async get<T>(url: string, params?: unknown): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get<T>(
        `${this.baseUrl}${url}`,
        { params }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async post<T>(url: string, data: unknown): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post<T>(
        `${this.baseUrl}${url}`,
        data
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async put<T>(url: string, data: unknown): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put<T>(
        `${this.baseUrl}${url}`,
        data
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic DELETE method
  public async delete<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete<T>(
        `${this.baseUrl}${url}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Handle errors
  private handleError(error: unknown): void {
    console.error('API call failed: ', error);
  }
}
