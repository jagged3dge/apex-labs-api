import express from 'express';
import { LabResultService } from '../services/labResultService';
import { getDatabase } from '../db';

const router = express.Router();

router.get('/results', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const service = new LabResultService(db);

    const results = await service.getResults({
      category: req.query.category as string,
      status: req.query.status as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    });

    res.json(results);
  } catch (err) {
    next(err);
  }
});

router.get('/results/trend', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const service = new LabResultService(db);

    const results = await service.getTrend(
      req.query.testName as string,
      req.query.limit ? parseInt(req.query.limit as string) : undefined
    );

    res.json(results);
  } catch (err) {
    next(err);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const service = new LabResultService(db);

    const categories = await service.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

export default router;
