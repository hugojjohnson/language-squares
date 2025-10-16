import useUser from "../../hooks/useUser"
import { useWordsManager } from "../../hooks/useWordsManager";

export default function Main() {
    const [user, _] = useUser()
    const { deleteWord, starWord, generateAudio } = useWordsManager();

    


    return <div className="">
        { generateAudio.isPending && (
        <div className="fixed top-0 left-0 w-full h-screen bg-white/75 flex flex-col justify-center items-center gap-5">
            <h1 className="text-4xl">Loading...</h1>
            <p className="text-xl">This could take up to 30 seconds. Learning takes time!</p>
        </div>
        )}
        <h1 className="text-2xl">Your words</h1>
        <table className="table-fixed w-full">
            <thead className="text-left">
                <tr>
                    <th>Target</th>
                    <th>Sentence</th>
                    <th>Pinyin</th>
                    <th>English</th>
                    <th>Sentence</th>
                    <th className="text-center">Learned</th>
                    <th className="text-center">Starred</th>
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
            {
                user.words.map((word, index) => <tr key={index} className="border-b-2 border-b-gray-300 py-0 group">
                    {/* Silly HTML, I have to add the table padding here... */}
                    <td className="py-4">{word.targetWord}</td>
                    <td>{word.targetSentence}</td>
                    <td>{word.targetPinyin}</td>
                    <td>{word.englishWord}</td>
                    <td>{word.englishSentence}</td>
                    <td><div className={`w-3 h-3 rounded-full ${word.bucket > 0 ? "bg-green-500" : "bg-orange-300"} mx-auto`}></div></td>
                    <td>
                        { word.starred && <img onClick={() => starWord.mutate(word.id)} src="./star.png" className="w-8 mx-auto" /> }
                        { !word.starred && <div onClick={() => starWord.mutate(word.id)} className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div> }
                    </td>
                    <td><img src="/bin.png" alt="delete icon" onClick={() => deleteWord.mutate(word.id)} className="w-5 mx-auto group-hover:visible invisible hover:cursor-pointer" /></td>
                </tr>)
            }
            </tbody>
        </table>
        <button onClick={() => generateAudio.mutate()} className="border-[1px] border-gray-400 rounded-md px-4 py-2 mt-5">Generate audio</button>

        {
            deleteWord.status === "error" && <div className="text-red-600 bg-red-50 border-[1px] border-red-100 rounded-md w-min p-1 pr-3 mt-5">
                <p className="text-lg">{deleteWord.error.name}</p>
                <p>{deleteWord.error.message}</p>
                </div>
        }
    </div>
}