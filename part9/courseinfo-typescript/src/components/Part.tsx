import { PartProps } from '../types';

const Part = (props: PartProps) => {
  const { part } = props;

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (part.kind) {
    case 'basic':
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p>
            <em>{part.description}</em>
          </p>
        </div>
      );
    case 'group':
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      );
    case 'background':
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p>
            <em>{part.description}</em>
          </p>
          <p>
            <a href={part.backgroundMaterial}>background material</a>
          </p>
        </div>
      );
    case 'special':
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p>
            <em>{part.description}</em>
          </p>
          <p>required skills: {part.requirements.join(', ')}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
