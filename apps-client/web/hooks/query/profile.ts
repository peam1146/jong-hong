import { useQuery } from '@tanstack/react-query'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then((res) => res.json()),
  })
}
