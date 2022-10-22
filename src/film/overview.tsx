import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import { Film } from "./service/film";


export interface Props {
  film: Film | undefined;
}

export const OverviewFilm = ({ film }: Props) => {
  const locationPath = useLocation();

  if (film && locationPath.pathname.split("/").length === 3) {
    return (
      <>
        <div className="col m12 l4">
          {film.directors && film.directors.length > 0 && (
            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">person</i>
                <p>Directors</p>
              </header>
              <section className="row">
                {film.directors.map((item, index) => {
                  return (
                    <span key={index} className="col s4">
                      {item}
                    </span>
                  );
                })}
              </section>
            </div>
          )}
          {film.casts && film.casts.length > 0 && (
            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">person</i>
                <p>Cast</p>
              </header>
              <section className="row">
                {film.casts.map((item, index) => {
                  return (
                    <span key={index} className="col s4">
                      {item}
                    </span>
                  );
                })}
              </section>
            </div>
          )}
          {film.productions && film.productions.length > 0 && (
            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">business</i>
                <p>Productions</p>
              </header>
              <section className="row">
                {film.productions.map((item, index) => {
                  return (
                    <span key={index} className="col s4">
                      {item}
                    </span>
                  );
                })}
              </section>
            </div>
          )}
        </div>
        <div className="col m12 l8">
          {film.countries && film.countries.length > 0 && (
            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">apartment</i>
                <p>Countries</p>
              </header>
              <section className="row">
                {film.countries.map((item, index) => {
                  return (
                    <span key={index} className="col s4">
                      {item}
                    </span>
                  );
                })}
              </section>
            </div>
          )}
          {film.categories && film.categories.length > 0 && (
            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">flash_on</i>
                Categories
              </header>
              <section className="row">
                {film.categories.map((item, index) => {
                  return (
                    <span key={index} className="col s4">
                      {item}
                    </span>
                  );
                })}
              </section>
            </div>
          )}
        </div>
      </>
    );
  }
  return <div></div>;
};
