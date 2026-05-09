import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { asyncExecutor } from '../utils/AsyncExecutor';

const dashboardRoutes = Router();

dashboardRoutes.get('/dashboard', authMiddleware(['USUARIO', 'ADMIN']), asyncExecutor(DashboardController.carregarDashboard));

export {
    dashboardRoutes
}