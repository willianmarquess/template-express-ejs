import { Request, Response } from "express";

export class DashboardController {
    static carregarDashboard(req: Request, res: Response) {
        const { usuario } = req.session as any;
        res.render('pages/dashboard', 
            { 
                titulo: 'Dashboard',
                usuario 
            });
    }
}

