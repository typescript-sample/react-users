import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
  createModel,
  DispatchWithCallback,
  EditComponentParam,
  useEdit,
} from "react-hook-core";
import { inputEdit, Status, handleError } from "uione";
import { useCategory, useDirector, useCast, useProduction, useCountry, useFilm } from "./service";
import { Film } from "./service/film";
// import { StringService } from 'pg-extension';
import {
  Chip,
  TextField,
  Autocomplete,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { SuggestionService } from 'suggestion-service';

interface InternalState {
  film: Film;
  categoryList: string[];
  showAutocomplete: boolean;
}
const initialState: InternalState = {
  film: {} as Film,
  categoryList: [],
  showAutocomplete: false,
};

const createFilm = (): Film => {
  const film = createModel<Film>();
  film.categories = [];
  film.status = Status.Active;
  return film;
};

const initialize = async (
  filmId: string | null,
  load: (id: string | null) => void,
  set: DispatchWithCallback<Partial<InternalState>>
) => {
  // eslint-disable-next-line
  const categoryService = useCategory();
  categoryService.getAllCategories().then((allCategories) => {
    const categoryList: string[] = [];
    for (const item of allCategories.list) {
      categoryList.push(item.categoryName);
    }
    load(filmId);
    set({ categoryList, showAutocomplete: true });
  });
};

const param: EditComponentParam<Film, string, InternalState> = {
  createModel: createFilm,
  initialize,
};


export const FilmForm = () => {
  const refForm = useRef();
  const { resource, state, setState, back, flag, updateState, save } = useEdit<
    Film,
    string,
    InternalState
  >(refForm, initialState, useFilm(), inputEdit(), param);

  // useEffect(() => {

  // }, [])
  const directorsService = useDirector();
  const directorsSuggestion = new SuggestionService<string>(
    directorsService.query,
    20
  );
  console.log(directorsService)
  console.log(directorsSuggestion)


  const film = state.film;


  const onChangeDirectors = (e: any, newValue: string[]) => {
    if (newValue.length > -1) {
      const newItem = { ...film, directors: newValue };
      setState({ film: newItem }, () => {});
    }
  };

  const onChangeCast = (e: any, newValue: string[]) => {
    if (newValue.length > -1) {
      const newItem = { ...film, casts: newValue };
      setState({ film: newItem }, () => {});
    }
  };

  const onChangeProductions = (e: any, newValue: string[]) => {
    if (newValue.length > -1) {
      const newItem = { ...film, productions: newValue };
      setState({ film: newItem }, () => {});
    }
  };

  const onChangeCountries = (e: any, newValue: string[]) => {
    if (newValue.length > -1) {
      const newItem = { ...film, countries: newValue };
      setState({ film: newItem }, () => {});
    }
  };

  return (
    <div className="view-container">
      <form
        id="filmForm"
        name="filmForm"
        model-name="film"
        ref={refForm as any}
      >
        <header>
          <button
            type="button"
            id="btnBack"
            name="btnBack"
            className="btn-back"
            onClick={back}
          />
          <h2>{flag.newMode ? resource.create : resource.edit} film</h2>
        </header>
        <div>
          <section className="row">
            <label className="col s12 m6">
              {resource.film_id}
              <input
                type="text"
                id="filmId"
                name="filmId"
                value={film.filmId}
                onChange={updateState}
                maxLength={20}
                required={true}
                readOnly={!flag.newMode}
                placeholder={resource.film_id}
              />
            </label>
            <label className="col s12 m6">
              {resource.title}
              <input
                type="text"
                id="title"
                name="title"
                value={film.title}
                onChange={updateState}
                maxLength={300}
                required={true}
                placeholder={resource.title}
              />
            </label>
            <label className="col s12 m6">
              {resource.image_url}
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={film.imageUrl}
                onChange={updateState}
                maxLength={300}
                placeholder={resource.image_url}
              />
            </label>
            <label className="col s12 m6">
              {resource.trailer_url}
              <input
                type="text"
                id="trailerUrl"
                name="trailerUrl"
                value={film.trailerUrl}
                onChange={updateState}
                maxLength={300}
                placeholder={resource.trailer_url}
              />
            </label>
            <label className="col s12 m6">
              {resource.description}
              <input
                type="text"
                id="description"
                name="description"
                value={film.description}
                onChange={updateState}
                maxLength={300}
                placeholder={resource.description}
              />
            </label>
            <label className="col s12 m6 radio-section">
              {resource.status}
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    onChange={(e) => updateState(e, () => setState)}
                    value="A"
                    checked={film.status === "A"}
                  />
                  {resource.active}
                </label>
                <label>
                  <input
                    type="radio"
                    id="inactive"
                    name="status"
                    onChange={(e) => updateState(e, () => setState)}
                    value="I"
                    checked={film.status === "I"}
                  />
                  {resource.inactive}
                </label>
              </div>
            </label>

            <label className="col s12 m6">
              Director
              <Autocomplete
                options={[]}
                multiple
                freeSolo
                value={film.directors || []}
                onChange={onChangeDirectors}
                renderTags={(v: readonly string[], getTagProps: any) =>
                  v.map((option: string, index: number) => (
                    <Chip
                      key={index}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    name="directors"
                    color="primary"
                    placeholder="Directors"
                  />
                )}
              />
            </label>

            <label className="col s12 m6">
              Cast
              <Autocomplete
                options={[]}
                multiple
                freeSolo
                value={film.casts || []}
                onChange={onChangeCast}
                renderTags={(v: readonly string[], getTagProps: any) =>
                  v.map((option: string, index: number) => (
                    <Chip
                      key={index}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    name="casts"
                    color="primary"
                    placeholder="Casts"
                  />
                )}
              />
            </label>

            <label className="col s12 m6">
              Productions
              <Autocomplete
                options={[]}
                multiple
                freeSolo
                value={film.productions || []}
                onChange={onChangeProductions}
                renderTags={(v: readonly string[], getTagProps: any) =>
                  v.map((option: string, index: number) => (
                    <Chip
                      key={index}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    name="productions"
                    color="primary"
                    placeholder="Productions"
                  />
                )}
              />
            </label>

            <label className="col s12 m6">
              Countries
              <Autocomplete
                options={['123', '456']}
                multiple
                freeSolo
                value={film.countries || []}
                onChange={onChangeCountries}
                renderTags={(v: readonly string[], getTagProps: any) =>
                  v.map((option: string, index: number) => (
                    <Chip
                      key={index}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    name="countries"
                    color="primary"
                    placeholder="Countries"
                  />
                )}
              />
            </label>

            <label className="col s12 m6">
              {((!flag.newMode && film.categories) || flag.newMode) && (
                <Autocomplete
                  multiple
                  options={state.categoryList}
                  value={film.categories}
                  onChange={(e, newValue) => {
                    const newFilm = { ...film, categories: newValue };
                    setState({ film: newFilm }, () => {});
                  }}
                  filterSelectedOptions={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="categories"
                      placeholder="category"
                    />
                  )}
                />
              )}
            </label>
          </section>
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
