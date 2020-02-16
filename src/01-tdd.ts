interface AsyncData<D> {
  isLoading: boolean;
  didLoad: boolean;
  data?: D;
  error?: Error;
}

const wrong: AsyncData<string> = {
  isLoading: true,
  didLoad: false,
  data: 'John Doe',
  error: new Error('Failed to fetch'),
}

type RemoteData<D> =
  | { tag: 'idle' }
  | { tag: 'loading' }
  | { tag: 'success', data: D }
  | { tag: 'failure', error: Error }

const idle: RemoteData<string> = { tag: 'idle' }
const loading: RemoteData<string> = { tag: 'loading' }
const success: RemoteData<string> = { tag: 'success', data: 'John Doe' }
const failure: RemoteData<string> = { tag: 'failure', error: new Error('Failed to fetch') }
