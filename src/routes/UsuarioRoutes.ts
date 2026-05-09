import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const usuarioRoutes = Router();

usuarioRoutes.get('/usuario/logar', UsuarioController.carregarLogin);
usuarioRoutes.post('/usuario/cadastrar', UsuarioController.cadastrar);

usuarioRoutes.post('/usuario/logar', UsuarioController.logar);
usuarioRoutes.post('/usuario/deslogar', UsuarioController.deslogar);

usuarioRoutes.get('/usuario/perfil', authMiddleware, UsuarioController.carregarPerfil);
usuarioRoutes.post('/usuario/perfil', authMiddleware, UsuarioController.atualizarPerfil);
usuarioRoutes.get('/usuario/listar', authMiddleware, UsuarioController.carregarListar);

usuarioRoutes.post('/usuario/excluir/:id', authMiddleware, UsuarioController.excluir);
usuarioRoutes.get('/usuario/editar/:id', authMiddleware, UsuarioController.carregarEditar);
usuarioRoutes.post('/usuario/editar/:id', authMiddleware, UsuarioController.editar);

export {
    usuarioRoutes
}