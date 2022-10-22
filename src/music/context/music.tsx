import { createContext, ReactNode, useReducer } from 'react'
import { MusicActionType, musicReducer, MusicState } from '../reducer/music'
import { Music } from '../service/music'

interface MusicContextProps {
	children: ReactNode
}

const { TOGGLE_MUSIC ,SET_TRACK_INDEX} = MusicActionType

interface MusicContextDefault {
	music: MusicState
	toggleMusic: (listMusic: Music[]) => void,
	setIndex: (index: number) => void
}

const musicDefault: MusicState = {
	listMusic:[],
	index:0
}

export const MusicContext = createContext<MusicContextDefault>({
	music: musicDefault,
	toggleMusic: () => null,
	setIndex: () => null,
})

const MusicContextProvider = ({ children }: MusicContextProps) => {
	const [music, dispatch] = useReducer(musicReducer, musicDefault)

	const toggleMusic = (listMusic:Music[]) => {
		// console.log(listMusic)
		dispatch({ type: TOGGLE_MUSIC, payload:{music:listMusic} })
	}
	const setIndex = (index:number) => {
		// console.log(index)
		dispatch({ type: SET_TRACK_INDEX, payload:{index} })
	}

	const musicContextData = {
		music,
		toggleMusic,
		setIndex

	}

	return (
        <MusicContext.Provider value={musicContextData} >
			{children}
		</MusicContext.Provider>
	)
}

export default MusicContextProvider