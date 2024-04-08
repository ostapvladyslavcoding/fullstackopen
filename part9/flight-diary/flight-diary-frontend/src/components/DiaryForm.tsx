import { useState } from 'react';
import { createEntry } from '../services/diaryService';
import { NewDiaryEntry } from '../types';

const DiaryForm = () => {
  const [date, setDate] = useState('2023-02-02');
  const [visibility, setVisibility] = useState('great');
  const [weather, setWeather] = useState('sunny');
  const [comment, setComment] = useState('nice flight but a shaky landing');

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry = {
      date,
      visibility,
      weather,
      comment,
    } as NewDiaryEntry;

    createEntry(newEntry);
  };

  return (
    <form onSubmit={diaryCreation}>
      <div>
        date
        <input
          type='text'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        visibility
        <input
          type='text'
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        />
      </div>
      <div>
        weather
        <input
          type='text'
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
        />
      </div>
      <div>
        comment
        <input
          type='text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  );
};

export default DiaryForm;
