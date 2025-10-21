import useUser from "../../hooks/useUser"
import { useWordsManager } from "../../hooks/useWordsManager";
import binImg from "@public/bin.png";
import { useWordsQuery } from "../../hooks/useWordsQuery";
import { Word } from "../../Interfaces";
import { useState } from "react";

export default function Main() {
    const [user, _] = useUser()
    const [editRow, setEditRow] = useState<{ index: number, val: number } | undefined>(undefined);
    const { deleteWord, generateAudio, changeBucket } = useWordsManager();
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set<string>());
    useWordsQuery(); // Pull data from server

    const toggleSetValue = (id: string) => {
        const nextSet = new Set(selectedRows.has(id) ? [...selectedRows].filter(v => v !== id) : [...selectedRows, id])
        setSelectedRows(nextSet);
    }




    function WordRow({ word, index }: { word: Word, index: number }) {
        return <tr key={index} className="border-b-2 border-b-gray-300 py-0 group">
            <td onClick={() => toggleSetValue(word.id)} className="hover:cursor-pointer"><div className={`${selectedRows.has(word.id) ? "bg-blue-100" : ""} w-5 h-5 border-[1px] border-gray-300 rounded-full mx-auto flex items-center justify-center text-sm`}>{selectedRows.has(word.id) ? "✔️" : ""}</div></td>
            <td className="py-4">{word.targetWord}</td>
            <td>{word.targetSentence}</td>
            <td>{word.targetPinyin}</td>
            <td>{word.englishWord}</td>
            <td>{word.englishSentence}</td>
            <td onClick={() => setEditRow({ index, val: word.bucket })}><div className={`w-3 h-3 rounded-full ${word.bucket > 0 ? "text-green-500" : "text-orange-300"} mx-auto self-center`}>{word.bucket}</div></td>
            {/* <td>
                {word.starred && <img onClick={() => starWord.mutate(word.id)} src="./star.png" className="w-8 mx-auto" />}
                {!word.starred && <div onClick={() => starWord.mutate(word.id)} className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>}
            </td> */}
            <td onClick={() => setEditRow({ index, val: word.bucket })} className="w-5 mx-auto group-hover:opacity-100 opacity-0 hover:cursor-pointer text-center self-center">...</td>
        </tr>
    }

    function EditRow({ word, index }: { word: Word, index: number }) {
        return <tr key={index} className="border-b-2 border-b-gray-300 py-0 group">
            <td onClick={() => toggleSetValue(word.id)} className="hover:cursor-pointer"><div className={`${selectedRows.has(word.id) ? "bg-blue-100" : ""} w-5 h-5 border-[1px] border-gray-300 rounded-full mx-auto flex items-center justify-center text-sm`}>{selectedRows.has(word.id) ? "✔️" : ""}</div></td>
            <td className="py-4">{word.targetWord}</td>
            <td>{word.targetSentence}</td>
            <td>{word.targetPinyin}</td>
            <td>{word.englishWord}</td>
            <td>{word.englishSentence}</td>
            <td className="text-center"><input autoFocus onBlur={() => { editRow?.val !== undefined && changeBucket.mutate({ id: word.id, newBucket: editRow.val }); setEditRow(undefined); }} className="w-10 bg-gray-100 border-[1px] border-gray-600 rounded-md px-1" value={editRow ? editRow.val : 0} onChange={e => {
                const t = parseInt(e.target.value);
                setEditRow(editRow ? { ...editRow, val: isNaN(t) ? 0 : t } : undefined);
            }} /></td>
            {/* <td>
                {word.starred && <img onClick={() => starWord.mutate(word.id)} src="./star.png" className="w-8 mx-auto" />}
                {!word.starred && <div onClick={() => starWord.mutate(word.id)} className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>}
            </td> */}
            {/* <td onClick={() => setEditRow(index)} className="w-5 mx-auto group-hover:visible invisible hover:cursor-pointer text-center self-center">...</td> */}

            <td><img src={binImg} alt="delete icon" onClick={() => deleteWord.mutate(word.id)} className="w-5 mx-auto my-auto hover:cursor-pointer" /></td>
            {/* <td>...</td> */}
        </tr>
    }

    return <div className="">
        {generateAudio.isPending && (
            <div className="fixed top-0 left-0 w-full h-screen bg-white/75 flex flex-col justify-center items-center gap-5">
                <h1 className="text-4xl">Loading...</h1>
                <p className="text-xl">This could take up to 30 seconds. Learning takes time!</p>
            </div>
        )}
        <h1 className="text-2xl">Your words</h1>
        <table className="table-fixed w-full">
            <thead className="text-left">
                <tr>
                    <th>Selected</th>
                    <th>Target</th>
                    <th>Sentence</th>
                    <th>Pinyin</th>
                    <th>English</th>
                    <th>Sentence</th>
                    <th className="text-center">Bucket</th>
                    {/* <th className="text-center">Starred</th> */}
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    user.words.map((word, index) => editRow && index === editRow.index ? <EditRow key={index} word={word} index={index} />
                        : <WordRow key={index} word={word} index={index} />)
                }
            </tbody>
        </table>
        <button onClick={() => generateAudio.mutate({ ids: [...selectedRows] })} className="border-[1px] border-gray-400 rounded-md px-4 py-2 mt-5">Generate audio</button>

        {
            deleteWord.status === "error" && <div className="text-red-600 bg-red-50 border-[1px] border-red-100 rounded-md w-min p-1 pr-3 mt-5">
                <p className="text-lg">{deleteWord.error.name}</p>
                <p>{deleteWord.error.message}</p>
            </div>
        }
        {
            changeBucket.status === "error" && <div className="text-red-600 bg-red-50 border-[1px] border-red-100 rounded-md w-min p-1 pr-3 mt-5">
                <p className="text-lg">{changeBucket.error.name}fff</p>
                <p>{changeBucket.error.message}</p>
            </div>
        }
    </div>
}