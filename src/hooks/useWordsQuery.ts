import { useQuery } from "@tanstack/react-query";
import { get } from "../Network";
import { RequestResponse, Word } from "../Interfaces";
import { useContext } from "react";
import { UserContext } from "../Context";


export function useWordsQuery() {
    const [userDangerous, setUserDangerous] = useContext(UserContext);
  // ----------------------
  // GET UPDATES
  // ----------------------
  const getUpdatesQuery = useQuery({
    queryKey: ["user-updates", userDangerous?.username],
    queryFn: async () => {
      if (!userDangerous?.token) throw new Error("No token available");

      const response: RequestResponse<Word[]> = await get("auth/get-updates", { token: userDangerous.token });
      if (!response.success) throw new Error(response.data as string);

    //   Update local user state with the latest words
      setUserDangerous({ ...userDangerous, words: response.data });
      console.log("response.data")
      console.log(response.data)
      return response.data;
    },
    enabled: !!userDangerous?.token, // only run if user exists
    staleTime: 1000 * 60 * 5, // 5 min cache (optional)
  });

  return {
    getUpdates: getUpdatesQuery
  };
}
