import libky, { HTTPError } from 'ky';
import { ResultAsync } from 'neverthrow';
export const ky = libky.extend({
  throwHttpErrors: false,
  retry: 0,
  prefixUrl: 'https://aimpact-backend.vercel.app',
});

export const wrapKy = <T>(query: Promise<T>) => {
  return ResultAsync.fromPromise(query, (error) => error as HTTPError);
};
