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
  dailyExerciseHours: number[],
  target: number
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
