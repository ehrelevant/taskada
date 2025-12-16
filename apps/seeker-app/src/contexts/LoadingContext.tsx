import React, { createContext, useContext, useMemo, useState } from 'react';
import { LoadingView } from '@repo/components';

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (v: boolean) => void;
  withLoading: <T>(fn: () => Promise<T>) => (() => Promise<T>);
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo<LoadingContextType>(
    () => ({
      isLoading,
      setLoading: setIsLoading,
      withLoading: (fn) => {
        // Wraps an async function to set loading state
        return async () => {
          setIsLoading(true);
          try {
            return await fn();
          } finally {
            setIsLoading(false);
          }
        }
      },
    }),
    [isLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {isLoading ? <LoadingView /> : children}
    </LoadingContext.Provider>
  );
};

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading must be used within LoadingProvider');

  return context;
}
