import { useEffect } from 'react';
import { ApiError } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void;
  redirectOnUnauthorized?: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const router = useRouter();

  const handleError = (error: unknown) => {
    console.error('Error handled:', error);

    if (error instanceof ApiError) {
      // Gestion spécifique des erreurs API
      if (error.isUnauthorized() && options.redirectOnUnauthorized !== false) {
        console.warn('Unauthorized, redirecting to login...');
        router.push('/login');
        return;
      }

      if (error.isForbidden()) {
        console.warn('Forbidden access');
        // Vous pouvez afficher un toast ici
      }

      if (error.isNotFound()) {
        console.warn('Resource not found:', error.endpoint);
      }

      if (error.isServerError()) {
        console.error('Server error:', error.message);
        // Vous pouvez afficher un toast ici
      }
    }

    // Appel du handler personnalisé si fourni
    if (options.onError && error instanceof Error) {
      options.onError(error);
    }
  };

  return { handleError };
}

/**
 * Hook pour envelopper les appels async et gérer automatiquement les erreurs
 */
export function useSafeAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  options: UseErrorHandlerOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T> | undefined> {
  const { handleError } = useErrorHandler(options);

  return async (...args: Parameters<T>) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleError(error);
      return undefined;
    }
  };
}
