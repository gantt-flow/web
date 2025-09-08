import api from '@/services/api';
import { NewUser } from './userService';
import { Task } from './taskService';

export interface Comment {
    userId?: NewUser;
    comment: string;
    relatedEntity?: Task;   
}