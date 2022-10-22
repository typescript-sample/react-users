import {
   IconButton
} from "@mui/material";
import { ValueText } from "onecore";
import * as React from "react";
import { SearchComponentState, useSearch, value } from "react-hook-core";
import { useNavigate } from "react-router-dom";
import { inputSearch } from "uione";
import { useMusic } from "./service";
import { Music, MusicFilter } from "./service/music";
import './musics-form.scss'
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { MusicContext } from "./context/music";
import SearchIcon from '@mui/icons-material/Search';


interface MusicSearch extends SearchComponentState<Music, MusicFilter> {
  statusList: ValueText[];
}

const musicFilter: MusicFilter = {
  id: "",
  name: "",
  lyric: "",
};

const initialState: MusicSearch = {
  statusList: [],
  list: [],
  filter: musicFilter,
};
export const MusicsForm = () => {
  const { toggleMusic,setIndex } = React.useContext(MusicContext)
  const refForm = React.useRef();
  const navigate = useNavigate();
  const {
    state,
    component,
    updateState,
    search,
  } = useSearch<Music, MusicFilter, MusicSearch>(refForm, initialState, useMusic(), inputSearch());
  component.viewable = true;
  component.editable = true;

  const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    navigate(`${id}`);
  };
  const { list } = state;
  const filter = value(state.filter);

  return (
    <div className="view-container">
      <div>
        {
          (window.location.pathname.includes('search')) && (
            <form id="musicsForm" name="musicsForm" noValidate={true} ref={refForm as any}>
              <div className="search-song">
                <div className="btn-search-song">
                  <button onClick={search} >
                    <SearchIcon />
                  </button>
                </div>
                <div className="inp-search-song">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="What do you want to listen to?"
                    value={filter.name}
                    onChange={updateState}
                    maxLength={300}
                  />
                </div>
              </div>
            </form>
          )
        }
        <form className="list-result">
          {component.view !== "table" && (
            <ul className="row list-view">
              {list &&
                list.length > 0 &&
                list.map((music, i) => {
                  return (
                    <li key={i} className="col s12 m6 l4 xl2" >
                      <div className="music-card">
                        <div className="music-border-card">
                          <div className="img-card" style={{
                            backgroundImage: `url(${music.imageURL})`
                          }}>
                          </div>
                          <div className="img-name" onClick={(e) => edit(e, music.id)}>
                            {music.name}
                          </div>
                          <div className="img-singer">
                            {music.author &&
                              music.author.map((c: any, i: number) => {
                                return (
                                  <span key={i}>{(i >= 1) ? ' ,' : ''}{c}</span>
                                )
                              })}
                          </div>
                          <div className="btnPlaying">
                            <IconButton
                              aria-label="home"
                              sx={{
                                color: '#e7e6e6',
                                '&.Mui-checked': {
                                  color: '#e7e6e6',
                                },
                                '& .MuiSvgIcon-root': { fontSize: 50 }
                              }}
                              onClick={() => {
                                // setTrackIndex(i)
                                setIndex(i)
                                toggleMusic(list)
                              }}
                            >
                              <PlayCircleIcon />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
};
