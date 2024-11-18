import { Database } from 'sqlite';
import { LabResult, TestCategory } from '../types';

export class LabResultService {
  constructor(private db: Database) {}

  async getResults(params: {
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<LabResult[]> {
    let query = `
      SELECT 
        r.id,
        t.name as testName,
        c.name as category,
        r.value,
        t.unit,
        t.ref_range_low as low,
        t.ref_range_high as high,
        t.ref_range_critical_low as criticalLow,
        t.ref_range_critical_high as criticalHigh,
        r.status,
        r.timestamp
      FROM results r
      JOIN tests t ON r.test_id = t.id
      JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;

    if (params.category) {
      query += ' AND c.name = ?';
    }

    if (params.status) {
      query += ' AND r.status = ?';
    }

    if (params.startDate) {
      query += ' AND r.timestamp >= ?';
    }

    if (params.endDate) {
      query += ' AND r.timestamp <= ?';
    }

    query += ' ORDER BY r.timestamp DESC';

    const results = await this.db.all(query, params);
    return results.map((result) => ({
      id: result.id,
      testName: result.testName,
      category: result.category,
      value: result.value,
      unit: result.unit,
      referenceRange: {
        low: result.low,
        high: result.high,
        criticalLow: result.criticalLow,
        criticalHigh: result.criticalHigh,
      },
      timestamp: result.timestamp,
      status: result.status,
    }));
  }

  async getTrend(testName: string, limit: number = 10): Promise<LabResult[]> {
    const query = `
      SELECT 
        r.id,
        t.name as testName,
        c.name as category,
        r.value,
        t.unit,
        t.ref_range_low as low,
        t.ref_range_high as high,
        t.ref_range_critical_low as criticalLow,
        t.ref_range_critical_high as criticalHigh,
        r.status,
        r.timestamp
      FROM results r
      JOIN tests t ON r.test_id = t.id
      JOIN categories c ON t.category_id = c.id
      WHERE t.name = ?
      ORDER BY r.timestamp DESC
      LIMIT ?
    `;

    const results = await this.db.all(query, [testName, limit]);
    return results.map((result) => ({
      id: result.id,
      testName: result.testName,
      category: result.category,
      value: result.value,
      unit: result.unit,
      referenceRange: {
        low: result.low,
        high: result.high,
        criticalLow: result.criticalLow,
        criticalHigh: result.criticalHigh,
      },
      timestamp: result.timestamp,
      status: result.status,
    }));
  }

  async getCategories(): Promise<TestCategory[]> {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        json_group_array(t.name) as tests
      FROM categories c
      JOIN tests t ON t.category_id = c.id
      GROUP BY c.id
    `;

    const results = await this.db.all(query);
    return results.map((result) => ({
      id: result.id,
      name: result.name,
      description: result.description,
      tests: JSON.parse(result.tests),
    }));
  }
}
