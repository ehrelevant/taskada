import { EmptyState } from '../EmptyState';

export interface CenteredLoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

export function CenteredLoading({ message = 'Loading...', size = 'large' }: CenteredLoadingProps) {
  return <EmptyState loading loadingSize={size} loadingMessage={message} />;
}
