'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Task } from '@/services/taskService';
import { ViewMode } from '@/app/inicio/gantt/page';

const ROW_HEIGHT = 50;
const DAY_WIDTH = 35;

interface TimelinePanelProps {
  tasks: Task[];
  viewMode: ViewMode;
  onTaskClick: (task: Task) => void;
}

interface HeaderItem {
    key: string;
    label: string;
    width: number;
}

// --- Componente para dibujar las flechas de dependencia ---
const DependencyArrows = ({ tasks, taskPositions, totalWidth }: { tasks: Task[], taskPositions: Map<string, any>, totalWidth: number }) => {
    if (!taskPositions || taskPositions.size === 0) return null;

    const totalHeight = tasks.length * ROW_HEIGHT;

    return (
        <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={totalWidth}
            height={totalHeight}
            style={{ zIndex: 15 }}
        >
            <defs>
                <marker
                    id="arrowhead"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-400 dark:fill-gray-500" />
                </marker>
            </defs>
            <g>
                {tasks.map(targetTask => {
                    const targetPos = taskPositions.get(targetTask._id);
                    if (!targetTask.dependencies || !targetPos) return null;

                    return targetTask.dependencies.map(sourceTaskId => {
                        const sourcePos = taskPositions.get(sourceTaskId);
                        if (!sourcePos) return null;
                        
                        const sourceX = sourcePos.type === 'Milestone'
                            ? sourcePos.x + (DAY_WIDTH / 2)
                            : sourcePos.x + sourcePos.width + 4;
                        const sourceY = sourcePos.y + ROW_HEIGHT / 2;

                        const targetX = targetPos.type === 'Milestone'
                            ? targetPos.x + (DAY_WIDTH / 2)
                            : targetPos.x;
                        const targetY = targetPos.y + ROW_HEIGHT / 2;

                        const pathD = `M ${sourceX} ${sourceY} L ${sourceX + 15} ${sourceY} L ${sourceX + 15} ${targetY} L ${targetX} ${targetY}`;
                        
                        return (
                            <path
                                key={`${sourceTaskId}-${targetTask._id}`}
                                d={pathD}
                                className="stroke-gray-400 dark:stroke-gray-500"
                                strokeWidth="2"
                                fill="none"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    });
                })}
            </g>
        </svg>
    );
};


const getDaysDiff = (date1: Date, date2: Date): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

const getWeekNumber = (d: Date): number => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export default function TimelinePanel({ tasks, viewMode, onTaskClick }: TimelinePanelProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const [todayOffset, setTodayOffset] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const scrollWidthRef = useRef(0);
    const initialScrollDone = useRef(false);

    useEffect(() => {
        let rangeStart: Date, rangeEnd: Date;
        if (!tasks || tasks.length === 0) {
            const today = new Date();
            rangeStart = new Date(today.getFullYear(), today.getMonth() - 6, 1);
            rangeEnd = new Date(today.getFullYear(), today.getMonth() + 7, 0);
        } else {
            const taskDates = tasks.map(t => new Date(t.startDate).getTime()).filter(t => !isNaN(t));
            const minDate = new Date(Math.min(...taskDates));
            const maxDate = new Date(Math.max(...tasks.map(t => new Date(t.dueDate).getTime())));
            rangeStart = new Date(minDate.getFullYear(), minDate.getMonth() - 3, 1);
            rangeEnd = new Date(maxDate.getFullYear(), maxDate.getMonth() + 4, 0);
        }
        setDateRange({ start: rangeStart, end: rangeEnd });
        initialScrollDone.current = false;
    }, [tasks]);

    const { headers, subHeaders, totalWidth } = useMemo(() => {
        if (!dateRange) return { headers: [], subHeaders: [], totalWidth: 0 };

        const primaryHeaders: HeaderItem[] = [];
        const secondaryHeaders: HeaderItem[] = [];
        let monthIterator = new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), 1);

        while(monthIterator <= dateRange.end) {
            const year = monthIterator.getFullYear();
            const month = monthIterator.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            primaryHeaders.push({
                key: `${year}-${month}`,
                label: monthIterator.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }),
                width: daysInMonth * DAY_WIDTH,
            });
            monthIterator.setMonth(monthIterator.getMonth() + 1);
        }

        if (viewMode === 'Día') {
            let dayIterator = new Date(dateRange.start);
            while(dayIterator <= dateRange.end) {
                secondaryHeaders.push({ key: dayIterator.toISOString(), label: String(dayIterator.getDate()), width: DAY_WIDTH });
                dayIterator.setDate(dayIterator.getDate() + 1);
            }
        } else if (viewMode === 'Semana') {
            let weekIterator = new Date(dateRange.start);
            const dayOfWeek = weekIterator.getDay();
            const diff = weekIterator.getDate() - dayOfWeek;
            weekIterator.setDate(diff);
            while(weekIterator <= dateRange.end) {
                const weekStart = new Date(weekIterator);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                const weekNumber = getWeekNumber(weekStart);
                const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
                const dateRangeStr = `${weekStart.toLocaleDateString('es-MX', options)} - ${weekEnd.toLocaleDateString('es-MX', options)}`;
                const label = `S${weekNumber}  ${dateRangeStr.replace(/\./g, '')}`;
                secondaryHeaders.push({ key: weekStart.toISOString(), label: label, width: DAY_WIDTH * 7 });
                weekIterator.setDate(weekIterator.getDate() + 7);
            }
        }
        
        const calculatedTotalWidth = primaryHeaders.reduce((acc, h) => acc + h.width, 0);
        return { headers: primaryHeaders, subHeaders: secondaryHeaders, totalWidth: calculatedTotalWidth };
    }, [dateRange, viewMode]);

    const taskPositions = useMemo(() => {
        if (!dateRange || tasks.length === 0) return new Map();
        
        const positions = new Map<string, { x: number; y: number; width: number; type: string }>();
        tasks.forEach((task, index) => {
            const taskStart = new Date(task.startDate);
            if (isNaN(taskStart.getTime())) return;
            
            const x = getDaysDiff(dateRange.start, taskStart) * DAY_WIDTH;
            const y = index * ROW_HEIGHT;
            let width = DAY_WIDTH;

            if (task.type !== 'Milestone') {
                 const taskEnd = new Date(task.dueDate);
                 if (!isNaN(taskEnd.getTime())) {
                    const durationInDays = getDaysDiff(taskStart, taskEnd) + 1;
                    width = durationInDays * DAY_WIDTH - 4;
                 }
            }
            positions.set(task._id, { x, y, width, type: task.type });
        });
        return positions;
    }, [tasks, dateRange]);

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
        const handleScrollToToday = () => { container.scrollTo({ left: offset - (container.offsetWidth / 2), behavior: 'smooth' }); };
        container.addEventListener('scroll', handleScroll);
        window.addEventListener('scrollToToday', handleScrollToToday);
        if (totalWidth > 0 && !initialScrollDone.current) {
            container.scrollTo({ left: offset - (container.offsetWidth / 2), behavior: 'auto' });
            initialScrollDone.current = true;
        }
        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scrollToToday', handleScrollToToday);
        };
    }, [dateRange, totalWidth, viewMode]);

    useEffect(() => {
        const container = parentRef.current;
        if (container && scrollWidthRef.current > 0 && totalWidth > scrollWidthRef.current) {
            const diff = totalWidth - scrollWidthRef.current;
            container.scrollLeft += diff;
            scrollWidthRef.current = 0;
        }
    }, [totalWidth]);

    return (
        <div className="w-full bg-white dark:bg-gray-900">
            <div ref={parentRef} className="flex-1 overflow-x-auto relative">
                <div style={{ width: `${totalWidth}px`, height: '100%' }}>
                    <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700" style={{ height: '60px' }}>
                        {viewMode === 'Mes' ? (
                             <div className="relative flex h-full">
                                {headers.map(header => (
                                    <div key={header.key} className="flex-shrink-0 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300" style={{ width: `${header.width}px` }}>
                                        {header.label.charAt(0).toUpperCase() + header.label.slice(1)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <>
                                <div className="relative flex h-[30px]">
                                    {headers.map(header => (
                                        <div key={header.key} className="flex-shrink-0 text-center border-r border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 py-1" style={{ width: `${header.width}px` }}>
                                            {header.label.charAt(0).toUpperCase() + header.label.slice(1)}
                                        </div>
                                    ))}
                                </div>
                                <div className="relative flex h-[30px]">
                                    {subHeaders.map(subHeader => (
                                        <div key={subHeader.key} className={`flex-shrink-0 text-center border-r border-gray-200 dark:border-gray-700 pt-1 ${viewMode === 'Semana' ? 'border-t border-gray-200 dark:border-gray-700' : ''}`} style={{ width: `${subHeader.width}px` }}>
                                            <div className="text-xs text-gray-800 dark:text-gray-300">{subHeader.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                         {(subHeaders.length > 0 ? subHeaders : headers).map((item, i) => {
                             const bottomHeaders = subHeaders.length > 0 ? subHeaders : headers;
                             const accumulatedWidth = bottomHeaders.slice(0, i + 1).reduce((acc, h) => acc + h.width, 0);
                             return (
                                <div key={`grid-${i}`} className="absolute top-0 bottom-0 border-r border-gray-100 dark:border-gray-800" style={{ top: '60px', left: `${accumulatedWidth}px`}}></div>
                             )
                         })}
                    </div>

                    <div className="relative z-10" style={{ height: `${tasks.length * ROW_HEIGHT}px` }}>
                        {todayOffset !== null && todayOffset >= 0 && (
                            <div className="absolute top-0 bottom-0 z-20 border-r-2 border-red-500" style={{ left: `${todayOffset}px` }}>
                                <div className="sticky top-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-b-md -ml-4">Hoy</div>
                            </div>
                        )}
                        
                        {tasks.map((task, index) => {
                            const pos = taskPositions.get(task._id);
                            if (!pos) return null;

                            const { x, y, width, type } = pos;

                            if (type === 'Milestone') {
                                const milestoneSize = 24; 
                                const milestoneLeft = x + (DAY_WIDTH / 2) - (milestoneSize / 2);
                                const milestoneTop = y + (ROW_HEIGHT - milestoneSize) / 2;
                                
                                return (
                                    <div key={task._id} onClick={() => onTaskClick(task)} className="absolute cursor-pointer group" style={{top: `${milestoneTop}px`, left: `${milestoneLeft}px`, width: `${milestoneSize}px`, height: `${milestoneSize}px`}} title={`${task.title} (Hito)`}>
                                        <div className="w-full h-full bg-orange-500 dark:bg-orange-600 transform rotate-45 rounded-sm group-hover:bg-orange-600 dark:group-hover:bg-orange-500 transition-colors shadow-md"></div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={task._id} onClick={() => onTaskClick(task)} className="absolute bg-indigo-500 rounded text-white flex items-center shadow-sm hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors cursor-pointer" style={{ top: `${y + 10}px`, left: `${x}px`, width: `${width}px`, height: '30px', minWidth: '10px' }}>
                                        <span className="px-2 text-xs font-semibold truncate">{task.title}</span>
                                    </div>
                                );
                            }
                        })}
                        <DependencyArrows tasks={tasks} taskPositions={taskPositions} totalWidth={totalWidth} />
                    </div>
                </div>
            </div>
        </div>
    );
}