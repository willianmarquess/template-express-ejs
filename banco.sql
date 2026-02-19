CREATE TYPE usuario_tipo_enum  AS ENUM ('USUARIO', 'ADMIN');
CREATE TYPE item_tipo_enum  AS ENUM ('LIVRO', 'FILME', 'ANIME', 'SERIE', 'JOGO');
CREATE TYPE item_status_enum AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

CREATE TABLE usuario (
  id            SERIAL PRIMARY KEY,
  nome  varchar(60) NOT NULL,
  email         varchar(255) NOT NULL UNIQUE,
  senha      varchar(255) NOT NULL,
  tipo          usuario_tipo_enum NOT NULL DEFAULT 'USUARIO',
  criado_em    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE item (
  id             SERIAL PRIMARY KEY,
  tipo           item_tipo_enum NOT NULL,
  titulo          varchar(200) NOT NULL,
  sinopse       text,
  data_lancamento   date,
  url_capa      text,
  status         item_status_enum NOT NULL DEFAULT 'PENDENTE',
  criado_por   int NOT NULL REFERENCES usuario(id),
  aprovado_por    int REFERENCES usuario(id),
  aprovado_em    TIMESTAMP,
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categoria(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE categoria_item(
    id SERIAL PRIMARY KEY,
    item_id int NOT NULL REFERENCES item(id),
    categoria_id int NOT NULL REFERENCES categoria(id)
);

CREATE TABLE comentario (
  id          SERIAL PRIMARY KEY,
  item_id     int NOT NULL REFERENCES item(id),
  usuario_id     int NOT NULL REFERENCES usuario(id),
  texto        text NOT NULL,
  foi_deletado  boolean NOT NULL DEFAULT false,
  criado_em  TIMESTAMP NOT NULL DEFAULT NOW()
);
