import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const userRoutes = Router();

userRoutes.get('/usuario/logar', UsuarioController.carregarLogin);
userRoutes.get('/usuario/listar', UsuarioController.carregarListar);
userRoutes.post('/usuario/cadastrar', UsuarioController.cadastrar);

userRoutes.post('/usuario/logar', UsuarioController.logar);
userRoutes.post('/usuario/deslogar', UsuarioController.deslogar);

export {
    userRoutes
}