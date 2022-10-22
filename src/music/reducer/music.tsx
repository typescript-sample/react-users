import { Music } from "../service/music";

export enum MusicActionType {
    TOGGLE_MUSIC = 'TOGGLE_MUSIC',
    SET_TRACK_INDEX = 'SET_TRACK_INDEX',
}
type MusicAction = { type: MusicActionType; payload:{music?:Music[],index?:number}}

export interface MusicState {
    listMusic?: Music[],
	index?:number
}

const { TOGGLE_MUSIC ,SET_TRACK_INDEX} = MusicActionType

export const musicReducer = (state: MusicState, action: MusicAction) => {
    const { type, payload } = action
    switch (type) {
		case TOGGLE_MUSIC:
			return {
				...state,
                listMusic:payload.music
			}
		case SET_TRACK_INDEX:
			return {
				...state,
                index:payload.index
			}
		default:
			return state
	}
}