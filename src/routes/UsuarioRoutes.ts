import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { asyncExecutor } from '../utils/AsyncExecutor';

const usuarioRoutes = Router();

usuarioRoutes.get('/usuario/logar', asyncExecutor(UsuarioController.carregarLogin));

usuarioRoutes.post('/usuario/logar', asyncExecutor(UsuarioController.logar));
usuarioRoutes.post('/usuario/deslogar', asyncExecutor(UsuarioController.deslogar));
usuarioRoutes.post('/usuario/cadastrar', asyncExecutor(UsuarioController.cadastrar));

usuarioRoutes.get('/usuario/perfil', authMiddleware(['USUARIO', 'ADMIN']), asyncExecutor(UsuarioController.carregarPerfil));
usuarioRoutes.post('/usuario/perfil', authMiddleware(['USUARIO', 'ADMIN']), asyncExecutor(UsuarioController.atualizarPerfil));
usuarioRoutes.get('/usuario/listar', authMiddleware(['USUARIO', 'ADMIN']), asyncExecutor(UsuarioController.carregarListar));

usuarioRoutes.post('/usuario/excluir/:id', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.excluir));
usuarioRoutes.get('/usuario/editar/:id', authMiddleware(['USUARIO', 'ADMIN']), asyncExecutor(UsuarioController.carregarEditar));
usuarioRoutes.post('/usuario/editar/:id', authMiddleware(['USUARIO', 'ADMIN']), asyncExecutor(UsuarioController.editar));

usuarioRoutes.get('/admin/usuario/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.carregarCadastrar));
usuarioRoutes.post('/admin/usuario/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.cadastrarInterno));


export {
    usuarioRoutes
}