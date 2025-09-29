import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDB } from './config/db.js';
import usersRoutes from './routes/users.routes.js';
import adminRoutes from './routes/admin.routes.js';
import activityLogsRoutes from './routes/activityLogs.routes.js';
import attachmentsRoutes from './routes/attachments.routes.js';
import auditLogRoutes from './routes/auditLogs.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import invitesRoutes from './routes/invites.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import remindersRoutes from './routes/reminders.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import authRoutes from './routes/auth.routes.js';
import mlRoutes from './routes/mlRoutes.js';
import searchRoutes from './routes/search.routes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser()); // Parsear cookies

// Habilitar CORS para un origen específico
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}))

app.use('/users', usersRoutes);
app.use('/admin', adminRoutes);
app.use('/activityLogs', activityLogsRoutes);
app.use('/attachments', attachmentsRoutes);
app.use('/auditLogs', auditLogRoutes);
app.use('/comments', commentsRoutes);
app.use('/invites', invitesRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/projects', projectsRoutes);
app.use('/reminders', remindersRoutes);
app.use('/tasks', tasksRoutes);
app.use('/auth', authRoutes);
app.use('/api/ml', mlRoutes);
app.use('/search', searchRoutes);


app.listen(PORT, () => {
    connectToDB();
    console.log(`Server started at http://localhost:${PORT}`);
})

