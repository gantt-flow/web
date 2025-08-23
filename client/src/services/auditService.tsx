import api from './api';

export interface AuditLog {
  _id: string;
  action: string;
  details?: string;
  relatedEntity: {
    type: string;
    id: string;
  };
  performedBy: {
    _id: string;
    name: string;
    email: string;
    role?: string;
  };
  timestamp: Date;
  ipAddress?: string;
  device?: string;
  createdAt: Date;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
  };
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getAuditLogs = async (filters: AuditLogFilters = {}): Promise<AuditLogsResponse> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<AuditLogsResponse>(`/auditLogs?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los logs de auditoría:", error);
    throw error;
  }
};
