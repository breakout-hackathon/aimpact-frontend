import { useQuery } from "@tanstack/react-query"

export const useDeployQuery = () => {
  return useQuery({
    queryKey: ['']
  })
}