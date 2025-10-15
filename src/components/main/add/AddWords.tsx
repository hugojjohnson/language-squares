import { useState } from "react"
import AddWordsText from "./AddWordsFile";
import AddPinyin from "./AddPinyin";

enum Pages {
    AddWords,
    AddPinyin
}

export default function AddWords() {
    const [page, setPage] = useState<Pages>(Pages.AddWords);
    const [items, setItems] = useState<string[][]>([]);

    const moveToPinyin = (items: string[][]) => {
        setItems(items);
        setPage(Pages.AddPinyin);
    }

    const renderer = () => {
        switch(page) {
            case Pages.AddWords:
                return <AddWordsText moveToPinyin={moveToPinyin} />;
            case Pages.AddPinyin:
                return <AddPinyin items={items} />
        }
    }

    return <div className="flex flex-col">
        { renderer() }
    </div>
}