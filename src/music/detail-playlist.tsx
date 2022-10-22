import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { storage } from "uione";
import { useSavedListsongResponse, usePlaylist } from "./service";
import { Music } from "./service/music";
import "./music.css";
import "react-h5-audio-player/lib/styles.css";
import { IconButton } from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Playlist } from "./service/playlist";
import { SavedMusic } from "./savedmusic";
import { MusicContext } from "./context/music";

export const DetailPlaylist = () => {
  const { toggleMusic, setIndex } = useContext(MusicContext)
  const { id = "" } = useParams();
  const listSongService = useSavedListsongResponse();
  const playlistService = usePlaylist();
  const [music, setMusic] = useState<Music[]>();
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>()



  useEffect(() => {
    getMusic(id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getMusic = async (id: string) => {
    const currentMusic = await listSongService.getSavedListsong(id);
    const detail = await playlistService.load(id);
    if (currentMusic) {
      setMusic(currentMusic);
    }
    if (detail) {
      setCurrentPlaylist(detail);
    }
  };
  console.log(music?.length, currentPlaylist)

  return (
    <div className="view-container">
      <div className="backgound-color-container">
        <div className="detail-song">
          <div className="detail-song-img" style={{
            backgroundImage: `url(${currentPlaylist && currentPlaylist.imageurl || 'https://d2rd7etdn93tqb.cloudfront.net/wp-content/uploads/2022/03/spotify-playlist-cover-orange-headphones-032322.jpg'})`
          }} >

          </div>
          <div className="detail-song-name">
            <p>Playlist</p>
            <h1>
              {
                currentPlaylist && currentPlaylist.title
              }
            </h1>
          </div>
        </div>
        <div className="song-action">
          {
            music && (
              <IconButton aria-label="home" sx={{
                color: '#e7e6e6',
                '&.Mui-checked': {
                  color: '#e7e6e6',
                },
                '& .MuiSvgIcon-root': { fontSize: 50 }
              }}
                onClick={() => {
                  setIndex(0)
                  toggleMusic(music)
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
            music && (
              music.map((song: any, i: number) => {
                return (
                  <div className="song">
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
                          toggleMusic(music)
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
        <div>
          <h2>Recommended</h2>
          <div className="list-song-playlist">
            {
              music && (
                music.map((song: any, i: number) => {
                  return (
                    <div className="song" key={song.id}>
                      <div className="title-song">
                        <div className="title-song-img" style={{
                          backgroundImage: `url(${song.imageURL})`
                        }} >

                        </div>
                        <div className="title-song-name" >
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
                        <button>Add</button>
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>
        </div>
      </div>

    </div>
  );
};
