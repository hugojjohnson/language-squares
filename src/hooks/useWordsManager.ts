import { useMutation } from "@tanstack/react-query";
import { post, get, baseURL } from "../Network";
import useUser from "./useUser";
import { Word } from "../Interfaces";
import { PinyinWord } from "../components/main/add/AddPinyin";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function useWordsManager() {
  const [user, setUser] = useUser();
  const navigate = useNavigate();

  // ----------------------
  // ADD WORDS
  // ----------------------
  const addWordsMutation = useMutation({
    mutationFn: async ({ items, matrix }: { items: string[][]; matrix: PinyinWord[][] }) => {
      if (items.length % 4 !== 0) throw new Error("Length is not correct");

      const pinYinSentences = matrix.map(sentence =>
        sentence.map(char => char.pinyin[char.index] + (char.isChineseCharacter ? " " : "")).join("")
      );

      if (pinYinSentences.length !== matrix.length)
        throw new Error("Matrix and sentences not the same length.");

      const wordsToSend: Word[] = matrix.map((_, index) => ({
        targetWord: items[2][index],
        targetSentence: items[3][index],
        targetPinyin: pinYinSentences[index],
        englishWord: items[0][index],
        englishSentence: items[1][index],
        id: crypto.randomUUID(),
        bucket: 0,
        starred: false,
      }));

      const response = await post<Word[]>("/main/add-words", { token: user.token }, { wordsToSend });
      if (!response.success) throw new Error(response.data as string);

      // update user state
      setUser({ ...user, words: user.words.concat(response.data) });
      navigate("/");
      return response.data;
    },
  });

  // ----------------------
  // DELETE WORD
  // ----------------------
  const deleteWordMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await get<Word[]>("/main/delete-word", { token: user.token, id });
      if (!response.success) throw new Error(response.data as string);

      setUser({ ...user, words: user.words.filter(word => word.id !== id) });
      return response.data;
    },
  });

  // ----------------------
  // STAR WORD
  // ----------------------
  const starWordMutation = useMutation({
    mutationFn: async (id: string) => {
      const userClone = structuredClone(user);
      const idx = userClone.words.findIndex(word => word.id === id);
      if (idx === -1) throw new Error("Word not found.");

      const originalValue = userClone.words[idx].starred;
      userClone.words[idx].starred = !originalValue;
      setUser(userClone);

      const response = await get("/star", { token: user.token, id });
      if (!response.success) {
        const reverted = structuredClone(userClone);
        reverted.words[idx].starred = originalValue;
        setUser(reverted);
        throw new Error(response.data as string);
      }
      return id;
    },
  });


  // ----------------------
  // CHANGE BUCKET
  // ----------------------
  const changeBucketMutation = useMutation({
    mutationFn: async ({ id, newBucket }: { id: string; newBucket: number }) => {
      const userClone = structuredClone(user);
      const idx = userClone.words.findIndex(word => word.id === id);
      if (idx === -1) throw new Error("Word not found.");

      const originalValue = userClone.words[idx].bucket;
      userClone.words[idx].bucket = newBucket;
      setUser(userClone);

      const response = await post("/main/change-bucket", { token: user.token, id }, { newBucket });
      if (!response.success) {
        const reverted = structuredClone(userClone);
        reverted.words[idx].bucket = originalValue;
        setUser(reverted);
        throw new Error(response.data as string);
      }
      return;
    },
  });

  // ----------------------
  // GENERATE AUDIO
  // ----------------------
  const generateAudioMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get<Blob>(baseURL + "main/generate-audio", {
        responseType: "blob",
        params: { token: user.token },
      });

      const blob = new Blob([response.data], { type: "audio/mp3" });
      const url: string = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "audio.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  });

  return {
    addWords: addWordsMutation,
    deleteWord: deleteWordMutation,
    starWord: starWordMutation,
    generateAudio: generateAudioMutation,
    changeBucket: changeBucketMutation
  };
}
