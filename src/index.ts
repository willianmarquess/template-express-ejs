import express from 'express';
import { userRoutes } from './routes/UserRoutes';
import { dashboardRoutes } from './routes/DashboardRoutes';
import session from 'express-session';
import { connection } from './infra/Connection';

const app = express();

app.set('view engine', 'ejs');

app.set('views', './src/views');

app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.render('index', { message: 'Hello' });
});

app.use(session({
    secret: 'aula-pw2', //chave usada para assinar o cookie
    resave: false, //evita salvar a sessão se nada mudou
    saveUninitialized: true, //salva as sessões não inicializadas
    cookie: { maxAge: 1 * 1000 * 60 * 60 } //uma hora de tempo de expiração
}));
app.use(userRoutes);
app.use(dashboardRoutes);

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
