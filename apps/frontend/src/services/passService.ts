import apiClient from './api';
import type {
  PassData,
  PassTemplate,
  CreatePassRequest,
  CreatePassResponse,
  ApiResponse,
} from '@wallet-pass/shared';

export const passApi = {
  // Create a new pass
  createPass: async (request: CreatePassRequest): Promise<CreatePassResponse> => {
    const response = await apiClient.post<CreatePassResponse>('/passes', request);
    return response.data;
  },

  // Get pass by serial number
  getPass: async (serialNumber: string): Promise<ApiResponse<PassData>> => {
    const response = await apiClient.get<ApiResponse<PassData>>(`/passes/${serialNumber}`);
    return response.data;
  },

  // List all passes
  listPasses: async (page = 1, limit = 10): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>('/passes', {
      params: { page, limit },
    });
    return response.data;
  },

  // Download pass
  downloadPass: async (serialNumber: string): Promise<Blob> => {
    const response = await apiClient.get(`/passes/download/${serialNumber}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete pass
  deletePass: async (serialNumber: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/passes/${serialNumber}`);
    return response.data;
  },
};

export const templateApi = {
  // List all templates
  listTemplates: async (isPublic?: boolean): Promise<ApiResponse<PassTemplate[]>> => {
    const response = await apiClient.get<ApiResponse<PassTemplate[]>>('/templates', {
      params: isPublic !== undefined ? { isPublic } : {},
    });
    return response.data;
  },

  // Get template by ID
  getTemplate: async (id: string): Promise<ApiResponse<PassTemplate>> => {
    const response = await apiClient.get<ApiResponse<PassTemplate>>(`/templates/${id}`);
    return response.data;
  },

  // Create new template
  createTemplate: async (template: Partial<PassTemplate>): Promise<ApiResponse<PassTemplate>> => {
    const response = await apiClient.post<ApiResponse<PassTemplate>>('/templates', template);
    return response.data;
  },
};
