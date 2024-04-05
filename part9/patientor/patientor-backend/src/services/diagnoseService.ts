import diagnoseEntries from '../../data/diagnoses';
import { DiagnoseEntry } from '../types';

const diagnoses: DiagnoseEntry[] = diagnoseEntries;

const getAll = (): DiagnoseEntry[] => {
  return diagnoses;
};

export default {
  getAll,
};
