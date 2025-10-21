import { useState } from "react";


interface Props {
    moveToPinyin: (items: string[][]) => void;
    // setErrorText: (x: string) => void;
}
export default function AddWordsText({ moveToPinyin } : Props) {
    const [errorText, setErrorText] = useState("")
    const [words, setWords] = useState("")
    const [isAnimating, _] = useState(false)

    const splitIntoFour = (arr: string[]) => arr.reduce((acc: string[][], cur: string, idx: number) => {
        acc[idx % 4].push(cur);
        return acc;
    }, [[], [], [], []]);

    async function addWords() {
        setErrorText("Sending request...")
        const myWords = words.split(/\\|\n/)
        if (myWords.length % 4 !== 0) {
            console.log(words.split(/\\\|\n/))
            setErrorText("Error: Length is not correct")
            return
        }
        const myList = splitIntoFour(myWords)

        moveToPinyin(myList);
    }

    return <div className="flex flex-col">
        <h1 className="text-2xl pb-10">Add words</h1>
        <div className="flex flex-row gap-3">
            <div className="w-full">
                <p>Enter it in this format:english\sentence\language\language_sentence</p>
                <textarea value={words} onChange={e => setWords(e.target.value)} className="border-[1px] border-gray-300 rounded-md min-h-96 w-full" />
            </div>
        </div>

        <button onClick={addWords} className="bg-white border-[1px] border-gray-300 rounded-md px-4 py-2 mt-10">Add</button>
        
        <p className="mt-2 text-xl">{errorText}</p>

        <img src="/tickSymbol.png" className={`fixed bottom-12 right-12 w-20 h-20 ${isAnimating ? "animate-tickRotateFade" : "hidden"}`} />
    </div>
}