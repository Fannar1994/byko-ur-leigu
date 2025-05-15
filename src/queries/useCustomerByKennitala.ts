
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerByKennitala } from "@/api/inspHireService";

export function useCustomerByKennitala(kennitala: string) {
  return useQuery({
    queryKey: ["customer", kennitala],
    queryFn: () => fetchCustomerByKennitala(kennitala),
    enabled: !!kennitala && kennitala.length >= 10, // Only fetch when kennitala is valid
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
}
