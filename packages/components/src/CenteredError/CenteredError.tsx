import { Button } from '../Button';
import { EmptyState } from '../EmptyState';

export interface CenteredErrorProps {
  message: string;
  onRetry?: () => void;
}

export function CenteredError({ message, onRetry }: CenteredErrorProps) {
  return (
    <EmptyState
      title="Error"
      message={message}
      action={onRetry ? <Button title="Try Again" variant="outline" onPress={onRetry} /> : undefined}
    />
  );
}
