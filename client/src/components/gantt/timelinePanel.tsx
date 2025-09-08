// client/src/components/gantt/TimelinePanel.tsx
'use client';

import React, { useMemo, useRef } from 'react';
import { Task } from '@/services/taskService';
import { useVirtualizer } from '@tanstack/react-virtual';

const ROW_HEIGHT = 50;
const CELL_WIDTH = 50;

interface TimelinePanelProps {
  tasks: Task[];
}

// Interfaz para la estructura de la cabecera de mes
interface MonthHeader {
  key: string;
  name: string;
  width: number;
  startOffset: number; // La posición 'left' de este encabezado de mes
}

export default function TimelinePanel({ tasks }: TimelinePanelProps) {

  const { allDaysInView, monthHeaders, totalWidth } = useMemo(() => {
    // Caso 1: No hay tareas. Mostramos el año actual por defecto.
    if (tasks.length === 0) {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), 0, 1); // 1 de Enero del año actual
      const endDate = new Date(today.getFullYear(), 11, 31); // 31 de Diciembre
      // El resto de la lógica para generar días y meses funciona igual
    }

    // Caso 2: Sí hay tareas. Calculamos el rango dinámicamente.
    // 1. Encontrar el rango real de las tareas
    const minTaskDate = new Date(Math.min(...tasks.map(t => new Date(t.startDate).getTime())));
    const maxTaskDate = new Date(Math.max(...tasks.map(t => new Date(t.endDate).getTime())));

    // 2. Añadir un relleno de 3 meses antes y después
    const startDate = new Date(minTaskDate.getFullYear(), minTaskDate.getMonth() - 3, 1);
    // Para el final, vamos 4 meses adelante y tomamos el día 0 (el último día del mes anterior)
    const endDate = new Date(maxTaskDate.getFullYear(), maxTaskDate.getMonth() + 4, 0);

    // --- El resto de la lógica para generar los días y meses es la misma ---
    const days: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const monthMap = new Map<string, Date[]>();
    days.forEach(day => {
      const monthKey = `${day.getFullYear()}-${day.getMonth()}`;
      if (!monthMap.has(monthKey)) monthMap.set(monthKey, []);
      monthMap.get(monthKey)!.push(day);
    });

    const groupedHeaders: MonthHeader[] = [];
    let accumulatedWidth = 0;
    monthMap.forEach((daysInMonth, key) => {
      const firstDay = daysInMonth[0];
      const monthWidth = daysInMonth.length * CELL_WIDTH;
      groupedHeaders.push({
        key: key,
        name: firstDay.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }),
        width: monthWidth,
        startOffset: accumulatedWidth,
      });
      accumulatedWidth += monthWidth;
    });

    return {
      allDaysInView: days,
      monthHeaders: groupedHeaders,
      totalWidth: days.length * CELL_WIDTH,
    };
    // 3. ¡IMPORTANTE! Añadir `tasks` al array de dependencias.
  }, [tasks]);

  const parentRef = useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer({
    count: allDaysInView.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CELL_WIDTH,
    horizontal: true,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();

  const getDaysDiff = (date1: Date, date2: Date): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* El contenedor principal ahora tiene un overflow-x-auto */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        {/* El div hijo tiene el ancho total para habilitar el scroll */}
        <div style={{ width: `${totalWidth}px`, position: 'relative' }}>
          
          {/* --- CABECERA DE DOS NIVELES --- */}
          <div className="sticky top-0 z-10 bg-gray-50 h-[80px]">
            {/* Nivel Superior: Meses (posicionados de forma absoluta) */}
            {monthHeaders.map(month => (
              <div
                key={month.key}
                className="absolute top-0 text-center border-b border-r font-semibold text-gray-700 py-1"
                style={{
                  left: `${month.startOffset}px`,
                  width: `${month.width}px`,
                  height: '35px',
                }}
              >
                {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
              </div>
            ))}

            {/* Nivel Inferior: Días (Virtualizados y posicionados de forma absoluta) */}
            {virtualColumns.map(virtualColumn => {
              const date = allDaysInView[virtualColumn.index];
              return (
                <div
                  key={virtualColumn.key}
                  className="absolute top-[35px] flex-shrink-0 text-center border-r"
                  style={{
                    left: `${virtualColumn.start}px`,
                    width: `${virtualColumn.size}px`,
                    height: '45px',
                  }}
                >
                  <div className="text-xs text-gray-500">{date.toLocaleDateString('es-MX', { weekday: 'short' }).slice(0, 1)}</div>
                  <div className="text-lg text-gray-800">{date.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Cuadrícula de Tareas */}
          <div className="relative" style={{ height: `${tasks.length * ROW_HEIGHT}px` }}>
            {tasks.map((task, index) => {
              const taskStart = new Date(task.startDate);
              const taskEnd = new Date(task.endDate);
              const daysFromStart = getDaysDiff(allDaysInView[0], taskStart);
              const left = daysFromStart * CELL_WIDTH;
              const durationDays = getDaysDiff(taskStart, taskEnd) + 1;
              const width = durationDays * CELL_WIDTH - 5;

              return (
                <div
                  key={task._id}
                  className="absolute bg-blue-500 rounded-lg text-white flex items-center shadow-md hover:bg-blue-600 transition-colors"
                  style={{
                    top: `${index * ROW_HEIGHT + (ROW_HEIGHT - 30) / 2}px`,
                    left: `${left}px`,
                    width: `${width}px`,
                    height: '30px',
                  }}
                >
                  <span className="px-2 text-xs font-semibold truncate">{task.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}