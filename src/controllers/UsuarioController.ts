import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { TipoUsuario } from "../models/TipoUsuario";
import { TipoUsuarioEnum } from "../enums/TipoUsuario";


export class UsuarioController {

    static carregarLogin(req: Request, res: Response) {
        res.render('login', {
            mensagem: null
        });
    }

    static async carregarListar(req: Request, res: Response) {
        const { usuario } = req.session as any;

        const usuarios = await Usuario.buscarTodos();

        res.render('pages/usuario/listar', {
            usuario,
            usuarios,
            titulo: 'Listar Usuários',
            mensagem: null
        });
    }

    static async cadastrar(req: Request, res: Response) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.render('login', {
                mensagem: {
                    tipo: 'error',
                    valor: 'Preencha corretamente os dados!',
                    titulo: 'Dados inválidos'
                }
            });
        }

        const usuarioEncontrado = await Usuario.buscarPorEmail(email);

        if (usuarioEncontrado) {
            return res.render('login', {
                mensagem: {
                    tipo: 'error',
                    valor: 'E-mail já existe',
                    titulo: 'Dados inválidos'
                }
            });
        }

        const tipoPadrao = await TipoUsuario.buscarPorNome(TipoUsuarioEnum.USUARIO);
        if (!tipoPadrao) {
            return res.render('login', {
                mensagem: {
                    tipo: 'error',
                    valor: 'Tipo de usuário padrão não encontrado',
                    titulo: 'Erro do sistema'
                }
            });
        }

        const usuario: Usuario = new Usuario({
            nome,
            email,
            senha,
            tipo: tipoPadrao
        });

        await Usuario.cadastrar(usuario);

        res.render('login', {
            mensagem: {
                tipo: 'success',
                valor: 'Usuário cadastrado com sucesso',
                titulo: 'Sucesso'
            }
        });
    }

    static async logar(req: Request, res: Response) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.render('login', {
                mensagem: {
                    tipo: 'error',
                    valor: 'Preencha todos os campos corretamente',
                    titulo: 'Dados inválidos'
                }
            });
        }

        const usuario = await Usuario.buscarPorEmailESenha(email, senha);

        if (!usuario) {
            return res.render('login', {
                mensagem: {
                    tipo: 'error',
                    valor: 'E-mail ou senha incorretos',
                    titulo: 'Dados inválidos'
                }
            });
        }

        (req.session as any).usuario = {
            nome: usuario.nome,
            email: usuario.email,
            id: usuario.id,
            tipo: usuario.tipo.nome
        }

        return res.redirect('/dashboard');
    }

    static async deslogar(req: Request, res: Response) {
        req.session.destroy(() => {
            res.redirect('/usuario/logar');
        });
    }

    static carregarUsuarios(req: Request, res: Response) {
        const { usuario } = req.session as any;
        res.render('usuarios', { usuario });
    }

    static async carregarPerfil(req: Request, res: Response) {
        const { usuario } = req.session as any;

        const usuarioEncontrado = await Usuario.buscarPorId(usuario.id);

        if (!usuarioEncontrado) {
            return res.redirect('/usuario/logar');
        }

        res.render('pages/usuario/perfil', {
            usuario,
            usuarioPerfil: usuarioEncontrado,
            titulo: 'Perfil',
            mensagem: null
        });
    }

    static async atualizarPerfil(req: Request, res: Response) {
        const { usuario } = req.session as any;
        const { nome, email, senha } = req.body;

        const usuarioEncontrado = await Usuario.buscarPorId(usuario.id);

        if (!usuarioEncontrado) {
            return res.redirect('/usuario/logar');
        }

        if (!nome || !email || !senha) {
            return res.render('pages/usuario/perfil', {
                usuario: usuarioEncontrado,
                titulo: 'Perfil',
                mensagem: {
                    tipo: 'error',
                    valor: 'Preencha todos os campos corretamente',
                    titulo: 'Dados inválidos'
                }
            });
        }

        usuarioEncontrado.nome = nome;
        usuarioEncontrado.email = email;
        usuarioEncontrado.senha = senha;

        await Usuario.atualizar(usuarioEncontrado);

        (req.session as any).usuario = {
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email,
            id: usuarioEncontrado.id,
            tipo: usuarioEncontrado.tipo.nome
        }

        return res.render('pages/usuario/perfil', {
            usuario: usuarioEncontrado,
            titulo: 'Perfil',
            mensagem: {
                tipo: 'success',
                valor: 'Perfil atualizado com sucesso!',
                titulo: 'Sucesso'
            }
        });
    }

    static async excluir(req: Request, res: Response) {
        const { id } = req.params;
        await Usuario.deletarPorId(id);
        res.redirect('../listar');
    }

    static async carregarEditar(req: Request, res: Response) {
        const { id } = req.params;
        const { usuario } = req.session as any;

        const usuarioEncontrado = await Usuario.buscarPorId(id);

        if(!usuarioEncontrado) {
            throw new Error('Usuário não encontrado');
        }

        return res.render('pages/usuario/editar', {
            titulo: 'Editar Usuário',
            mensagem: null,
            usuarioParaEditar: usuarioEncontrado,
            usuario
        });
    }

    static async carregarCadastrar(req: Request, res: Response) {
        const { usuario } = req.session as any;

        return res.render('pages/usuario/cadastrar', {
            titulo: 'Cadastrar Usuário',
            mensagem: null,
            usuario
        });
    }

    static async cadastrarInterno(req: Request, res: Response) {
        const { nome, email, senha, tipo } = req.body;
        const { usuario } = req.session as any;

        if (!nome || !email || !senha || !tipo) {
            return res.render('pages/usuario/cadastrar', {
                titulo: 'Cadastrar Usuário',
                mensagem: {
                    tipo: 'error',
                    valor: 'Preencha todos os campos corretamente',
                    titulo: 'Dados inválidos'
                },
                usuario
            });
        }

        const usuarioEncontrado = await Usuario.buscarPorEmail(email);

        if (usuarioEncontrado) {
            return res.render('pages/usuario/cadastrar', {
                titulo: 'Cadastrar Usuário',
                mensagem: {
                    tipo: 'error',
                    valor: 'E-mail já existe',
                    titulo: 'Dados inválidos'
                },
                usuario
            });
        }

        const tipoSelecionado = await TipoUsuario.buscarPorNome(tipo);
        if (!tipoSelecionado) {
            return res.render('pages/usuario/cadastrar', {
                titulo: 'Cadastrar Usuário',
                mensagem: {
                    tipo: 'error',
                    valor: 'Tipo de usuário inválido',
                    titulo: 'Erro'
                },
                usuario
            });
        }

        const novoUsuario: Usuario = new Usuario({
            nome,
            email,
            senha,
            tipo: tipoSelecionado
        });

        await Usuario.cadastrar(novoUsuario);

        return res.render('pages/usuario/cadastrar', {
            titulo: 'Cadastrar Usuário',
            mensagem: {
                tipo: 'success',
                valor: 'Usuário cadastrado com sucesso!',
                titulo: 'Sucesso'
            },
            usuario
        });
    }

    static async editar(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, email, tipo } = req.body;
        const { usuario } = req.session as any;

        const usuarioEncontrado = await Usuario.buscarPorId(id);

        if(!usuarioEncontrado) {
            throw new Error('Usuário não encontrado');
        }

        const tipoSelecionado = await TipoUsuario.buscarPorNome(tipo);
        if (!tipoSelecionado) {
            return res.render('pages/usuario/editar', {
                titulo: 'Editar Usuário',
                mensagem: {
                    tipo: 'error',
                    valor: 'Tipo de usuário inválido',
                    titulo: 'Erro'
                },
                usuarioParaEditar: usuarioEncontrado,
                usuario
            });
        }

        usuarioEncontrado.nome = nome;
        usuarioEncontrado.email = email;
        usuarioEncontrado.tipo = tipoSelecionado;

        await Usuario.atualizar(usuarioEncontrado);

        return res.render('pages/usuario/editar', {
            titulo: 'Editar Usuário',
            mensagem: {
                tipo: 'success',
                valor: 'Dados salvos com sucesso!',
                titulo: 'Dados do usuário'
            },
            usuarioParaEditar: usuarioEncontrado,
            usuario
        });
    }
} 
