import { TotalProps } from '../types';

const Total = (props: TotalProps) => (
  <p>
    <strong>Total number of exercises {props.totalExercises}</strong>
  </p>
);

export default Total;
