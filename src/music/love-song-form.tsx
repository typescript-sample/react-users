import {
 IconButton
} from "@mui/material";
import * as React from "react";
import { Music } from "./service/music";
import { useSavedItemResponse } from './service'
import { storage } from 'uione';
import { useLocation } from 'react-router-dom';
import './musics-form.scss'
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { MusicContext } from "./context/music";
import { SavedMusic } from "./savedmusic";


export const LoveSongForm = () => {
  const { toggleMusic, setIndex } = React.useContext(MusicContext)
  const locationPath = useLocation();
  const savedItemService = useSavedItemResponse();

  const userId: string | undefined = storage.getUserId() || ''
  const [list, setList] = React.useState<Music[]>()

  const savedSongs = async () => {
    if (window.location.pathname.includes('save')) {
      if (!userId) {
        return
      }
      const result: any = await savedItemService.getSavedItem(userId)
      setList(result)

    }
  }
  React.useEffect(() => {
    savedSongs()

  }, [locationPath.pathname])

  return (
    <div className="view-container">
      <div className="backgound-color-container">
        <div className="detail-song">
          <div className="detail-song-img" style={{
            backgroundImage: `url(https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png)`
          }} >

          </div>
          <div className="detail-song-name">
            <p>Playlist</p>
            <h1>
              Liked songs
            </h1>
          </div>
        </div>
        <div className="song-action">
          {
            list && (
              <IconButton aria-label="home" sx={{
                color: '#e7e6e6',
                '&.Mui-checked': {
                  color: '#e7e6e6',
                },
                '& .MuiSvgIcon-root': { fontSize: 50 }
              }}
                onClick={() => {
                  setIndex(0)
                  toggleMusic(list)
                }}
              >
                <PlayCircleIcon />
              </IconButton>
            )
          }

        </div>
        <hr style={{
          borderTop: '1px solid'
        }} />
        <div className="list-song-playlist">
          {
            list && (
              list.map((song: any, i: number) => {
                return (
                  <div className="song" key={i}>
                    <div className="index-song">
                      {i + 1}
                    </div>
                    <div className="title-song">
                      <div className="title-song-img" style={{
                        backgroundImage: `url(${song.imageURL})`
                      }} >

                      </div>
                      <div className="title-song-name"
                        onClick={() => {
                          setIndex(i)
                          toggleMusic(list)
                        }}>
                        <p>{song.name}</p>
                        <p>{
                          song.author && song.author.map((c: any, i: number) => {
                            return (
                              <span key={i}>{(i >= 1) ? ' ,' : ''}{c}</span>
                            )
                          })
                        }</p>
                      </div>
                    </div>
                    <div className="album-song">
                      {song.name}
                    </div>
                    <div className="saved-song">
                      <SavedMusic idItem={song.id} />
                    </div>
                  </div>
                )
              })
            )
          }
        </div>
      </div>
    
    </div>
  );
};
