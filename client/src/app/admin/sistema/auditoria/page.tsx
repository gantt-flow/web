// client/src/app/admin/auditoria/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { AuditLog, getAuditLogs, AuditLogFilters} from '@/services/auditService';
export default function AuditLogPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<AuditLogFilters>({
    action: '',
    entityType: '',
    startDate: '',
    endDate: ''
  });
  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      setIsLoading(true);
      const response = await getAuditLogs({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'timestamp',
        sortOrder: 'desc'
      });
      
      setAuditLogs(response.logs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAuditLogs();
  }, [pagination.page, pagination.limit, filters]);
  // Handler para cambios de filtro
  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  // Handler para cambio de página
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  // Handler para cambio de límite de items por página
  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };
  // Columnas de la tabla mejoradas
  const auditLogColumns = [
    { 
      key: 'action', 
      header: 'Acción', 
      width: 'w-1/12',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          value === 'CREATE' ? 'bg-green-100 text-green-800' :
          value === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'performedBy', 
      header: 'Usuario', 
      width: 'w-2/12',
      render: (value: any) => value ? (
        <div>
          <div className="font-medium">{value.name}</div>
          <div className="text-sm text-gray-500">{value.email}</div>
          {value.role && (
            <div className="text-xs text-gray-400">{value.role}</div>
          )}
        </div>
      ) : (
        <span className="text-gray-400">Usuario eliminado</span>
      )
    },
    { 
      key: 'relatedEntity', 
      header: 'Entidad', 
      width: 'w-2/12',
      render: (value: any) => (
        <div>
          <div className="font-medium capitalize">{value.type}</div>
          <div className="text-sm text-gray-500">ID: {value.id.substring(0, 8)}...</div>
        </div>
      )
    },
    { 
      key: 'details', 
      header: 'Detalles', 
      width: 'w-4/12',
      render: (value: string) => (
        <div className="max-w-md truncate" title={value}>
          {value || 'Sin detalles adicionales'}
        </div>
      )
    },
    { 
      key: 'timestamp', 
      header: 'Fecha y Hora', 
      width: 'w-2/12',
      render: (value: Date) => (
        <div>
          <div className="text-sm">{new Date(value).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
  ];
  return (
      <div className="flex flex-row min-h-screen">
        <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
          {/* Header con estadísticas */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Registros de Auditoría</h1>
          </div>
          
          {/* Filtros mejorados */}
          <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-gray-200">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-black dark:text-gray-300">
              <div>
                <label className="block text-sm font-medium mb-1">Acción</label>
                <select
                  value={filters.action || ''}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-gray-100"
                >
                  <option value="">Todas las acciones</option>
                  <option value="CREATE">CREATE</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Entidad</label>
                <select
                  value={filters.entityType || ''}
                  onChange={(e) => handleFilterChange('entityType', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-gray-100"
                >
                  <option value="">Todas las entidades</option>
                  <option value="User">Usuario</option>
                  <option value="Project">Proyecto</option>
                  <option value="Task">Tarea</option>
                  <option value="Comment">Comentario</option>
                  <option value="Notification">Notificación</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-black dark:text-gray-300">Desde</label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-black dark:text-gray-300">Hasta</label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-gray-100"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-black dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Mostrar:</label>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-gray-100"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-sm">registros por página</span>
              </div>
              
              <button
                onClick={() => {
                  setFilters({
                    action: '',
                    entityType: '',
                    startDate: '',
                    endDate: ''
                  });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
          
          {/* DataTable */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <DataTable
              columns={auditLogColumns}
              data={auditLogs}
              isLoading={isLoading}
            />
          </div>
          
          {/* Paginación mejorada */}
          <div className="mt-4 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} registros
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-black dark:text-gray-300">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-black dark:text-gray-100"
              >
                ← Anterior
              </button>
              
              <div className="flex items-center space-x-1 text-black dark:text-gray-300">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded min-w-[2.5rem] transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {pagination.totalPages > 5 && (
                  <span className="px-2">...</span>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-black dark:text-gray-100"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
