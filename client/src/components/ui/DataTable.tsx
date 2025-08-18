import { FC } from 'react';

interface Column {
  key: string;
  header: string;
  width?: string;
  // Añade esta nueva propiedad
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export const DataTable: FC<DataTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''}`}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th scope="col" className="px-6 py-3 text-right">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={`${index}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {/* Verifica si existe la función render */}
                  {column.render 
                    ? column.render(item[column.key]) 
                    : item[column.key]
                  }
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item._id || item.id)}
                      className="mr-3 text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item._id || item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};