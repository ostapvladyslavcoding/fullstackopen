interface ArgumentValues {
  target: number;
  dailyExerciseHours: number[];
}
const parseArguments = (args: string[]): ArgumentValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error('Provided target value is not a number');
  }

  const dailyExerciseHours = args.slice(3).map((hours) => {
    const parsedHours = Number(hours);
    if (isNaN(parsedHours)) {
      throw new Error('Provided hours value is not a number');
    }
    return parsedHours;
  });

  return {
    target,
    dailyExerciseHours,
  };
};

interface ExerciseValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}
const calculateExercises = (
  target: number,
  dailyExerciseHours: number[]
): ExerciseValues => {
  const periodLength = dailyExerciseHours.length;
  const trainingDays = dailyExerciseHours.filter((hours) => hours > 0).length;
  const average = dailyExerciseHours.reduce((a, b) => a + b) / periodLength;
  const targetReached = average >= target;
  let rating;
  let ratingDescription;
  if (average > target) {
    rating = 4;
    ratingDescription = 'Excellent job!';
  } else if (average === target) {
    rating = 3;
    ratingDescription = 'Good job!';
  } else if (target - average < 1) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'You need to work harder';
  }

  return {
    periodLength,
    trainingDays,
    success: targetReached,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { target, dailyExerciseHours } = parseArguments(process.argv);
  console.log(calculateExercises(target, dailyExerciseHours));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;
