
import { useState } from 'react';
import { PageSizeSelect } from 'react-hook-core';
import { storage } from 'uione';
import { RateItem } from '../rate-item';
import { Rates } from '../service/rate';
import { Sort } from '../sort';
import "../../rate.css";

export interface Props {
  state: any;
  component: any;
  pageSizeChanged: any;
  pageChanged: any;
  load: any;
  doSearch: any;
  reactionService: any;
  setIsOpenRateModal: any;
}

const RateList = (props: Props) => {
  const [maxLengthReviewText] = useState(100);
  const [resource] = useState(storage.resource().resource());
  const {
    state,
    component,
    pageSizeChanged,
    pageChanged,
    load,
    doSearch,
    reactionService,
    setIsOpenRateModal
  } = props;
  
  const list = state.list;
  component.sortField = "time desc";
  component.pageMaxSize = Math.ceil(Number(component.total) / Number(component.pageSize));

  const backPage = () => {
    const page = component.pageIndex || 1;
    const size = component.pageSize || 24;
    if (page !== 1) {
      pageChanged({
        page: page - 1,
        size: size,
      });
    }
  };

  const nextPage = () => {
    const page = component.pageIndex || 1;
    const size = component.pageSize || 24;
    console.log(page, size)
    if (page < Math.ceil(Number(component.total) / size)) {
      pageChanged({
        page: page + 1,
        size: size,
      });
    }
  };

  return (
    <>
      <div className='filter-area'>
        <div className='left'>
          <div className='filter-title'>Reviews</div>
          <div className="filter">
            <PageSizeSelect
              size={component.pageSize}
              sizes={component.pageSizes}
              onChange={(e) => pageSizeChanged(e)}
              id="page-select-rate"
            />
            <Sort doSearch={doSearch} />
          </div>
        </div>
        <div className='right'>
          <div className='btn-review' onClick={() => setIsOpenRateModal(true)}>Review</div>
        </div>
      </div>
      <ul className='row list-view'>
        {
          (
            list && list.length > 0 &&
            (list.map((value: Rates) => {
              return <RateItem
                data={value}
                key={value.author}
                maxLengthReviewText={maxLengthReviewText}
                resource={resource}
                load={load}
                reactionService={reactionService}
              />;
            }) || '')
          )
        }
      </ul>
      {component.pageMaxSize > 1 && (
        <>
          <button className="btn-rate-page" onClick={() => backPage()}>
            Back
          </button>
          <button className="btn-rate-page" onClick={() => nextPage()}>
            Next
          </button>
        </>
      )}
    </>
  )
}

export default RateList;