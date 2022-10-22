import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useMusic } from "./service";
import { Music } from "./service/music";
import "./music.css";
import { SavedMusic } from "./savedmusic";
import { AddPlaylistMusic } from "./playlist-music";
import { IconButton } from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useNavigate } from "react-router-dom";
import { MusicContext } from "./context/music";

export const MusicForm = () => {
  const { toggleMusic, setIndex } = useContext(MusicContext)
  const { id = "" } = useParams();
  const musicService = useMusic();
  const [music, setMusic] = useState<Music>();
  const navigate = useNavigate();

  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  useEffect(() => {
    getMusic(id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getMusic = async (id: string) => {
    const currentMusic = await musicService.load(id);
    if (currentMusic) {
      setMusic(currentMusic);
      setUploadedAvatar(currentMusic?.imageURL);
    }
  };
  const searchMusic = async () => {
    if (music) {
      const rep = await musicService.search({
        author: music && music.author
      })
      setList(rep.list)
    }
  }
  useEffect(() => {
    searchMusic()
  }, [music])
  const [list, setList] = useState<Music[]>()
  const view = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    navigate(`/musics/${id}`);
  };
  return (
    <div className="view-container">
      <div  className="backgound-color-container">
        <div className="detail-song">
          <div className="detail-song-img" style={{
            backgroundImage: `url(${uploadedAvatar})`
          }} >

          </div>
          <div className="detail-song-name">
            <p>Singer</p>
            <h1>
              {music && (
                music.name
              )}
            </h1>
            <p>
              {music && (
                music.author?.map((c: any, i: number) => {
                  return (
                    <span key={i}>{(i >= 1) ? ' • ' : ''}{c}</span>
                  )
                })
              )}
            </p>
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
                  toggleMusic([music])
                }}
              >
                <PlayCircleIcon />
              </IconButton>
            )
          }
          <SavedMusic idItem={id} />
          <AddPlaylistMusic idItem={id} />

        </div>
        <hr style={{
          borderTop: '1px solid'
        }} />
        <div className="list-result">
          <h1>More by QNT</h1>
          <ul className="row list-view">
            {
              list && list.map((song, i) => {
                return (
                  <li key={i} className="col s12 m6 l4 xl2" >
                    <div className="music-card">
                      <div className="music-border-card">
                        <div className="img-card" style={{
                          backgroundImage: `url(${song.imageURL})`
                        }}>
                        </div>
                        <div className="img-name" onClick={(e) => view(e, song.id)}>
                          {song.name}
                        </div>
                        <div className="img-singer">
                          {song && (
                            song.author?.map((c: any, i: number) => {
                              return (
                                <span key={i}>{(i >= 1) ? ' ,' : ''}{c}</span>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>

      </div>
    </div>
  );
};
