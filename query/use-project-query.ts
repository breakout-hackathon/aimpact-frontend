import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { ky } from 'query';

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const useProjectsQuery = (ownership: 'all' | 'owned', sortBy: 'createdAt' | 'updatedAt' | 'name', sortDirection: 'ASC' | 'DESC', jwtToken?: string) => {
  return useQuery<Project[]>({
    initialData: [],
    queryKey: ['projects'],
    queryFn: async () => {
      const requestHeaders: Record<string, string> = {};
      if (jwtToken) {
        requestHeaders['Authorization'] = `Bearer ${jwtToken}`;
      }
      const res = await ky.get('projects', {
        searchParams: {
          ownership,
          sortBy,
          sortOrder: sortDirection,
        },
        headers: requestHeaders
      })
      const data = await res.json<Project[]>();

      if (!res.ok) {
        throw new Error('Not found projects');
      }

      return data;
    },
  });
};
