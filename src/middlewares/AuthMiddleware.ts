export function authMiddleware(req: any, res: any, next: any) {
    if(req.session?.usuario) { // se o usuário estiver logado
        return next(); //continua a request
    }

    return res.redirect('/usuario/logar'); //senão volta pro login
}