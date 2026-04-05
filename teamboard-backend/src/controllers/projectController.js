import Joi from 'joi';
import {
  getProjectsByUser,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMemberRole,
  findUserByEmail,
} from '../models/projectModel.js';

const createProjectSchema = Joi.object({
  name: Joi.string().min(2).max(150).required().messages({
    'string.empty': 'Proje adı zorunludur.',
    'string.min': 'Proje adı en az 2 karakter olmalıdır.',
    'string.max': 'Proje adı en fazla 150 karakter olabilir.',
  }),
  description: Joi.string().allow('', null).optional(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).max(150).required().messages({
    'string.empty': 'Proje adı zorunludur.',
    'string.min': 'Proje adı en az 2 karakter olmalıdır.',
    'string.max': 'Proje adı en fazla 150 karakter olabilir.',
  }),
  description: Joi.string().allow('', null).optional(),
});

const addMemberSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz.',
    'string.empty': 'E-posta alanı zorunludur.',
  }),
});

export async function getProjects(req, res) {
  try {
    const projects = await getProjectsByUser(req.user.userId);
    res.json({ projects });
  } catch (error) {
    console.error('getProjects hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function getProject(req, res) {
  try {
    const { id } = req.params;

    const role = await getMemberRole(id, req.user.userId);
    if (!role) {
      return res.status(403).json({ error: 'Bu projeye erişim yetkiniz yok.' });
    }

    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: 'Proje bulunamadı.' });
    }

    res.json({ project });
  } catch (error) {
    console.error('getProject hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function createProjectHandler(req, res) {
  try {
    const { error, value } = createProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const project = await createProject(value.name, value.description, req.user.userId);

    res.status(201).json({ project });
  } catch (error) {
    console.error('createProject hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function updateProjectHandler(req, res) {
  try {
    const { id } = req.params;
    const { error, value } = updateProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const role = await getMemberRole(id, req.user.userId);
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için admin yetkisi gereklidir.' });
    }

    const project = await updateProject(id, value.name, value.description);
    if (!project) {
      return res.status(404).json({ error: 'Proje bulunamadı.' });
    }

    res.json({ project });
  } catch (error) {
    console.error('updateProject hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function deleteProjectHandler(req, res) {
  try {
    const { id } = req.params;

    const role = await getMemberRole(id, req.user.userId);
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için admin yetkisi gereklidir.' });
    }

    const result = await deleteProject(id);
    if (!result) {
      return res.status(404).json({ error: 'Proje bulunamadı.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('deleteProject hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function addMemberHandler(req, res) {
  try {
    const { id } = req.params;
    const { error, value } = addMemberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const requesterRole = await getMemberRole(id, req.user.userId);
    if (requesterRole !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için admin yetkisi gereklidir.' });
    }

    const targetUser = await findUserByEmail(value.email);
    if (!targetUser) {
      return res.status(404).json({ error: 'Bu e-posta adresine sahip bir kullanıcı bulunamadı.' });
    }

    const existingMember = await getMemberRole(id, targetUser.id);
    if (existingMember) {
      return res.status(409).json({ error: 'Kullanıcı zaten projede üye.' });
    }

    const membership = await addMember(id, targetUser.id, 'member');
    res.status(201).json({
      membership: {
        id: membership.id,
        role: membership.role,
        joinedAt: membership.joined_at,
      },
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
      },
    });
  } catch (error) {
    console.error('addMember hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function removeMemberHandler(req, res) {
  try {
    const { id, userId } = req.params;

    const requesterRole = await getMemberRole(id, req.user.userId);
    if (requesterRole !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için admin yetkisi gereklidir.' });
    }

    const result = await removeMember(id, userId);
    if (!result) {
      return res.status(404).json({ error: 'Üye bulunamadı.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('removeMember hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
