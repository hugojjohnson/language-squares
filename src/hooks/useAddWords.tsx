// hooks/useAddWords.ts
import { useState } from "react";
import useUser from "./useUser";
import { PinyinWord } from "../components/main/add/AddPinyin";
import { Word } from "../Interfaces";
import { post } from "../Network";


export function useAddWords() {
    const [user, setUser] = useUser();
    const [errorText, setErrorText] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    async function addWords(items: string[][], matrix: PinyinWord[][]) {
        setErrorText("Sending request...")
        if (items.length % 4 !== 0) {
            setErrorText("Error: Length is not correct")
            return
        }
        const pinYinSentences = matrix.map(sentence => sentence.map(char => { return char.pinyin[char.index] + (char.isChineseCharacter ? " " : "")}).join(''))
        if (pinYinSentences.length != matrix.length) {
            throw new Error("Matrix and sentences not the same length.");
        }
        console.log(items)
        const wordsToSend: Word[] = matrix.map((_, index) => ({
            targetWord: items[2][index],
            targetSentence: items[3][index],
            targetPinyin: pinYinSentences[index],
            englishWord: items[0][index],
            englishSentence: items[1][index],
            id: crypto.randomUUID(),
            bucket: 0,
            starred: false

        }))
        console.log(wordsToSend)

        const response = await post<Word[]>("/main/add-words", { token: user.token }, { wordsToSend })
        console.log(response.data)
        if (response.success) {
            setUser({ ...user, words: user.words.concat(response.data) })
            setIsAnimating(true)
            setErrorText("")
            setTimeout(() => setIsAnimating(false), 1500)
        } else {
            setErrorText("Error: " + response.data)
        }
    }

    return { addWords, errorText, isAnimating };
}