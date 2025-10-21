import { useQuery } from "@tanstack/react-query";
import { get } from "../Network";
import { RequestResponse, Word } from "../Interfaces";
import useUser from "./useUser";


export function useWordsQuery() {
    const [user, setUser] = useUser();
  // ----------------------
  // GET UPDATES
  // ----------------------
  const getUpdatesQuery = useQuery({
    queryKey: ["user-updates", user.username],
    queryFn: async () => {
      console.log("updatinggg")
      if (!user.token) {
        console.error("No user token");
        throw new Error("No token available");
      }
      console.log("HI1!");
      const response: RequestResponse<Word[]> = await get("auth/get-updates", { token: user.token });
      console.log("HI2!");
      if (!response.success) throw new Error(response.data as string);

      console.log("data");
      console.log(response.data);

    //   Update local user state with the latest words
      setUser({ ...user, words: response.data });
      console.log("response.data")
      console.log(response.data)
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache (optional)
  });

  return {
    getUpdates: getUpdatesQuery
  };
}
