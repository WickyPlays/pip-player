import { atom } from "jotai";

export const linkAtom = atom('')
export const embedToggleAtom = atom(true)
//Search
export const isSearchingAtom = atom(false)
//Focus
export const isFocusAtom = atom(true)
//Refresh
export const refreshKeyAtom = atom(0)
//Webview
export const webviewLoadedAtom = atom(false)
export const webviewRefAtom = atom<Electron.WebviewTag | null>(null)