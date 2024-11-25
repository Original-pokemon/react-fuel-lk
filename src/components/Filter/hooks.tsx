import { useContext, useEffect, useRef } from 'react';
import FilterContext from './context';

const useEffectSkipMount = (callback: () => void, deps: any[]) => {
  const mounted = useRef(true);

  useEffect(() => {
    if (!mounted.current) {
      return callback();
    }

    mounted.current = false;
  }, [callback, ...deps]);
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error(
      'Filter compound components should be used only with FilterContext',
    );
  }
  return context;
};

export default useEffectSkipMount;
