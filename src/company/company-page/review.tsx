import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { SearchComponentState, useSearch } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { inputSearch, storage } from 'uione';
import { ReviewScore } from '..//review-score';
import { DataPostRate, PostRateForm } from '../post-rate-form';
import { Company, useRate, useReaction } from '../service';
import { Rates, RatesFilter } from '../service/rate/rate';
import '../../rate.css';
import RateList from './rateList';

ReactModal.setAppElement('#root');

export interface Props {
  company: Company;
  getCompany: any;
}

interface RatesSearch extends SearchComponentState<Rates, RatesFilter> { }

export const ReviewPage = ({ company, getCompany }: Props) => {
  const params = useParams();
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const rateService = useRate();
  //const searchRateService = useSearchRate();
  const reactionService = useReaction();
  const userId: string | undefined = storage.getUserId() || '';
  const [sumArr, setSumArr] = useState<any[]>([])
  const rateCategories = ['Job Work/Life Balance', 'Compensation/Benefits', 'Job Security/Advancement', 'Management', 'Culture'];
  const { id } = params;


  const ratesFilter: RatesFilter = {
    id: id,
   // userId: userId
  };

  const initialState: RatesSearch = {
    list: [],
    filter: ratesFilter,
  };

  const refForm = useRef();

  const {
    state,
    component,
    pageChanged,
    pageSizeChanged,
    doSearch
  } = useSearch<Rates, RatesFilter, RatesSearch>(
    refForm,
    initialState,
    rateService,
    inputSearch()
  );

  state.filter = {
    ...state.filter,
    id: id,
    userId: userId
  };

  const list = state.list;
  const getAvg = (rates: any[]) => {
    let sumArr: any[] = Array(5).fill(0);
    rates.forEach(rate => {
      const rates = rate.rates;
      if (rates) {
        for (let i = 0; i < rates.length; i++) {
          sumArr[i] = sumArr[i] + rates[i]
        }
      }
    });
    sumArr = sumArr.map(item => (item / rates.length).toFixed(1))
    setSumArr(sumArr);
  }

  useEffect(() => {
    if (list) {
      getAvg(list)
    }
  }, [list])

  const mapTitleToRateNumber = (sumArr: any[]) => {
    return sumArr?.map((item, index) => {
      return { title: rateCategories[index], rate: sumArr[index]?.toString() }
    })
  }

  const load = () => {
    doSearch({ sortField: 'rate', sortType: '-' })
  };

  const postReview = async (data: DataPostRate, voteStarCate: any): Promise<void> => {
    const id: string | undefined = storage.getUserId();
    if (!id || !company) {
      return storage.alert("Please sign in to review");
    }
    const rates = data.rates;
    let hasEmpty = false;
    rates.forEach(rate => {
      if (rate === 0) {
        hasEmpty = true
      }
    })
    if (hasEmpty) {
      return storage.alert("Please vote all criteria!");
    } else {
      const rate: Rates = {};
      rate.id = company.id;
      rate.author = id;
      rate.rates = data.rates;
      rate.review = data.review;
      rate.time = new Date();
      await rateService.rate(rate);
      storage.message('Your review is submited');
      setIsOpenRateModal(false);
      getCompany(company.id);
      load();
      voteStarCate.forEach((vote: any) => {
        vote.rate = 0
      });
    }
  }

  if (company && window.location.pathname.includes('review')) {
    return (
      <>
        <div className='row top-content row-rate' onMouseEnter={()=>setIsDetail(!isDetail)} onMouseLeave={()=>setIsDetail(false)}>
          {company?.info && <ReviewScore rate={company.info.rate} />}
        </div>
        {isDetail && list && list.length > 0 && <div className='row cate-avg row-rate'>
          {mapTitleToRateNumber(sumArr).map((item, idx) => (
            <div className='cate-detail' key={idx}>
              {item.rate} <FontAwesomeIcon icon={faStar} color="gold" />
              {item.title}
            </div>
          ))}
        </div>}
        <RateList
          state={state}
          component={component}
          pageSizeChanged={pageSizeChanged}
          pageChanged={pageChanged}
          load={load}
          doSearch={doSearch}
          reactionService={reactionService}
          setIsOpenRateModal={setIsOpenRateModal}
        />
        <PostRateForm
          rate={voteStar ?? 1}
          name={company.name}
          close={() => setIsOpenRateModal(false)}
          postRate={postReview}
          isOpenRateModal={isOpenRateModal} />
      </>
    );
  }
  return <></>;
};
