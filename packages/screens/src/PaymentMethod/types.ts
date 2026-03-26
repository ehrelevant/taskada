type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiFetch = (path: string, method?: RequestMethod, body?: RequestInit) => Promise<Response>;

export type SavedMethod = { id: string; type: string; icon?: React.JSX.Element; label: string };

export type NavigationLike = {
  navigate: (name: string, params?: unknown) => void;
  addListener: (event: string, cb: (...args: unknown[]) => void) => () => void;
  dispatch: (action: unknown) => void;
  goBack: () => void;
};

export type Props = {
  apiFetch: ApiFetch;
  navigation: NavigationLike;
};
