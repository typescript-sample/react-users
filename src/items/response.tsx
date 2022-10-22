import { useRef, useState } from "react";
import ReactModal from "react-modal";
import { inputSearch, storage } from "uione";
import { DataPostResponse, PostResponseForm } from "./postResponse";
import { Response, ResponseFilter } from "./service/response";
import { PageSizeSelect, SearchComponentState, useSearch } from "react-hook-core";
import { CommentService, ReactionService, Sort } from "../review";
import { ResponseItem } from "./reponseItem";
import "./item.css";
import { ResponseService } from "./service/response";

ReactModal.setAppElement("#root");

interface ResponseSearch extends SearchComponentState<Response, ResponseFilter> {}

interface Props {
  i: any;
  get: (id: string) => Promise<void>;
  id: string;
  userId: string;
  responseService: ResponseService;
  reactionService: ReactionService;
  commentService: CommentService;
}

export const ItemResponse = ({ i, get, id, userId, responseService, reactionService, commentService }: Props) => {
  const [isOpenResponseModal, setIsOpenResponseModal] = useState(false);
  const refForm = useRef();

  const responseFilter: ResponseFilter = {
    id: id,
  };

  const initialState: ResponseSearch = {
    list: [],
    filter: responseFilter,
  };

  const { state, resource, component, doSearch, pageChanged, pageSizeChanged } = useSearch<
    Response,
    ResponseFilter,
    ResponseSearch
  >(refForm, initialState, responseService, inputSearch());

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

  const postResponse = async (data: DataPostResponse): Promise<void> => {
    try {
      if (!userId || !i) {
        return storage.alert("Please sign in to response");
      }
      const response: Response = {
        description: data.description,
        time: new Date(),
      };
      await responseService.response(id, userId, response);
      storage.message("Your response is submited");
      setIsOpenResponseModal(false);
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

  return (
    <>
      <div className="row mid-content response-wrapper">
        <button
          className="button-response"
          onClick={() => {
            setIsOpenResponseModal(!isOpenResponseModal);
          }}
        >
          Response
        </button>
      </div>

      <div className="title">
        <span>
          <b>Responses</b>
        </span>
      </div>

      <Sort doSearch={doSearch} />

      <PageSizeSelect
        size={component.pageSize}
        sizes={component.pageSizes}
        onChange={pageSizeChanged}
        id="page-select-rate"
      />

      <ul className="row list-view">
        {list &&
          list.length > 0 &&
          list.map((i: any) => {
            return (
              <ResponseItem
                key={i.author}
                id={id}
                userId={userId}
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
          <button className="btn-response-page" onClick={(e) => backPage(e)}>
            Back
          </button>
          <button className="btn-response-page" onClick={(e) => nextPage(e)}>
            Next
          </button>
        </>
      )}

      <PostResponseForm
        name={""}
        close={() => setIsOpenResponseModal(false)}
        postResponse={postResponse}
        isOpenResponseModal={isOpenResponseModal}
      />
    </>
  );
};
