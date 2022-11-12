import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RatingStar } from "reactx-rate";
import { getResource, inputSearch, storage } from "uione";
import { Rate, RateFilter } from "../review/client";
import { DataPostRate, PostRateForm } from "../review/postRate";
import {
  OnClick,
  PageSizeSelect,
  SearchComponentState,
  useSearch,
} from "react-hook-core";
import { Review } from "./reviews";
import {
  Article,
  useArticle,
  useArticleComment,
  useArticleCommentReaction,
  useArticleCommentThread,
  useArticleCommentThreadReaction,
  useArticleCommentThreadReply,
  useArticleRate,
  useArticleReaction,
  useArticleSearchRate,
} from "./service";
import { Sort } from "./sort";
import { TextEditorComponent } from "./text-editor";
import "./article.css";
import {
  CommentThread,
  CommentThreadFilter,
} from "../review/client/commentthread";
import { CommentThreadComponent } from "../review/comment-threads";
import {
  DataPostComment,
  PostCommentThreadForm,
} from "../review/post-comment-thread-form";

interface RateSearch extends SearchComponentState<Rate, RateFilter> {}
interface CommentThreadSearch
  extends SearchComponentState<CommentThread, CommentThreadFilter> {}
export const ArticleForm = () => {
  const refForm = useRef();
  const refEdit = useRef<any>();
  const [article, setArticle] = useState<Article>();
  const [rateRange, setRateRange] = useState<number>(5);
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [isOpenCommentThreadModal, setIsOpenCommentThreadModal] =
    useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const userId: string | undefined = storage.getUserId() || "";
  const user = storage.user();
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [rates, setRates] = useState<Rate[]>([]);
  const [commentThreads, setCommentThreads] = useState<CommentThread[]>([]);
  const articleService = useArticle();
  const rateService = useArticleRate();
  const rateSearchService = useArticleSearchRate();
  const reactionService = useArticleReaction();
  const commentService = useArticleComment();
  const commentThreadService = useArticleCommentThread();
  const commentThreadReplyService = useArticleCommentThreadReply();
  const commentThreadReactionService = useArticleCommentThreadReaction();
  const commentRectionService = useArticleCommentReaction();
  useEffect(() => {
    getArticle(id ?? "");
  }, [id]);

  const getArticle = async (id: string) => {
    const article = await articleService.load(id);
    if (!article) {
      return <></>;
    }
    setArticle(article);
  };
  const rateFilter: RateFilter = {
    id: id,
    userId: userId,
  };

  const initialState: RateSearch = {
    list: [],
    filter: rateFilter,
  };

  const commentThreadFilter: CommentThreadFilter = {
    id: id,
    userId: userId,
  };

  const initialCommentThreadState: CommentThreadSearch = {
    list: [],
    filter: commentThreadFilter,
  };

  const { setState, state, setComponent, resource, component, pageChanged } =
    useSearch<Rate, RateFilter, RateSearch>(
      refForm,
      initialState,
      rateSearchService,
      inputSearch()
    );

  // const list = state.list || [];

  // useEffect(() => {

  //   setRates(list)
  // }, [list]);

  state.filter = {
    ...state.filter,
    id: id,
    userId: userId,
  };

  component.sortField = "time desc";
  component.pageMaxSize = Math.ceil(
    Number(component.total) / Number(component.pageSize)
  );

  const load = async (sortBy: string, n?: number) => {
    state.filter = {
      id: id,
      userId: userId,
      sort: sortBy,
      pageSize: n,
    };
    component.sortField = "time desc";
    const res = await rateSearchService.search(state.filter);

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
      tmpPageIndex: 1,
    });
    await load("time desc", component.pageSize);
  };

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
      const res = await rateService.rate(id, userId, rate);
      if (res == true) {
        rate.author = userId;
        rate.id = id;
        storage.message("Your review is submited");
        setIsOpenRateModal(false);
        setState({
          list:
            state.list && state.list.length ? [...state.list, rate] : [rate],
        });
      }
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

  const commentThreadSearch = useSearch<
    CommentThread,
    CommentThreadFilter,
    CommentThreadSearch
  >(refForm, initialCommentThreadState, commentThreadService, inputSearch());

  const loadCommentThread = async (sortBy: string, n?: number) => {
    // commentThreadSearch.setState({
    //   filter: {
    //     id: id,
    //     userId: userId,
    //     sort: sortBy,
    //     pageSize: n
    //   }
    // })

    // commentThreadSearch.search(undefined)
    const res = await commentThreadService.search({
      id: id,
      userId: userId,
      sort: sortBy,
      pageSize: n,
    });
    commentThreadSearch.setState({list: res.list})
  };

  const postCommentThread = async (data: DataPostComment): Promise<void> => {
    try {
      if (!userId || !article) {
        return storage.alert("Please sign in to comment");
      }
      const comment: CommentThread = {
        time: new Date(),
        comment: data.comment,
        commentId: "",
        author: userId,
      };
      const res = await commentThreadService.comment(id, userId, comment);
      if (res && res.length > 0) {
        comment.replyCount = 0;
        comment.usefulCount = 0;
        comment.authorName = user && user.username ? user.username : undefined;
        comment.authorURL = user && user.imageURL ? user.imageURL : undefined;
        comment.commentId = res;
        comment.disable = false;
        let list = commentThreadSearch.state.list || [];
        list.push(comment);
        commentThreadSearch.setState({ list: list });
        storage.message("Your comment is submited");
        setIsOpenCommentThreadModal(false);
      } else {
        storage.alert("error");
      }
    } catch (err) {
      storage.alert("error");
    }
  };

  if (!article) {
    return <></>;
  }

  return (
    <div className="view-container">
      <form
        id="articleForm"
        name="articleForm"
        model-name="article"
        ref={refForm as any}
      >
        <header>
          <button
            type="button"
            id="btnBack"
            name="btnBack"
            className="btn-back"
            onClick={() => navigate("/articles")}
          />
          <h2>Detail Article</h2>
        </header>
        <div className="row">
          <label className="col s12 m12">
            <b className="b-article">{article.title}</b>
          </label>

          <label className="col s12 m12">{article.description}</label>
          <div className="col s12 m12 rating">
            <RatingStar
              rateRange={rateRange}
              ratingText={resource.rating_text}
              setIsOpenRateModal={setIsOpenRateModal}
              setVoteStar={setVoteStar}
            />
          </div>

          <label className="col s12">
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
      <PostCommentThreadForm
        name={article.name || article.title || ""}
        close={() => setIsOpenCommentThreadModal(false)}
        postComment={postCommentThread}
        isOpenCommentModal={isOpenCommentThreadModal}
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
        user={user}
        id={id}
        list={state.list || []}
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
      <div className="filters">
        <div className="title">
          <span>
            <b>Comments</b>
          </span>
        </div>

        <div className="filter">
          <PageSizeSelect
            size={commentThreadSearch.component.pageSize}
            sizes={commentThreadSearch.component.pageSizes}
            onChange={(e) => commentThreadSearch.pageSizeChanged(e)}
            id="page-select-rate"
          />
          <Sort
          load={loadCommentThread}
            sort={commentThreadSearch.sort}
            data={[
              { value: "time", text: "Newest First"},
              { value: "usefulCount", text: "Top Like"},
            ]}
          />
        </div>

        <div>
          <button
            style={{
              color: "#777777",
              backgroundColor: "#fff",
              border: " 1px solid #999999",
              borderRadius: "25px",
              overflow: "hidden",
              padding: "0 !important",
              width: "max-content !important",
              display: "flex",
              height: "max-content",
            }}
            onClick={() => {
              setIsOpenCommentThreadModal(true);
            }}
          >
            Comment
          </button>
        </div>
      </div>

      {commentThreadSearch.state.list &&
        commentThreadSearch.state.list.length > 0 && (
          <CommentThreadComponent
            user={user}
            id={id}
            resource={commentThreadSearch.resource}
            list={commentThreadSearch.state.list}
            commentThreadService={commentThreadService}
            commentThreadReplyService={commentThreadReplyService}
            commentThreadReactionService={commentThreadReactionService}
            commentReactionService={commentRectionService}
            userId={userId}
            loadCommentThreads={commentThreadSearch.load}
          />
        )}
    </div>
  );
};
