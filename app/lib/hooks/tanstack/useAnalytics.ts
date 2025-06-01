import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../../api/backend/api';

interface NpsDataPayload {
  grade: number;
}

export const useGetDeploy = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data, request } = await client.get('/deploy-app/', {
        params: { projectId },
      });
      console.log(request);

      return data;
    },
  });
};

export const usePostNPS = () => {
  return useMutation({
    mutationFn: async (payload: NpsDataPayload) => {
      const { status } = await client.post('/analytics/nps/', payload);
      return status;
    },
  });
};
