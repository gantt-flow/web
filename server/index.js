import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './config/db.js';
import usersRoutes from './routes/users.routes.js';
import activityLogsRoutes from './routes/activityLogs.routes.js';
import attachmentsRoutes from './routes/attachments.routes.js';
import auditLogRoutes from './routes/auditLogs.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import invitesRoutes from './routes/invites.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import remindersRoutes from './routes/reminders.routes.js';
import tasksRoutes from './routes/tasks.routes.js';


dotenv.config(); // Load environment variables from .env file
const app = express();
// Use PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;
// Middlware to parse JSON
app.use(express.json());


app.use('/users', usersRoutes);
app.use('activityLogs', activityLogsRoutes);
app.use('/attachments', attachmentsRoutes);
app.use('/auditLogs', auditLogRoutes);
app.use('/comments', commentsRoutes);
app.use('/invites', invitesRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/projects', projectsRoutes);
app.use('/reminders', remindersRoutes);
app.use('/tasks', tasksRoutes);


app.listen(PORT, () => {
    connectToDB();
    console.log(`Server started at http://localhost:${PORT}`);
})

