import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../../api/backend/api';
import type { Dirent } from '~/lib/stores/files';

interface PostDeployPayload {
  projectId: string;
  snapshot: { [k: string]: Dirent | undefined; };
}

export const useGetDeploy = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data, request } = await client.get('/deploy-app/s3-deployment', {
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
      const { data } = await client.post('/deploy-app/s3-deployment', payload);
      return data;
    },
  });
};
