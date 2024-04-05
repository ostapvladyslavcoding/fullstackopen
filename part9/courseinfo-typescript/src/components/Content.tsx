import { ContentProps } from '../types';
import Part from './Part';

const Content = (props: ContentProps) => {
  const { courseParts } = props;
  return (
    <div>
      {courseParts.map((part) => (
        <Part
          key={part.name}
          part={part}
        />
      ))}
    </div>
  );
};

export default Content;
