import express from 'express';
import { usuarioRoutes } from './routes/UsuarioRoutes';
import { connection } from './infra/Connection';

const app = express();

app.set('view engine', 'ejs');

app.set('views', './src/views');

app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.render('index', { message: 'Hello' });
});

app.use(usuarioRoutes);

connection.connect()
    .then(() => { 
        console.log('Conectado ao banco de dados com sucesso!')
        app.listen(3333, () => {
            console.log('Servidor rodando no endereço http://localhost:3333');
        });
    })
    .catch((err) => { 
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1); // Encerra o processo com um código de erro
    });
