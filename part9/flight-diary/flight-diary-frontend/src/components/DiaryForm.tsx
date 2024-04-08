import { AxiosError } from 'axios';
import { useState } from 'react';
import { createEntry } from '../services/diaryService';
import { NewDiaryEntry, Visibility, Weather } from '../types';

const DiaryForm = () => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setDate('');
    setVisibility(Visibility.Great);
    setWeather(Weather.Sunny);
    setComment('');
  };

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry: NewDiaryEntry = {
        date,
        visibility,
        weather,
        comment,
      };

      await createEntry(newEntry);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data || error.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
      throw new Error('Something went wrong');
    }
  };

  return (
    <>
      <h3>Add new entry</h3>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={diaryCreation}>
        <div>
          date:
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          visibility: great
          <input
            type='radio'
            value='great'
            name='visibility'
            checked={visibility === 'great'}
            onChange={() => setVisibility(Visibility.Great)}
          />
          good
          <input
            type='radio'
            value='good'
            name='visibility'
            checked={visibility === 'good'}
            onChange={() => setVisibility(Visibility.Good)}
          />
          ok
          <input
            type='radio'
            value='ok'
            name='visibility'
            checked={visibility === 'ok'}
            onChange={() => setVisibility(Visibility.Ok)}
          />
          poor
          <input
            type='radio'
            value='poor'
            name='visibility'
            checked={visibility === 'poor'}
            onChange={() => setVisibility(Visibility.Poor)}
          />
        </div>
        <div>
          weather: sunny
          <input
            type='radio'
            value='sunny'
            name='weather'
            checked={weather === 'sunny'}
            onChange={() => setWeather(Weather.Sunny)}
          />
          rainy
          <input
            type='radio'
            value='rainy'
            name='weather'
            checked={weather === 'rainy'}
            onChange={() => setWeather(Weather.Sunny)}
          />
          cloudy
          <input
            type='radio'
            value='cloudy'
            name='weather'
            checked={weather === 'cloudy'}
            onChange={() => setWeather(Weather.Cloudy)}
          />
          stormy
          <input
            type='radio'
            value='stormy'
            name='weather'
            checked={weather === 'stormy'}
            onChange={() => setWeather(Weather.Stormy)}
          />
          windy
          <input
            type='radio'
            value='windy'
            name='weather'
            checked={weather === 'windy'}
            onChange={() => setWeather(Weather.Windy)}
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
        <button type='submit'>add</button>
      </form>
    </>
  );
};

export default DiaryForm;
