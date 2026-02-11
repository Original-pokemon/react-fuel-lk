import { useMemo } from 'react';
import createAPI from '#root/services/api/api';

export const useApi = () => {
  return useMemo(() => createAPI(), []);
};
