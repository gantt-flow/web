import api from '@/services/api';

export interface InvitationRequest {
  email: string;
  projectId: string;
  role?: string;
}

export interface InvitationResponse {
  message: string;
  invite: {
    _id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
}

export const invitationService = {
  sendInvitation: async (invitationData: InvitationRequest): Promise<InvitationResponse> => {
    try {
      const response = await api.post('/invites', invitationData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al enviar la invitación');
    }
  },

  acceptInvitation: async (token: string): Promise<{ message: string; projectId: string; projectName: string }> => {
    try {
      const response = await api.post(`/invites/accept/${token}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al aceptar la invitación');
    }
  },

  getInvitation: async (token: string): Promise<any> => {
    try {
      const response = await api.get(`/invites/${token}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener la invitación');
    }
  }
};