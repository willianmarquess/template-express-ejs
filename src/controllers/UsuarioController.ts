// Controle
// 1. receber as requições HTTP
// 2. validar dados
// 3. validar regras de negócio
// 4. comunicar com a camada MODEL

import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { TipoUsuario } from "../enums/TipoUsuario";

//Parte 1 -> funções que carregam páginas

//função que carrega a página de login

export class UsuarioController {

    static carregarLogin(req: Request, res: Response) {
        res.render('login', {
            mensagem: null
        });
    }
    //função que carrega a página de listagem de usuários
    static carregarListar(req: Request, res: Response) {
        res.render('listar_usuario');
    }

    //Parte 2 -> funções do CRUD

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

        const usuario: Usuario = new Usuario({
            nome,
            email,
            senha,
            tipo: TipoUsuario.USUARIO
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
            id: usuario.id
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
} 
