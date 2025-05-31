import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../../api/backend/api';

export const useRequestMessages = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await client.post('/user/request-messages');
      return data;
    },
  });
};
