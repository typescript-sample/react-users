import { useRef, useState } from "react";
import ReactModal from "react-modal";
import { inputSearch, storage } from "uione";
import { PageSizeSelect, SearchComponentState, useSearch } from "react-hook-core";

import { Rate, RateFilter, ShortRate} from "web-clients";
import {RateService, SearchRateService} from "reaction-client"
import{ ReactionService, CommentService} from "reaction-client"
import { Sort } from "./sort";
import { DataPostRate, PostRateForm } from "./postRate";
import { ReviewScore } from "reactx-rate";
import { DetailStar10, DetailStar5 } from "reactx-rate";
import { RatingStar } from "reactx-rate";
import { RateItem } from "./rateItem";
import "../rate.css";

ReactModal.setAppElement("#root");

interface RateSearch extends SearchComponentState<Rate, RateFilter> { }

interface Props {
  i: any;
  get: (id: string) => Promise<void>;
  user?:any;
  id: string;
  userId: string;
  rateRange: number;
  rateService: RateService;
  searchRateService:SearchRateService;
  reactionService: ReactionService;
  commentService: CommentService;
}

export const Review = ({ i, get, id, userId, user,rateRange, rateService, searchRateService, reactionService, commentService }: Props) => {
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const refForm = useRef();

  const rateFilter: RateFilter = {
    id: id,
  };

  const initialState: RateSearch = {
    list: [],
    filter: rateFilter,
  };

  const { state, resource, component, doSearch, pageChanged, pageSizeChanged } = useSearch<
    Rate,
    RateFilter,
    RateSearch
  >(refForm, initialState, searchRateService, inputSearch());

  const list = state.list || [];
  
  state.filter = {
    ...state.filter,
    id: id,
    userId: userId,
  };

  component.sortField = "time desc";
  component.pageMaxSize = Math.ceil(Number(component.total) / Number(component.pageSize));

  const load = () => {
    component.sortField = "time desc";
    pageChanged({
      page: 1,
      size: Number(component.pageSize),
    });
  };

  const postRate = async (data: DataPostRate): Promise<void> => {
    try {
      if (!userId || !i) {
        return storage.alert("Please sign in to review");
      }
      const rate: ShortRate = {
        rate: data.rate,
        review: data.review,
        time: new Date(),
      };
      await rateService.rate(id, userId, rate);
      storage.message("Your review is submited");
      setIsOpenRateModal(false);
      get(id);
      load();
    } catch (err) {
      storage.alert("error");
    }
  };

  const backPage = (e: any) => {
    e.preventDefault();
    const page = Number(component.pageIndex);
    if (page > 1) {
      pageChanged({
        page: page - 1,
        size: Number(component.pageSize),
      });
    }
  };

  const nextPage = (e: any) => {
    e.preventDefault();
    const page = Number(component.pageIndex);
    if (page < Number(component.pageMaxSize)) {
      pageChanged({
        page: page + 1,
        size: Number(component.pageSize),
      });
    }
  };

  if (i && window.location.pathname.includes("review")) {
    return (
      <>
        <div className="row top-content row-rate">
          {i.info && <ReviewScore rate={i.info.rate} rateRange={rateRange} />}
          <div className="col s8 m7 l6">{rateRange === 5 ? DetailStar5(i.info) : DetailStar10(i.info)}</div>
        </div>

        <div className="row mid-content row-rate">
          <RatingStar
            rateRange={rateRange}
            ratingText={resource.rating_text}
            setIsOpenRateModal={setIsOpenRateModal}
            setVoteStar={setVoteStar}
          />
        </div>

        <div className="title">
          <span>
            <b>Reviews</b>
          </span>
        </div>

        <div style={{
          border:'1px solid #999999',
          borderRadius:'25px',
          overflow:'hidden',
          marginBottom:'20px'
        }}>
          <PageSizeSelect
            size={component.pageSize}
            sizes={component.pageSizes}
            onChange={pageSizeChanged}
            id="page-select-rate"
          />
          <Sort doSearch={doSearch} />
        </div>

        <ul className="row list-view">
          {list &&
            list.length > 0 &&
            list.map((i: any) => {
              return (
                <RateItem
                user={user}
                  key={i.author}
                  id={id}
                  userId={userId}
                  rateRange={rateRange}
                  data={i}
                  resource={resource}
                  disable={i.disable}
                  reactionService={reactionService}
                  commentService={commentService}
                />
              );
            })}
        </ul>

        {component.pageMaxSize > 1 && (
          <>
            <button className="btn-rate-page" onClick={(e) => backPage(e)}>
              Back
            </button>
            <button className="btn-rate-page" onClick={(e) => nextPage(e)}>
              Next
            </button>
          </>
        )}
        
        <PostRateForm
          name={i.name || i.title || ""}
          rate={voteStar ?? 1}
          rateRange={rateRange}
          close={() => setIsOpenRateModal(false)}
          postRate={postRate}
          isOpenRateModal={isOpenRateModal}
        />
      </>
    );
  }
  return <></>;
};
