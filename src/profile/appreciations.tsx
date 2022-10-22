import { Item } from 'onecore';
import React, { useMemo, useState } from 'react';
import { OnClick, PageSizeSelect, SearchComponentState, useSearch } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import Pagination from 'reactx-pagination';
import { inputSearch, storage } from 'uione';
import { Replys } from './appreciation';
import './appreciation.css';
import { PostRateForm } from './post-appreciation-form';
import { useAppreciation } from './service';
import { Appreciation, AppreciationFilter } from './service/appreciation';

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};
const userId = storage.getUserId() || ''
interface AppreciationSearch extends SearchComponentState<Appreciation, AppreciationFilter> {
  statusList: Item[];
}
ReactModal.setAppElement('#root');
export const Appreciations = () => {
  const params = useParams();
  const initialState = useMemo(() => {
    return {
      statusList: [],
      list: [],
      filter: {
        id: params.id,
        limit: 12,
        firstLimit: 12
      }
    } as AppreciationSearch
  }, [])
  const refForm = React.useRef();
  const appreciationService = useAppreciation();

  const [limit, setLimit] = useState(24);
  const [isOpenModal, setIsOpenModal] = useState(false);
  // const [resource] = useState(storage.resource().resource());
  // useEffect(() => {
  //   load();
  // }, [appreciationService]); // eslint-disable-line react-hooks/exhaustive-deps
  const { state,
    resource,
    component,
    setState,
    pageSizeChanged,
    pageChanged } = useSearch<Appreciation, AppreciationFilter, AppreciationSearch>(refForm, initialState, appreciationService, inputSearch());
  const appreciations: Appreciation[] = useMemo(() => {
    console.log("memo");

    return state.list ?? []
  }, [state.list])

  console.log({ appreciations });

  // const load = async () => {
  //   if (!appreciationService) { return; }
  //   const appreciateSM = new AppreciationFilter();
  //   const { id } = params;
  //   appreciateSM.id = id;
  //   appreciateSM.limit = limit;
  //   // appreciateSM.sort = '-rateTime';
  //   const searchResult = await appreciationService.search(appreciateSM);

  //   setAppreciations(searchResult.list);
  // };

  const openModal = async (e: OnClick) => {
    e.preventDefault();
    setIsOpenModal(true);
  };

  const setData = (data: Appreciation) => {
    const newList = [...appreciations];
    newList.unshift(data);
    setState({ ...state, list: newList });
  };

  console.log({ state });


  const moreAppreciate = async (e: any) => {
    if (!appreciationService) { return; }
    e.preventDefault();
    const appreciateSM = new AppreciationFilter();
    const { id } = params;
    appreciateSM.id = id;
    appreciateSM.limit = limit + 3;
    const searchRates = await appreciationService.search(appreciateSM);
    setState({ ...state, list: searchRates.list });
    setLimit(limit + 3);
  };

  const handleDeleteAppreciation = (appreciation: Appreciation) => {
    const newAppreciations = appreciations.filter(data => data.id !== appreciation.id);
    setState({ ...state, list: newAppreciations });
  };

  const handleSort = () => {
  };

  if (window.location.pathname.includes('appreciation')) {
    return (
      <>

        <form id='usersForm' name='usersForm' noValidate={true} ref={refForm as any}>
          <input type='hidden'
            id='id' name='id'
            value={params.id}
          // onChange={updateState}
          />
        </form>
        <div className='row top-content sort-content'>
          <section className='section-appreciate'>
            {/* <input type={"text"} className="input-appreciate" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
              <input type={"text"} className="input-appreciate" placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} /> */}
            <button className='button-appreciation ' onClick={openModal}>Appreciate</button>
            <div className='search-group'>
              <label className='search-input'>
                <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
              </label>
              <select className='comments-sort btn button' onChange={handleSort} defaultValue={'relevance'}>
                <option value='relevance'>Top Reply</option>
                <option value='time'>Newest First</option>
              </select>
            </div>
          </section>

        </div>


        <div className='title'>
          <span><b>{resource.reviews}</b></span>
        </div>
        <ul className='row list-view'>
          {
            appreciations && appreciations.length > 0 &&
            (appreciations.map((value: Appreciation, index) => {
              return <Replys deletedAppreciation={handleDeleteAppreciation} replyAppreciation={false} dataAppreciation={value} key={index} />;
            }) || '')
          }
        </ul>
        {/* <div className='col s12 m12 l12 more-reviews-div'>
            <span className='more-reviews' onClick={moreAppreciate}>
              <b>MORE REVIEWS</b>
            </span></div> */}

        <ReactModal
          isOpen={isOpenModal}
          style={customStyles}
          onRequestClose={() => setIsOpenModal(false)}
          contentLabel='Modal'
          portalClassName='modal-portal'
          className='modal-portal-content small-width'
          bodyOpenClassName='modal-portal-open'
          overlayClassName='modal-portal-backdrop'>
          <PostRateForm isReply={false} isEdit={false} setDataAppreciation={setData} closeModal={() => setIsOpenModal(false)} />
        </ReactModal>
      </>
    );
  }
  return null;
};
