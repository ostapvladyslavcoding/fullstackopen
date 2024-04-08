import { useEffect, useState } from 'react';
import { getAllEntries } from '../services/diaryService.ts';
import { DiaryEntry } from '../types';

const DiaryEntries = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllEntries();
      setDiaryEntries(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <h3>Diary entries</h3>
      {diaryEntries.map((entry) => (
        <div key={entry.id}>
          <p>
            <strong>{entry.date}</strong>
          </p>
          <div>visibility: {entry.visibility}</div>
          <div>weather: {entry.weather}</div>
        </div>
      ))}
    </>
  );
};

export default DiaryEntries;
