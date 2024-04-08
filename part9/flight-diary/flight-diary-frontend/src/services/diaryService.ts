import axios from 'axios';
import { DiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllEntries = async () => {
  const res = await axios.get<DiaryEntry[]>(baseUrl);
  return res.data;
};
