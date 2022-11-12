import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from "react-hook-core";
import { inputEdit, handleError, options } from "uione";
import { SuggestionService } from "suggestion-service";
import { Music, getMusicService } from "./service";
import { TextField, Autocomplete, Chip, Stack } from "@mui/material";
import { useAuthorService } from "./service/music";
// import { FileUpload } from "../core/upload";
import Axios from "axios";
import { HttpRequest } from "axios-core";
// import { config } from "../config";
import { useNavigate } from "react-router-dom";
import "./music.css";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const httpRequest = new HttpRequest(Axios, options);
interface InternalState {
  music: Music;
  showAutocomplete: boolean;
}

const initialState: InternalState = {
  music: {} as Music,
  showAutocomplete: false,
};

const createMusic = (): Music => {
  const music = createModel<Music>();
  return music;
};

const initialize = (id: string | null, load: (id: string | null) => void) => {
  load(id);
};

const param: EditComponentParam<Music, string, InternalState> = {
  createModel: createMusic,
  initialize,
};

export const BMusicForm = () => {
  const navigate = useNavigate();
  const refForm = useRef();
  const { resource, state, setState, updateState, flag, save, back } = useEdit<Music, string, InternalState>(
    refForm,
    initialState,
    getMusicService(),
    inputEdit(),
    param
  );

  const music = state.music;

  const authorService = useAuthorService();
  const [authorSuggestionService, setAuthorSuggestionService] = useState<SuggestionService<string>>();
  const [listAuthor, setListAuthor] = useState<string[]>([]);

  useEffect(() => {
    const authorSuggestion = new SuggestionService<string>(authorService.query, 20);
    setAuthorSuggestionService(authorSuggestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [previousAuthor, setPreviousAuthor] = useState({
    keyword: "",
    list: [] as string[],
  });

  const onChangeAuthor = (e: any, newValue: string[]) => {
    if (newValue.length > -1) {
      const newItem = { ...music, author: newValue };
      setState({ music: newItem }, () => {});
    }
  };

  const isUpload = React.useMemo(() => window.location.pathname.includes("upload"), [window.location.pathname]);
  const header = React.useMemo(
    () => (flag.newMode ? resource.create : isUpload ? resource.upload : resource.edit),
    // eslint-disable-next-line
    [flag.newMode, isUpload]
  );

  return (
    <div className="view-container">
      <form id="musicForm" name="musicForm" model-name="music" ref={refForm as any}>
        <header>
          <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={back} />
          <h2>{header}</h2>
        </header>

        <div className="row">
          <label className="col s12 m6">
            ID
            <input
              type="text"
              id="id"
              name="id"
              value={music.id || ""}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20}
              required={true}
            />
          </label>

          <label className="col s12 m6">
            Name
            <input
              type="text"
              id="name"
              name="name"
              value={music.name || ""}
              onChange={updateState}
              maxLength={40}
              required={true}
              placeholder="Name"
            />
          </label>

          <label className="col s12 m6">
            Image URL
            <input
              type="text"
              id="imageURL"
              name="imageURL"
              value={music.imageURL || ""}
              onChange={updateState}
              maxLength={1000}
              placeholder="Image URL"
            />
          </label>
          <label className="col s12 m6">
            Mp3 URL
            <input
              type="text"
              id="mp3URL"
              name="mp3URL"
              value={music.mp3URL || ""}
              onChange={updateState}
              maxLength={1000}
              placeholder="Mp3 URL"
            />
          </label>

          <label className="col s12 m6">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3} marginTop={2}>
                <DesktopDatePicker
                  label="Release Date"
                  inputFormat="MM/dd/yyyy"
                  value={music.releaseDate}
                  onChange={(newValue: Date | null) => {
                    setState({
                      music: {
                        ...music,
                        releaseDate: newValue || undefined,
                      },
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </label>

          <label className="col s12 m6">
            Author
            <Autocomplete
              options={[]}
              multiple
              freeSolo
              value={music.author || []}
              onChange={onChangeAuthor}
              renderTags={(v: readonly string[], getTagProps: any) =>
                v.map((option: string, index: number) => (
                  <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} variant="standard" name="directors" color="primary" placeholder="Author" />
              )}
            />
          </label>

          <label className="music-lyric col s12 m6">
            Lyric
            <textarea
              rows={6}
              id="lyric"
              name="lyric"
              value={music.lyric || ""}
              onChange={updateState}
              placeholder="Lyric"
            />
          </label>
        </div>

        <footer>
          {!flag.readOnly && (
            <button type="submit" id="btnSave" name="btnSave" onClick={save}>
              {resource.save}
            </button>
          )}
        </footer>
      </form>
    </div>
  );
};
