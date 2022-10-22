import { useEffect, useRef, useState } from "react";
import { PageSizeSelect, SearchComponentState, useSearch } from "react-hook-core";
import { inputSearch, storage } from "uione";
import { Sort } from "../article/sort";
import { CommentItem } from "../review";
import './appreciation.css';
import { AppreciationItem } from "./appreciationItem";
import { PostAppreciationForm } from "./postAppreciation";
import { useAppreciation } from "./service";
import { Appreciation, AppreciationFilter } from "./service/appreciation";

export interface Props {
  id: string;
  userId: string;
}

interface AppreciationSearch extends SearchComponentState<Appreciation, AppreciationFilter> { }

export const ApprecitaionPage = (props: Props) => {
  const { id, userId } = props;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const refForm = useRef();
  const appreciationService = useAppreciation();
  const [appreciation, setAppreciation] = useState<Appreciation[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const appreciationFilter: AppreciationFilter = {
    id: id,
    userId: userId
  };

  const initialState: AppreciationSearch = {
    list: [],
    filter: appreciationFilter,
  };

  const { state,
    resource,
    component,
    doSearch,
    pageChanged,
    setComponent } = useSearch<Appreciation, AppreciationFilter, AppreciationSearch>(
      refForm,
      initialState,
      appreciationService,
      inputSearch());

  const list = state.list || [];

  useEffect(() => { setAppreciation(list) }, [list]);

  state.filter = {
    ...state.filter,
    id: id,

  };

  const load = async (sortBy: string, n?: number) => {
    console.log({ sortBy });

    state.filter = {
      id: id,
      sort: sortBy,
      pageSize: n,
    }
    component.sortField = "time desc";
    const res = await appreciationService.search(state.filter);
    setAppreciation(res.list);
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

  component.sortField = "time desc";
  component.pageMaxSize = Math.ceil(Number(component.total) / Number(component.pageSize));

  const postAppreciation = async (review: string): Promise<void> => {
    const appreciation: Appreciation = { id: id, author: userId, review: review, replyCount: 0 }
    const res = await appreciationService.appreciation(appreciation);
    setIsOpenModal(false);
    load('time desc');
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
      <div className='row top-content sort-content'>
        <section className='section-appreciate'>
          <div className='btn-appreciate' onClick={() => setIsOpenModal(!isOpenModal)}>Appreciate</div>
          <div className='search-group'>
            <PageSizeSelect
              size={component.pageSize}
              sizes={component.pageSizes}
              onChange={(e) => pageSizeChanged(e)}
              id="page-select-rate"
            />
            <Sort load={load} />

          </div>
        </section>
      </div>

      <ul className="row list-view">
        {appreciation &&
          appreciation.length > 0 &&
          appreciation.map((i: any) => {
            return (
              <AppreciationItem
                key={i.time}
                id={id}
                userId={userId}
                data={i}
                resource={resource}
                setIsOpenModal={setIsOpenModal}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
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


      <PostAppreciationForm
        isOpenModal={isOpenModal}
        close={() => setIsOpenModal(false)}
        postAppreciation={postAppreciation}
        isEdit={isEdit}
      />

    </>
  )
}