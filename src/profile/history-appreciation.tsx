import moment from 'moment';
import { useEffect, useState } from 'react';
import { Histories } from './service/appreciation';
import "./appreciation.css";

interface Props {
  closeModal: () => void;
  data?: Histories[];
}

export const HistoryAppreciation = ({ data, closeModal}: Props) => {
  const [histories, setHistories] = useState<Histories[]>([]);

  useEffect(() => {
    setHistories(data ?? []);
  }, [data]);
  
  const close = async (event: any) => {
    closeModal();
    return;
  };

  return (
    <div className='view-container'>
      <form
        id='addNewRate'
        name='addNewRate'
        model-name='addNewRate'
      // ref="form"
      >
        <header>
          <button
            type='button'
            id='btnClose'
            name='btnClose'
            className='btn-close'
            onClick={() => closeModal()}
          />
          <h2>History</h2>
        </header>
        <div>
          {
            histories.map((h: Histories, index: number) => (
              <section className='section-appreciate' key={index}>
                <div>{moment(h.time).format('DD/MM/YYYY')}</div>
                {/* <input type={'text'} className='input-appreciate' placeholder='Title' value={h.title}  /> */}
                <textarea style={{ height: 50 }} className='input-appreciate' placeholder='Description' defaultValue={h.review} />
              </section>
            ))
          }

        </div>
        <footer>
          <button
            type='submit'
            id='btnSave'
            name='btnSave'
            onClick={(event) => close(event)}
          >
            Close
          </button>
        </footer>
      </form>
    </div>
  );
};
