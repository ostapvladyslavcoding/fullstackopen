import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllEntries = async () => {
  const res = await axios.get<DiaryEntry[]>(baseUrl);
  return res.data;
};

export const createEntry = async (object: NewDiaryEntry) => {
  const res = await axios.post<NewDiaryEntry>(baseUrl, object);
  console.log(res);
  return res.data;
};
