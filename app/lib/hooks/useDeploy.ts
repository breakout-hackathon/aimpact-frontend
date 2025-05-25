import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../api/backend/api';

interface PostDeployPayload {
  projectId: string;
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

export const usePostDeploy = () => {
  return useMutation({
    mutationFn: async (payload: PostDeployPayload) => {
      const { data } = await client.post('/deploy-app', payload);
      return data;
    },
  });
};
