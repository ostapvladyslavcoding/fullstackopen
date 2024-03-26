import express from 'express';
import calculateBmi from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(height, weight);
  return res.json({ height, weight, bmi });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    return res.json({ error: 'parameters missing' });
  }

  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    return res.json({ error: 'malformatted parameters' });
  }

  const isValid = daily_exercises.every(
    (hours: number) => !isNaN(Number(hours))
  );
  if (!isValid) {
    return res.json({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(
    target as number,
    daily_exercises as number[]
  );

  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
