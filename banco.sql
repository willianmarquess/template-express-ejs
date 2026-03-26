CREATE TYPE usuario_tipo_enum  AS ENUM ('USUARIO', 'ADMIN');

CREATE TABLE usuario (
  id            SERIAL PRIMARY KEY,
  nome  varchar(60) NOT NULL,
  email         varchar(255) NOT NULL UNIQUE,
  senha      varchar(255) NOT NULL,
  tipo          usuario_tipo_enum NOT NULL DEFAULT 'USUARIO',
  criado_em    TIMESTAMP NOT NULL DEFAULT NOW()
);