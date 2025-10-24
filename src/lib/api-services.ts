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

// Client service
export class ClientService {
  // Get all clients
  static async getMyClients(): Promise<GetClientsResponse> {
    try {
      const response = await api.get('/api/clients/my-clients');
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch clients',
      } as ApiError;
    }
  }
}

export default ClientService;
