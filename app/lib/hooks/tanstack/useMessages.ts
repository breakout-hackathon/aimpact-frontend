import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../../api/backend/api';

interface PostDeployPayload {
  projectId: string;
}

export const useRequestMessages = () => {
  return useMutation({
    mutationFn: async (payload: PostDeployPayload) => {
      const { data } = await client.post('/messages/request-free', payload);
      return data;
    },
  });
};
