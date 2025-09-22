import api from './api';
import { Projects } from './projectService';
import { Task } from './taskService';
import { Comment } from './commentsService';

export interface SearchResult {
    projects: Projects[]; 
    tasks: Task[];
    comments: Comment[];
}

export const searchApi = {
    search: async (query: string): Promise<SearchResult> => {
        const response = await api.get<SearchResult>(`/search?query=${query}`);
        return response.data;
    }
};