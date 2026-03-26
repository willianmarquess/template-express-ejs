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
    //Parte 2 -> funções do CRUD

    static async cadastrar(req: Request, res: Response) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.render('index', {
                mensagem: {
                    tipo: 'error',
                    valor: 'Preencha corretamente os dados!',
                    titulo: 'Dados inválidos'
                }
            });
        }

        const usuarioEncontrado = await Usuario.buscarPorEmail(email);

        if (usuarioEncontrado) {
            return res.render('index', {
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

        res.render('usuario/cadastrar', {
            mensagem: {
                tipo: 'success',
                valor: 'Usuário cadastrado com sucesso',
                titulo: 'Sucesso'
            }
        });
    }

    static carregarCadastrar(req: Request, res: Response) {
        res.render('usuario/cadastrar', { mensagem: null });
    }

    static async carregarListar(req: Request, res: Response) {
        const usuarios = await Usuario.buscarTodos();
        res.render('usuario/listar', { usuarios, mensagem: null });
    }
} 
