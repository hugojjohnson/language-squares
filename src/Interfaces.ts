import { Dispatch, SetStateAction } from "react";


export type Word = {
    targetWord: string;
    targetSentence: string;
    targetPinyin: string;
    englishWord: string;
    englishSentence: string;
    id: string;
    bucket: number;
    starred: boolean;
}

export type SafeData = {
    username: string;
    token: string;
    words: Word[]
};

export type UserData = SafeData | undefined | null;

export type Safe = [SafeData, Dispatch<SetStateAction<SafeData>>]
export type User = [UserData, Dispatch<SetStateAction<UserData>>]

type RequestResponseSuccess<T> = {
    success: true;
    data: T;
    status?: number;
};
type RequestResponseFailure = {
    success: false;
    data: string;
    status?: number;
};
export type RequestResponse<T> = RequestResponseSuccess<T> | RequestResponseFailure;
