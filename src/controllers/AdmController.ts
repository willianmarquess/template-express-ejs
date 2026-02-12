import { Request, Response } from "express";

export class AdmController {
    static carregarAdm(req: Request, res: Response) {
        const { usuario } = req.session as any;
        res.render('pages/dashboard', 
            { 
                titulo: 'Dashboard',
                usuario 
            });
    }
}

