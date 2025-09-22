import Project from '../models/project.js';
import Task from '../models/task.js';
import Comment from '../models/comment.js';

export const search = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'El término de búsqueda es requerido' });
    }

    try {

        // Búsqueda en paralelo para mejorar el rendimiento
        const [projects, tasks, comments] = await Promise.all([
            Project.find({
                name: { $regex: query, $options: 'i' },
            }).limit(10),
            Task.find({
                title: { $regex: query, $options: 'i' },
            }).limit(10),
            Comment.find({
                comment: { $regex: query, $options: 'i' },
            })
            .populate({
                path: 'relatedEntity',
                select: 'title projectId'
            })
            .limit(10)
        ]);

        res.json({
            projects,
            tasks,
            comments
        });
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};