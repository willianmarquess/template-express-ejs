import { TipoUsuario } from "../enums/TipoUsuario";
import { connection } from "../infra/Connection";

export class Usuario {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
    criadoEm?: string;

    constructor({ id, nome, email, senha, tipo, criadoEm }: { id?: number, nome: string, email: string, senha: string, tipo: TipoUsuario, criadoEm?: string }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
        this.criadoEm = criadoEm;
    }
    /*
    CRUD -> 
            C -> CREATE (inserir)
            R -> READ (leitura)
            U -> UPDATE (atualizar)
            D -> DELETE (apagar/deletar/excluir)
    */

    //Função que insere um usuario na tabela usuario
    static async cadastrar(usuario: Usuario) {
        //Dentro do .query() colocamos o código SQL
        //Se o código SQL precisar de dados
        //Esses dados são passados usando $1, $2 ...
        //os valores do $1, $2 etc são trocados pelos valores
        //que são passados no segundo parametro do .query()
        //ex: query('$1, $2, $3', ['valor1', 'valor2', 'valor3'])
        await connection.query('INSERT INTO usuario(nome, email, senha, tipo) VALUES ($1, $2, $3, $4);',
            [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.tipo
            ]
        );
    }

    //Função que recupera todos os usuario do banco
    static async buscarTodos() {
        const { rows } = await connection.query('SELECT * FROM usuario;');
        return rows.map((row) => new Usuario({
            id: row.id,
            nome: row.nome,
            email: row.email,
            senha: row.senha,
            tipo: row.tipo,
            criadoEm: row.criado_em
        }));
    }

    //Função que atualiza os dados de um usuário pelo seu id
    static async atualizar(usuario: Usuario) {
        await connection.query('UPDATE usuario SET nome=$1, email=$2, senha=$3, tipo=$4 WHERE id=$5;',
            [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.tipo,
                usuario.id
            ]
        );
    }

    //apaga um usuário no banco pelo seu ID
    static async deletarPorId(id: string) {
        await connection.query('DELETE FROM usuario WHERE id=$1', [id]);
    }

    //busca um usuário no banco pelo seu ID
    static async buscarPorId(id: string) {
        const { rows } = await connection.query(
            'SELECT * FROM usuario WHERE id=$1',
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Usuario({
            id: rows[0].id,
            nome: rows[0].nome,
            email: rows[0].email,
            senha: rows[0].senha,
            tipo: rows[0].tipo,
            criadoEm: rows[0].criado_em
        });
    }

    static async buscarPorEmail(email: string) {
        const { rows } = await connection.query(
            'SELECT * FROM usuario WHERE email=$1',
            [email]
        );
        if (!rows[0]) {
            return null;
        }

        return new Usuario({
            id: rows[0].id,
            nome: rows[0].nome,
            email: rows[0].email,
            senha: rows[0].senha,
            tipo: rows[0].tipo,
            criadoEm: rows[0].criado_em
        });
    }

    static async buscarPorEmailESenha(email: string, senha: string) {
        const { rows } = await connection.query(
            'SELECT * FROM usuario WHERE email=$1 AND senha=$2',
            [email, senha]
        );
        if (!rows[0]) {
            return null;
        }

        return new Usuario({
            id: rows[0].id,
            nome: rows[0].nome,
            email: rows[0].email,
            senha: rows[0].senha,
            tipo: rows[0].tipo,
            criadoEm: rows[0].criado_em
        });
    }
}
