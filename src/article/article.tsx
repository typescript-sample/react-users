import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RatingStar } from "reactx-rate";
import { inputSearch, storage } from 'uione';
import { Rate, RateFilter } from "../review/client";
import { DataPostRate, PostRateForm } from "../review/postRate";
import { PageSizeSelect, SearchComponentState, useSearch } from 'react-hook-core';
import { Review } from './reviews';
import { Article, useArticle, useArticleComment, useArticleRate, useArticleReaction } from './service';
import { Sort } from './sort';
import { TextEditorComponent } from './text-editor';
import './article.css';

interface RateSearch extends SearchComponentState<Rate, RateFilter> { }

export const ArticleForm = () => {
  const refForm = useRef();
  const refEdit = useRef<any>();
  const [article, setArticle] = useState<Article>();
  const [rateRange, setRateRange] = useState<number>(5);
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const userId: string | undefined = storage.getUserId() || "";
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [rates, setRates] = useState<Rate[]>([]);
  const articleService = useArticle();
  const rateService = useArticleRate();
  const reactionService = useArticleReaction();
  const commentService = useArticleComment();
  
  useEffect(() => { getArticle(id ?? '') }, [id]);

  const getArticle = async (id: string) => {
    const article = await articleService.load(id);
    if (!article) {
      return <></>
    }
    setArticle(article);
  }
  const rateFilter: RateFilter = {
    id: id,
    userId: userId,
  };

  const initialState: RateSearch = {
    list: [],
    filter: rateFilter,
  }

  const {
    state,
    setComponent,
    resource,
    component,
    pageChanged
  } = useSearch<Rate, RateFilter, RateSearch>(refForm, initialState, rateService, inputSearch());

  const list = state.list || [];
  
  useEffect(() => { 
    setRates(list) }, [list]);

  if (!article) {
    return <></>;
  }

  state.filter = {
    ...state.filter,
    id: id,
    userId: userId,
  };

  component.sortField = "time desc";
  component.pageMaxSize = Math.ceil(Number(component.total) / Number(component.pageSize));

  const load = async (sortBy: string, n?: number) => {
    state.filter = {
      id: id,
      userId: userId,
      sort: sortBy,
      pageSize: n,
    }
    component.sortField = "time desc";
    const res = await rateService.search(state.filter);
    setRates(res.list);
  };

  const pageSizeChanged = async (e: any) => {
    const size = parseInt(e.currentTarget.value, 10);
    component.pageSize = size;
    component.pageIndex = 1;
    component.tmpPageIndex = 1;
    setComponent({
      pageSize: size,
      pageIndex: 1,
      tmpPageIndex: 1
    });
    await load('time desc', component.pageSize);
  }


  const postRate = async (data: DataPostRate): Promise<void> => {
    try {
      if (!userId || !article) {
        return storage.alert("Please sign in to review");
      }
      const rate: Rate = {
        rate: data.rate,
        review: data.review,
        time: new Date(),
      };
      await rateService.rate(id, userId, rate);
      storage.message("Your review is submited");
      setIsOpenRateModal(false);
      // getArticle(id);
      load('time');
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

  return (
    <div className='view-container'>

      <form id='articleForm' name='articleForm' model-name='article' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={() => navigate('/articles')} />
          <h2>Detail Article</h2>
        </header>
        <div className='row'>

          <label className='col s12 m12'>
            <b className='b-article'>{article.title}</b>
          </label>

          <label className='col s12 m12'>
            {article.description}
          </label>
          <div className="col s12 m12 rating">
            <RatingStar
              rateRange={rateRange}
              ratingText={resource.rating_text}
              setIsOpenRateModal={setIsOpenRateModal}
              setVoteStar={setVoteStar}
            />

          </div>

          <label className='col s12'>
            <TextEditorComponent ref={refEdit} html={article.content} />
          </label>
        </div>
      </form>

      <PostRateForm
        name={article.name || article.title || ""}
        rate={voteStar ?? 1}
        rateRange={rateRange}
        close={() => setIsOpenRateModal(false)}
        postRate={postRate}
        isOpenRateModal={isOpenRateModal}
      />
      <div className="filters">
        <div className="title">
          <span>
            <b>Reviews</b>
          </span>
        </div>

        <div className="filter">
          <PageSizeSelect
            size={component.pageSize}
            sizes={component.pageSizes}
            onChange={(e) => pageSizeChanged(e)}
            id="page-select-rate"
          />
          <Sort load={load} />
        </div>
      </div>
      <Review
        id={id}
        list={rates}
        resource={resource}
        reactionService={reactionService}
        commentService={commentService}
        userId={userId}
        rateRange={rateRange}
      />
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
    </div>
  );
};
