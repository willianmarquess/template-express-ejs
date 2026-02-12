import { Router } from 'express';
import { AdmController } from '../controllers/AdmController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { UsuarioController } from '../controllers/UsuarioController';

const admRoutes = Router();

admRoutes.get('/adm', authMiddleware, AdmController.carregarAdm);
admRoutes.get('/adm/usuarios', authMiddleware, UsuarioController.carregarUsuarios);

export {
    admRoutes
}