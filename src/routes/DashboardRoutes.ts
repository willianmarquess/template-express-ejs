import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const dashboardRoutes = Router();

dashboardRoutes.get('/dashboard', authMiddleware, DashboardController.carregarDashboard);

export {
    dashboardRoutes
}