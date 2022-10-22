import * as React from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylist } from "./service";
import { Playlist } from "./service/playlist";
import { storage } from 'uione';
import './musics-form.scss'
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export const PlaylistForm = () => {
  const navigate = useNavigate();
  const userId: string | undefined = storage.getUserId() || ''
  const [playList, setPlayList] = React.useState<Playlist[]>();
  const playlistService = usePlaylist()
  const loadPlaylist = async () => {
    if (!userId) {
      return
    }
    const rep: any = await playlistService.search({
      userId: userId
    })
    setPlayList(rep.list)
  }
  React.useEffect(() => {
    loadPlaylist()
  }, [])

  return (
    <div className="view-container">
      <div >
        <form className="list-result">
          <ul className="row list-view">
            {playList &&
              playList.length > 0 &&
              playList.map((music, i) => {
                return (
                  <li key={i} className="col s12 m6 l4 xl2" onClick={() => navigate(`${music.id}`)}>
                    <div className="music-card ">
                      <div className="music-border-card">
                        {
                          music.imageurl ? (
                            <div className="img-card" style={{
                              backgroundImage: `url(${music.imageurl})`
                            }}>
                            </div>
                          ) : (
                            <div className="img-card playlist" >
                              <MusicNoteIcon />
                            </div>
                          )
                        }

                        <div className="img-name">
                          {music.title}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </form>
      </div>
    </div>
  );
};
