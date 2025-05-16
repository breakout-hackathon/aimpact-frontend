import libky, { HTTPError } from 'ky';
import { ResultAsync } from 'neverthrow';
export const ky = libky.extend({
  throwHttpErrors: false,
  retry: 0,
  prefixUrl: import.meta.env.PUBLIC_BACKEND_URL,
});

export const wrapKy = <T>(query: Promise<T>) => {
  return ResultAsync.fromPromise(query, (error) => error as HTTPError);
};
