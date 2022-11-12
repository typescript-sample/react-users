import * as React from "react";
import {
  OnClick,
  Search,
  SearchComponentState,
  useSearch,
  value,
  checked,
} from "react-hook-core";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Pagination } from "reactx-pagination";
import { inputSearch } from "uione";
import { getMusicService, Music, MusicFilter } from "./service";
import noPhoto from "../assets/images/no_photo.jpg";
import {
  Chip,
  TextField,
  Autocomplete,
  ThemeProvider,
  createTheme,
} from "@mui/material";

interface MusicSearch extends SearchComponentState<Music, MusicFilter> {}

const musicFilter: MusicFilter = {
  id: "",
  name: "",
  lyric: "",
  author: [],
  duration: {
    max: undefined,
    min: undefined,
  },
};

const initialState: MusicSearch = {
  list: [],
  filter: musicFilter,
};

export const BMusicsForm = () => {
  const navigate = useNavigate();
  const refForm = React.useRef();
  const [authors, setAuthors] = React.useState<string[]>([]);

  const getFilter = (): MusicFilter => {
    return value(state.filter);
  };
  const p = { getFilter };

  const {
    state,
    resource,
    component,
    updateState,
    search,
    sort,
    toggleFilter,
    clearQ,
    changeView,
    pageChanged,
    pageSizeChanged,
    setState,
  } = useSearch<Music, MusicFilter, MusicSearch>(
    refForm,
    initialState,
    getMusicService(),
    inputSearch(),
    p
  );

  component.viewable = true;
  component.editable = true;
  const edit = (e: OnClick, id: string) => {
    e.preventDefault();
    navigate(`edit/${id}`);
  };

  const { list } = state;

  const filter = value(state.filter);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4db6ac",
      },
    },
  });

  return (
    <div className="view-container">
      <header>
        <h2>Musics</h2>
        <div className="btn-group">
          {component.view !== "table" && (
            <button
              type="button"
              id="btnTable"
              name="btnTable"
              className="btn-table"
              data-view="table"
              onClick={changeView}
            />
          )}
          {component.view === "table" && (
            <button
              type="button"
              id="btnListView"
              name="btnListView"
              className="btn-list-view"
              data-view="listview"
              onClick={changeView}
            />
          )}
          {component.addable && (
            <Link id="btnNew" className="btn-new" to="add" />
          )}
        </div>
      </header>
      <div>
        {/* Search */}
        <form
          id="musicsForm"
          name="musicsForm"
          noValidate={true}
          ref={refForm as any}
        >
          <section className="row search-group">
            <Search
              className="col s12 m6 search-input"
              size={component.pageSize}
              sizes={component.pageSizes}
              pageSizeChanged={pageSizeChanged}
              onChange={updateState}
              placeholder={resource.keyword}
              toggle={toggleFilter}
              value={filter.q || ""}
              search={search}
              clear={clearQ}
            />
            <Pagination
              className="col s12 m6"
              total={component.total}
              size={component.pageSize}
              max={component.pageMaxSize}
              page={component.pageIndex}
              onChange={pageChanged}
            />
          </section>
          {/* Search input */}
          <section
            className="row search-group inline"
            hidden={component.hideFilter}
          >
            <label className="col s12 m4 l3">
              Id
              <input
                type="text"
                id="id"
                name="id"
                value={filter.id || ""}
                onChange={updateState}
                maxLength={255}
                placeholder="Id"
              />
            </label>
            <label className="col s12 m4 l3">
              Name
              <input
                type="text"
                id="name"
                name="name"
                value={filter.name || ""}
                onChange={updateState}
                maxLength={255}
                placeholder="Name"
              />
            </label>

            <label className="col s12 m4 l3">
              Lyric
              <input
                type="textarea"
                id="lyric"
                name="lyric"
                value={filter.lyric || ""}
                onChange={updateState}
                maxLength={255}
                placeholder="Lyric"
              />
            </label>
            {/* <label className="col s12 m4 l3">
              Price from
              <input
                type="number"
                id="durationmin"
                name="durationmin"
                value={filter.duration?.min || ""}
                onChange={(e: any) => {
                  const value = e.currentTarget.value || "";
                  setState({
                    filter: {
                      ...filter,
                      duration: { ...filter.duration, min: parseInt(value) },
                    },
                  });
                }}
                maxLength={255}
                placeholder="Price"
              />
            </label>
            <label className="col s12 m4 l4">
              to
              <input
                type="number"
                id="durationmax"
                name="durationmax"
                value={filter.duration?.max || ""}
                onChange={(e: any) => {
                  const value = e.currentTarget.value || "";
                  setState({
                    filter: {
                      ...filter,
                      duration: { ...filter.duration, max: parseInt(value) },
                    },
                  });
                  console.log(value, state);
                }}
                maxLength={255}
                placeholder="Price"
              />
            </label> */}
    
            <label className="col s12 m4 l3">
              Author
              <Autocomplete
                options={[]}
                multiple
                id="tags-filled"
                freeSolo
                value={authors}
                onChange={(e: any, newValue: string[]) => {
                  if (newValue.length > -1) {
                    setAuthors(newValue);
                    setState({ filter: { ...filter, author: newValue } });
                  }
                }}
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
                renderInput={(params: any) => (
                  <ThemeProvider theme={theme}>
                    <TextField
                      {...params}
                      variant="standard"
                      name="authors"
                      color="primary"
                    />
                  </ThemeProvider>
                )}
              />
            </label>
          </section>
        </form>
        {/* Musics Output */}
        <form className="list-result">
          {component.view === "table" && (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field="id">
                      <button type="button" id="sortId" onClick={sort}>
                        Id
                      </button>
                    </th>
                    <th data-field="name">
                      <button type="button" id="sortTitle" onClick={sort}>
                        Name
                      </button>
                    </th>
                    <th data-field="author">
                      <button type="button" id="sortAuthor" onClick={sort}>
                        Author
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list &&
                    list.length > 0 &&
                    list.map((music, i) => {
                      return (
                        <tr key={i} onClick={(e: any) => edit(e, music.id)}>
                          <td className="text-right">
                            {(music as any).sequenceNo}
                          </td>
                          <td>{music.id}</td>
                          <td>
                            <Link to={`edit/${music.id}`}>{music.name}</Link>
                          </td>
                          <td>{music.author}</td>
                          {/* <td>{music.releaseDate ? music.releaseDate : ''}</td> */}
                          {/* <td>{music.duration}</td> */}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
          {component.view !== "table" && (
            <ul className="row list-view">
              {list &&
                list.length > 0 &&
                list.map((music, i) => {
                  return (
                    <li key={i} className="col s12 m6 l4 xl3">
                      <section>
                        <div>
                          <h3>{music.name}</h3>
                          {music.author && (
                            music.author.map((c: any, i: number) => {
                              return <Chip key={i} label={c} size="small" />;
                            })
                          )}
                          {/* <p>{music.duration}</p> */}
                        </div>
                        <button
                          className="btn-detail"
                          onClick={(e: any) => edit(e, music.id)}
                        />
                      </section>
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
