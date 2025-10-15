import pinyin from "pinyin";
import { useState } from "react";
import { useAddWords } from "../../../hooks/useAddWords";

interface Props {
    items: string[][];
}
export interface PinyinWord {
    character: string;
    pinyin: string[];
    index: number;
    isChineseCharacter: boolean;
}

function isChineseCharacter(char: string) {
    const chineseCharacterRegex = /[\u4e00-\u9fff]+/;
    return chineseCharacterRegex.test(char);
}

export default function AddPinyin({ items }: Props) {
    const [matrix, setMatrix] = useState<PinyinWord[][]>(items[3].map(sentence => [...sentence].map(char => ({
        character: char,
        pinyin: pinyin(char, { heteronym: true })[0],
        index: 0,
        isChineseCharacter: isChineseCharacter(char)
    }))));
    const { addWords, errorText } = useAddWords();

    return <div className="">
        {
            matrix.map((sentence, i) => <div className="flex flex-row gap-2">
                {
                    sentence.map((char, j) => <p onClick={() => {
                        const c = structuredClone(matrix);
                        c[i][j].index += 1;
                        c[i][j].index %= c[i][j].pinyin.length;
                        setMatrix(c);
                    }}>{char.pinyin[char.index]}</p>
                    )
                }
            </div>)
        }
        <p>{errorText}</p>
        <button onClick={() => addWords(items, matrix)} className="p-3 mt-10 rounded-md border-[1px] border-gray-600">Add</button>
    </div>
}

// hi\hi, there! My name is Han. Nice to meet you!\你好\你好！我叫韩，很高兴认识你。
// beautiful\You have beautiful eyes. No really, they're wonderful.\美丽的\你的眼睛真漂亮。真的，简直太迷人了。