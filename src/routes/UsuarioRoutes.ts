import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const usuarioRoutes = Router();

usuarioRoutes.post('/usuario/cadastrar', UsuarioController.cadastrar);
usuarioRoutes.get('/usuario/cadastrar', UsuarioController.carregarCadastrar);

export {
    usuarioRoutes
}