import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFilm, useFilmComment, useFilmRate, useFilmReaction, useFilmSearchRate } from "./service";
import { Film } from "./service/film";
import { OverviewFilm } from "./overview";
import { Review } from "../review";
import { storage } from "uione";

export const FilmForm = () => {
  const { id = "" } = useParams();
  const filmService = useFilm();
  const rateService = useFilmRate();
  const searchRateService = useFilmSearchRate()
  const reactionService = useFilmReaction();
  const commentService = useFilmComment();

  const userId: string | undefined = storage.getUserId() || "";
  const [film, setFilm] = useState<Film>();

  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  useEffect(() => {
    getFilm(id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getFilm = async (id: string) => {
    const currentFilm = await filmService.load(id);
    if (currentFilm) {
      setFilm(currentFilm);
      setUploadedAvatar(currentFilm?.imageURL);
    }
  };

  return (
    <div className="profile view-container">
      <form id="filmForm" name="filmForm">
        <header className="border-bottom-highlight">
          <div className="cover-image">
            <img
              alt=""
              src="https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg"
            />
          </div>
          <div className="avatar-wrapper">
            <img className="avatar" alt="" src={film?.imageURL} />
          </div>
          <div className="profile-title">
            <h3>{film?.title}</h3>
          </div>
          <br />
          <nav className="menu">
            <ul>
              <li>
                <Link to={`/films/${id}`}> Overview </Link>
              </li>
              <li>
                <Link to={`/films/${id}/review`}> Review </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className="row">
          <OverviewFilm film={film} />
          <Review i={film} get={getFilm} id={id} userId={userId} rateRange={10} searchRateService={searchRateService} rateService={rateService} reactionService={reactionService} commentService={commentService}/>
        </div>
      </form>
    </div>
  );
};


