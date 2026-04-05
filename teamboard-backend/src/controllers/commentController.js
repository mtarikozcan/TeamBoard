import Joi from 'joi';
import {
  getCommentsByTask,
  createComment,
  deleteComment,
  getCommentOwner,
} from '../models/commentModel.js';
import { getTaskOwner } from '../models/taskModel.js';
import { getMemberRole } from '../models/projectModel.js';

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    'string.empty': 'Yorum içeriği zorunludur.',
    'string.min': 'Yorum içeriği en az 1 karakter olmalıdır.',
  }),
});

export async function getComments(req, res) {
  try {
    const { id: taskId } = req.params;

    const taskOwner = await getTaskOwner(taskId);
    if (!taskOwner) {
      return res.status(404).json({ error: 'Görev bulunamadı.' });
    }

    const role = await getMemberRole(taskOwner.project_id, req.user.userId);
    if (!role) {
      return res.status(403).json({ error: 'Bu göreve erişim yetkiniz yok.' });
    }

    const comments = await getCommentsByTask(taskId);
    res.json({ comments });
  } catch (error) {
    console.error('getComments hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function createCommentHandler(req, res) {
  try {
    const { id: taskId } = req.params;
    const { error, value } = createCommentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const taskOwner = await getTaskOwner(taskId);
    if (!taskOwner) {
      return res.status(404).json({ error: 'Görev bulunamadı.' });
    }

    const role = await getMemberRole(taskOwner.project_id, req.user.userId);
    if (!role) {
      return res.status(403).json({ error: 'Bu göreve erişim yetkiniz yok.' });
    }

    const comment = await createComment(taskId, req.user.userId, value.content);
    res.status(201).json({ comment });
  } catch (error) {
    console.error('createComment hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function deleteCommentHandler(req, res) {
  try {
    const { id: commentId } = req.params;

    const commentOwner = await getCommentOwner(commentId);
    if (!commentOwner) {
      return res.status(404).json({ error: 'Yorum bulunamadı.' });
    }

    if (commentOwner.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Bu yorumu silme yetkiniz yok.' });
    }

    await deleteComment(commentId);
    res.status(204).send();
  } catch (error) {
    console.error('deleteComment hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
