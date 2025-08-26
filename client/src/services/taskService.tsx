import api from '@/services/api';
import { User } from './userService';
import { Projects } from './projectService';

export interface Task {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    endDate: string;
    status: string;
    priority: string;
    assignedTo: User[];
    projectId: Projects;
    dependencies: string[];
    estimatedHours: number;
    actualHours: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    comments: string[];
    attachments: string[];
    tags: string[];
}