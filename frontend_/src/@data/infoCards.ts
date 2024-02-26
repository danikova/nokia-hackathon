import axios from "axios";
import { InfoCardsResponse } from "./infoCards.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useInfoCards(
  options?: Partial<UseQueryOptions<InfoCardsResponse, Error>>
) {
  return useQuery({
    queryKey: ["infoCards"],
    queryFn: async () => {
      const response = await axios.get("/api/collections/info_cards/records");
      return response.data;
    },
    ...options,
  });
}
