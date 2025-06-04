import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../../api/backend/api';

interface RequestMesssagesPayload {
  twitterHandle: string;
}

export const useRequestMessages = () => {
  return useMutation({
    mutationFn: async (payload: RequestMesssagesPayload) => {
      const { data } = await client.post('/user/request-messages', payload);
      return data;
    },
  });
};
