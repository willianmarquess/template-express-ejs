import { connection } from "../infra/Connection";
import { TipoUsuario } from "./TipoUsuario";

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

    static async cadastrar(usuario: Usuario) {
        await connection.query('INSERT INTO usuario(nome, email, senha, tipo) VALUES ($1, $2, $3, $4);',
            [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.tipo.id
            ]
        );
    }

    static async buscarTodos() {
        const { rows } = await connection.query(`
            select 
            u.id as id_usuario, u.nome as nome_usuario, u.email, u.senha, u.criado_em,
            t.id as id_tipo, t.nome as nome_tipo, t.descricao
            from usuario u inner join tipo_usuario t
            on u.tipo = t.id;
            `);
        return rows.map((row) => new Usuario({
            id: row.id_usuario,
            nome: row.nome_usuario,
            email: row.email,
            senha: row.senha,
            tipo: new TipoUsuario(row.id_tipo, row.nome_tipo, row.descricao),
            criadoEm: row.criado_em
        }));
    }

    static async atualizar(usuario: Usuario) {
        await connection.query('UPDATE usuario SET nome=$1, email=$2, senha=$3, tipo=$4 WHERE id=$5;',
            [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.tipo.id,
                usuario.id
            ]
        );
    }

    static async deletarPorId(id: string) {
        await connection.query('DELETE FROM usuario WHERE id=$1', [id]);
    }

    static async buscarPorId(id: string) {
        const { rows } = await connection.query(
            `SELECT u.id, u.nome, u.email, u.senha, u.criado_em,
                    t.id as id_tipo, t.nome as nome_tipo, t.descricao
             FROM usuario u
             JOIN tipo_usuario t ON u.tipo = t.id
             WHERE u.id=$1`,
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
            tipo: new TipoUsuario(rows[0].id_tipo, rows[0].nome_tipo, rows[0].descricao),
            criadoEm: rows[0].criado_em
        });
    }

    static async buscarPorEmail(email: string) {
        const { rows } = await connection.query(
            `SELECT u.id, u.nome, u.email, u.senha, u.criado_em,
                    t.id as id_tipo, t.nome as nome_tipo, t.descricao
             FROM usuario u
             JOIN tipo_usuario t ON u.tipo = t.id
             WHERE u.email=$1`,
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
            tipo: new TipoUsuario(rows[0].id_tipo, rows[0].nome_tipo, rows[0].descricao),
            criadoEm: rows[0].criado_em
        });
    }

    static async buscarPorEmailESenha(email: string, senha: string) {
        const { rows } = await connection.query(
            `SELECT u.id, u.nome, u.email, u.senha, u.criado_em,
                    t.id as id_tipo, t.nome as nome_tipo, t.descricao
             FROM usuario u
             JOIN tipo_usuario t ON u.tipo = t.id
             WHERE u.email=$1 AND u.senha=$2`,
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
            tipo: new TipoUsuario(rows[0].id_tipo, rows[0].nome_tipo, rows[0].descricao),
            criadoEm: rows[0].criado_em
        });
    }
}
