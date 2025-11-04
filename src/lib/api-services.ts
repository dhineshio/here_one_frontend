import api from './axios';

// Types for Client API responses
export interface Client {
  id: number;
  client_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  industry_type: string;
  brand_logo: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  tiktok_url: string | null;
  preferred_post_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetClientsResponse {
  success: boolean;
  message: string;
  data: Client[];
  count: number;
}

export interface ApiError {
  success: boolean;
  message: string;
}

// Types for Transcribe/Upload API
export interface UploadFileResponse {
  success?: boolean;
  message: string;
  job_id: string;
  client_id: number;
  client_name: string;
  file_type: 'audio' | 'video' | 'image';
  original_filename: string;
  status: string;
  note?: string;
}

// Types for Jobs API
export interface Job {
  [x: string]: any;
  job_id: string;
  client_id: number;
  client_name: string;
  file_type: 'audio' | 'video' | 'image';
  original_filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  created_at: string;
  completed_at?: string;
  processing_time?: string;
  source_url?: string;
}

export interface GetJobsResponse {
  success: boolean;
  message?: string;
  total: number;
  limit: number;
  offset: number;
  jobs: Job[];
}

// Client service
export class ClientService {
  // Get all clients
  static async getMyClients(): Promise<GetClientsResponse> {
    try {
      const response = await api.get('/api/clients/my-clients');
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch clients';
      throw {
        success: false,
        message: errorMessage,
      } as ApiError;
    }
  }
}

// Transcribe service
export class TranscribeService {
  // Upload file for transcription
  static async uploadFile(
    clientId: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadFileResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(
        `/api/transcribe/upload-file?client_id=${clientId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress?.(progress);
            }
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      throw {
        success: false,
        message: errorMessage,
      } as ApiError;
    }
  }

  // Get all jobs for authenticated user
  static async getJobs(params: {
    limit?: number;
    offset?: number;
    client_id: number;  // Required parameter
    status?: string;
  }): Promise<GetJobsResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('client_id', params.client_id.toString());
      queryParams.append('limit', (params.limit || 10).toString());
      queryParams.append('offset', (params.offset !== undefined ? params.offset : 0).toString());
      if (params?.status) queryParams.append('status', params.status);

      const response = await api.get(
        `/api/transcribe/jobs?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: unknown) {
      // Handle axios interceptor error format
      if (error && typeof error === 'object' && 'message' in error) {
        throw {
          success: false,
          message: (error as { message: string }).message,
        } as ApiError;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch jobs';
      throw {
        success: false,
        message: errorMessage,
      } as ApiError;
    }
  }
}

export default ClientService;
