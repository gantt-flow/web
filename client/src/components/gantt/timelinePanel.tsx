'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Task } from '@/services/taskService';
import { ViewMode } from '@/app/inicio/gantt/page';

const ROW_HEIGHT = 50;
const DAY_WIDTH = 35;

interface TimelinePanelProps {
  tasks: Task[];
  viewMode: ViewMode;
}

interface HeaderItem {
    key: string;
    label: string;
    width: number;
}

const getDaysDiff = (date1: Date, date2: Date): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

export default function TimelinePanel({ tasks, viewMode }: TimelinePanelProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const [todayOffset, setTodayOffset] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const scrollWidthRef = useRef(0);
    
    // --- 🚀 FIX #2: Bandera para controlar el scroll inicial ---
    const initialScrollDone = useRef(false);

    useEffect(() => {
        let rangeStart: Date, rangeEnd: Date;
        if (!tasks || tasks.length === 0) {
            const today = new Date();
            rangeStart = new Date(today.getFullYear(), today.getMonth() - 6, 1);
            rangeEnd = new Date(today.getFullYear(), today.getMonth() + 7, 0);
        } else {
            const minDate = new Date(Math.min(...tasks.map(t => new Date(t.startDate).getTime())));
            const maxDate = new Date(Math.max(...tasks.map(t => new Date(t.dueDate).getTime())));
            rangeStart = new Date(minDate.getFullYear(), minDate.getMonth() - 3, 1);
            rangeEnd = new Date(maxDate.getFullYear(), maxDate.getMonth() + 4, 0);
        }
        setDateRange({ start: rangeStart, end: rangeEnd });
        initialScrollDone.current = false; // Reiniciar la bandera cada vez que cambian las tareas
    }, [tasks]);

    const { headers, subHeaders, totalWidth } = useMemo(() => {
        if (!dateRange) return { headers: [], subHeaders: [], totalWidth: 0 };

        let currentDate = new Date(dateRange.start);
        const primaryHeaders: HeaderItem[] = [];
        const secondaryHeaders: HeaderItem[] = [];

        while (currentDate <= dateRange.end) {
            const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
            if (viewMode !== 'Mes' && !primaryHeaders.some(h => h.key === monthKey)) {
                primaryHeaders.push({ key: monthKey, label: currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }), width: 0 });
            }

            if (viewMode === 'Día') {
                secondaryHeaders.push({ key: currentDate.toISOString(), label: String(currentDate.getDate()), width: DAY_WIDTH });
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (viewMode === 'Semana') {
                const weekStart = new Date(currentDate);
                const weekEnd = new Date(currentDate);
                weekEnd.setDate(weekEnd.getDate() + 6);
                secondaryHeaders.push({ key: weekStart.toISOString(), label: `${weekStart.getDate()}-${weekEnd.getDate()}`, width: DAY_WIDTH * 7 });
                currentDate.setDate(currentDate.getDate() + 7);
            } else { // Mes
                primaryHeaders.push({ key: monthKey, label: currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }), width: DAY_WIDTH * 10 });
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }

        if (viewMode !== 'Mes') {
            primaryHeaders.forEach(header => {
                const [year, month] = header.key.split('-').map(Number);
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                header.width = daysInMonth * DAY_WIDTH;
            });
        }
        
        const calculatedTotalWidth = (viewMode === 'Mes' ? primaryHeaders : secondaryHeaders).reduce((acc, h) => acc + h.width, 0);

        return { headers: primaryHeaders, subHeaders: secondaryHeaders, totalWidth: calculatedTotalWidth };
    }, [dateRange, viewMode]);

    useEffect(() => {
        const container = parentRef.current;
        if (!container || !dateRange) return;

        const offset = getDaysDiff(dateRange.start, new Date()) * DAY_WIDTH;
        setTodayOffset(offset);

        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            const scrollThreshold = 500;

            if (scrollLeft < scrollThreshold) {
                scrollWidthRef.current = scrollWidth;
                setDateRange(prev => {
                    if (!prev) return null;
                    const newStart = new Date(prev.start);
                    newStart.setMonth(newStart.getMonth() - 3);
                    return { ...prev, start: newStart };
                });
            } else if (scrollWidth - scrollLeft - clientWidth < scrollThreshold) {
                setDateRange(prev => {
                    if (!prev) return null;
                    const newEnd = new Date(prev.end);
                    newEnd.setMonth(newEnd.getMonth() + 3);
                    return { ...prev, end: newEnd };
                });
            }
        };

        const handleScrollToToday = () => {
            container.scrollTo({ left: offset - (container.offsetWidth / 2), behavior: 'smooth' });
        };

        container.addEventListener('scroll', handleScroll);
        window.addEventListener('scrollToToday', handleScrollToToday);
        
        // --- 🚀 FIX #2: El scroll a "Hoy" solo se ejecuta una vez ---
        if (totalWidth > 0 && !initialScrollDone.current) {
            container.scrollTo({ left: offset - (container.offsetWidth / 2), behavior: 'auto' });
            initialScrollDone.current = true; // Marca que ya se hizo el scroll inicial
        }

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scrollToToday', handleScrollToToday);
        };
    }, [dateRange, totalWidth]);

    useEffect(() => {
        const container = parentRef.current;
        if (container && scrollWidthRef.current > 0 && totalWidth > scrollWidthRef.current) {
            const diff = totalWidth - scrollWidthRef.current;
            container.scrollLeft += diff;
            scrollWidthRef.current = 0;
        }
    }, [totalWidth]);

    return (
        <div className="flex flex-col h-full w-full bg-white">
            <div ref={parentRef} className="flex-1 overflow-auto relative"> {/* Añadir 'relative' aquí */}
                <div style={{ width: `${totalWidth}px`, height: '100%' }}>
                    <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200" style={{ height: subHeaders.length > 0 ? '60px' : '30px' }}>
                        {/* ... Código de la cabecera sin cambios ... */}
                        <div className="relative flex h-[30px]">
                            {headers.map(header => (
                                <div key={header.key} className="flex-shrink-0 text-center border-r font-semibold text-gray-700 py-1" style={{ width: `${header.width}px` }}>
                                    {header.label.charAt(0).toUpperCase() + header.label.slice(1)}
                                </div>
                            ))}
                        </div>
                        {subHeaders.length > 0 && (
                             <div className="relative flex h-[30px]">
                                {subHeaders.map(subHeader => (
                                    <div key={subHeader.key} className="flex-shrink-0 text-center border-r pt-1" style={{ width: `${subHeader.width}px` }}>
                                        <div className="text-sm text-gray-800">{subHeader.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* --- 🚀 FIX #1: Contenedor de la cuadrícula de altura completa --- */}
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                        {(subHeaders.length > 0 ? subHeaders : headers).map((item, i) => (
                            <div key={`grid-${i}`} className="absolute top-[60px] bottom-0 border-r border-gray-100" style={{
                                left: `${(subHeaders.length > 0 ? subHeaders : headers).slice(0, i + 1).reduce((acc, h) => acc + h.width, 0)}px`
                            }}></div>
                        ))}
                    </div>

                    {/* Contenedor de las barras de tareas (ahora por encima de la cuadrícula) */}
                    <div className="relative z-10" style={{ height: `${tasks.length * ROW_HEIGHT}px` }}>
                        {todayOffset !== null && todayOffset >= 0 && (
                            <div className="absolute top-0 bottom-0 z-20 border-r-2 border-red-500" style={{ left: `${todayOffset}px` }}>
                                <div className="sticky top-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-b-md -ml-4">Hoy</div>
                            </div>
                        )}
                        
                        {tasks.map((task, index) => {
                            if (!dateRange) return null;
                            const taskStart = new Date(task.startDate);
                            const taskEnd = new Date(task.dueDate);
                            if (isNaN(taskStart.getTime()) || isNaN(taskEnd.getTime())) return null;

                            const left = getDaysDiff(dateRange.start, taskStart) * DAY_WIDTH;
                            const duration = getDaysDiff(taskStart, taskEnd) + 1;
                            const width = duration * DAY_WIDTH - 4;

                            return (
                                <div key={task._id} className="absolute bg-indigo-500 rounded text-white flex items-center shadow-sm hover:bg-indigo-600 transition-colors" style={{ top: `${index * ROW_HEIGHT + 10}px`, left: `${left}px`, width: `${width}px`, height: '30px', }}>
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