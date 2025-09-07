import api from '@/services/api';
import { NewUser } from './userService';
import { NewProject } from './projectService';
import { Comment } from './commentsService';

export interface Task {
    _id: string;
    title: string;
    description: string;
    startDate: Date;
    dueDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    assignedTo: NewUser[];
    projectId: NewProject;
    dependencies?: string[];
    estimatedHours: number;
    actualHours: number;
    createdBy: NewUser;
    createdAt?: Date;
    updatedAt?: Date;
    comments: Comment[];
    attachments?: string[];
    tags: string[];
    type: string;
}