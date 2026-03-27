import React, { createContext, useContext, useMemo, useState } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (v: boolean) => void;
  withLoading: <T>(fn: () => Promise<T>) => () => Promise<T>;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo<LoadingContextType>(
    () => ({
      isLoading,
      setLoading: setIsLoading,
      withLoading: fn => {
        return async () => {
          setIsLoading(true);
          try {
            return await fn();
          } finally {
            setIsLoading(false);
          }
        };
      },
    }),
    [isLoading],
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading must be used within LoadingProvider');

  return context;
}
