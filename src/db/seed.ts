import { getDatabase } from './index';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
  const db = await getDatabase();

  // Seed categories
  const categories = [
    {
      id: uuidv4(),
      name: 'hematology',
      description: 'Blood cell counts and related tests'
    },
    {
      id: uuidv4(),
      name: 'chemistry',
      description: 'Blood chemistry and metabolic tests'
    },
    {
      id: uuidv4(),
      name: 'immunology',
      description: 'Immune system and antibody tests'
    }
  ];

  for (const category of categories) {
    await db.run(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [category.id, category.name, category.description]
    );
  }

  // Seed tests
  const tests = [
    {
      id: uuidv4(),
      categoryId: categories[0].id,
      name: 'Hemoglobin',
      unit: 'g/dL',
      refRangeLow: 12,
      refRangeHigh: 16,
      refRangeCriticalLow: 7,
      refRangeCriticalHigh: 20
    },
    {
      id: uuidv4(),
      categoryId: categories[1].id,
      name: 'Glucose',
      unit: 'mg/dL',
      refRangeLow: 70,
      refRangeHigh: 100,
      refRangeCriticalLow: 40,
      refRangeCriticalHigh: 500
    }
  ];

  for (const test of tests) {
    await db.run(
      `INSERT INTO tests (
        id, category_id, name, unit, 
        ref_range_low, ref_range_high,
        ref_range_critical_low, ref_range_critical_high
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        test.id,
        test.categoryId,
        test.name,
        test.unit,
        test.refRangeLow,
        test.refRangeHigh,
        test.refRangeCriticalLow,
        test.refRangeCriticalHigh
      ]
    );
  }

  // Generate some sample results
  for (const test of tests) {
    for (let i = 0; i < 10; i++) {
      const value = test.name === 'Hemoglobin' 
        ? 14 + Math.random() * 4 - 2  // Random values around 14
        : 85 + Math.random() * 30 - 15; // Random values around 85

      let status = 'normal';
      if (value < test.refRangeLow) status = 'low';
      if (value > test.refRangeHigh) status = 'high';
      if (value < test.refRangeCriticalLow) status = 'critical';
      if (value > test.refRangeCriticalHigh) status = 'critical';

      const date = new Date();
      date.setDate(date.getDate() - i);

      await db.run(
        'INSERT INTO results (id, test_id, value, status, timestamp) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), test.id, value.toFixed(1), status, date.toISOString()]
      );
    }
  }

  console.log('Database seeded successfully');
}

seedDatabase().catch(console.error);
