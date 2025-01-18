import express from 'express';
import cors from 'cors';
import db from './db';
import { CoffeeBean } from '../components/CoffeeCard';

const app = express();
app.use(cors());
app.use(express.json());

type DBCoffeeBean = Omit<CoffeeBean, 'notes' | 'orderAgain'> & {
  notes: string;
  orderAgain: number;
};

// Get all coffee beans
app.get('/api/coffee-beans', (req, res) => {
  const beans = db.prepare('SELECT * FROM coffee_beans').all() as DBCoffeeBean[];
  res.json(beans.map(bean => ({
    ...bean,
    notes: JSON.parse(bean.notes),
    orderAgain: Boolean(bean.orderAgain)
  })));
});

// Add a new coffee bean
app.post('/api/coffee-beans', (req, res) => {
  const bean = req.body as CoffeeBean;
  try {
    const stmt = db.prepare(`
      INSERT INTO coffee_beans (
        id, roaster, name, origin, roastLevel, notes,
        rank, gramsIn, mlOut, brewTime, temperature,
        price, weight, orderAgain, grindSize
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
    
    stmt.run(
      bean.id,
      bean.roaster,
      bean.name,
      bean.origin,
      bean.roastLevel,
      JSON.stringify(bean.notes),
      bean.rank,
      bean.gramsIn,
      bean.mlOut,
      bean.brewTime,
      bean.temperature,
      bean.price,
      bean.weight,
      bean.orderAgain ? 1 : 0,
      bean.grindSize
    );
    
    res.status(201).json(bean);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});