import Joi from 'joi';
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskOwner,
} from '../models/taskModel.js';
import { getMemberRole } from '../models/projectModel.js';

const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Görev başlığı zorunludur.',
    'string.min': 'Görev başlığı en az 2 karakter olmalıdır.',
    'string.max': 'Görev başlığı en fazla 255 karakter olabilir.',
  }),
  description: Joi.string().allow('', null).optional(),
  assignedTo: Joi.string().uuid().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('todo', 'inprogress', 'done').optional(),
  assignedTo: Joi.string().uuid().allow(null).optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
});

export async function getTasks(req, res) {
  try {
    const { projectId } = req.params;

    const role = await getMemberRole(projectId, req.user.userId);
    if (!role) {
      return res.status(403).json({ error: 'Bu projeye erişim yetkiniz yok.' });
    }

    const tasks = await getTasksByProject(projectId);
    res.json({ tasks });
  } catch (error) {
    console.error('getTasks hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function getTask(req, res) {
  try {
    const { id } = req.params;

    const taskOwner = await getTaskOwner(id);
    if (!taskOwner) {
      return res.status(404).json({ error: 'Görev bulunamadı.' });
    }

    const role = await getMemberRole(taskOwner.project_id, req.user.userId);
    if (!role) {
      return res.status(403).json({ error: 'Bu göreve erişim yetkiniz yok.' });
    }

    const task = await getTaskById(id);
    res.json({ task });
  } catch (error) {
    console.error('getTask hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function createTaskHandler(req, res) {
  try {
    const { projectId } = req.params;
    const { error, value } = createTaskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const role = await getMemberRole(projectId, req.user.userId);
    if (!role) {
      return res.status(403).json({ error: 'Bu projeye erişim yetkiniz yok.' });
    }

    const task = await createTask(projectId, req.user.userId, {
      title: value.title,
      description: value.description,
      assignedTo: value.assignedTo,
      priority: value.priority,
      dueDate: value.dueDate,
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('createTask hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function updateTaskHandler(req, res) {
  try {
    const { id } = req.params;
    const { error, value } = updateTaskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const taskOwner = await getTaskOwner(id);
    if (!taskOwner) {
      return res.status(404).json({ error: 'Görev bulunamadı.' });
    }

    const role = await getMemberRole(taskOwner.project_id, req.user.userId);
    if (!role) {
      return res.status(403).json({ error: 'Bu göreve erişim yetkiniz yok.' });
    }

    const task = await updateTask(id, {
      title: value.title,
      description: value.description,
      status: value.status,
      assigned_to: value.assignedTo,
      priority: value.priority,
      due_date: value.dueDate,
    });

    res.json({ task });
  } catch (error) {
    console.error('updateTask hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function deleteTaskHandler(req, res) {
  try {
    const { id } = req.params;

    const taskOwner = await getTaskOwner(id);
    if (!taskOwner) {
      return res.status(404).json({ error: 'Görev bulunamadı.' });
    }

    const role = await getMemberRole(taskOwner.project_id, req.user.userId);
    const isOwner = taskOwner.created_by === req.user.userId;

    if (!isOwner && role !== 'admin') {
      return res.status(403).json({ error: 'Bu görevi silme yetkiniz yok.' });
    }

    await deleteTask(id);
    res.status(204).send();
  } catch (error) {
    console.error('deleteTask hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
