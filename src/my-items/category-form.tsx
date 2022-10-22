import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { inputEdit, Status } from 'uione';
import { getCategory } from './service';
import { Category } from './service/category';

const initialState: InternalState = {
  category: {} as Category
};
interface InternalState {
  category: Category;
}

const createCategory = (): Category => {
  const category = createModel<Category>();
  category.status = Status.Active;
  return category;
};
const initialize = async (categoryId: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
  load(categoryId);
};
const param: EditComponentParam<Category, string, InternalState> = {
  createModel: createCategory,
  initialize
};

export function ItemCategoryForm() {
  const refForm = React.useRef();
  const { resource, state, setState, back, flag, updateState, save } = useEdit<Category, string, InternalState>(refForm, initialState, getCategory(), inputEdit(), param);
  return (
    <div className='view-container'>
      <form id='categoryForm' name='categoryForm' model-name='category' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{flag.newMode ? resource.create : resource.edit} category</h2>
        </header>
        <div>
          <section className='row'>
            <label className='col s12 m6'>
              {resource.category_id}
              <input type='text'
                id='categoryId' name='categoryId'
                value={state.category.categoryId}
                onChange={updateState}
                maxLength={20} required={true}
                readOnly={!flag.newMode}
                placeholder={resource.category_id} />
            </label>
            <label className='col s12 m6'>
              {resource.category_name}
              <input type='text'
                id='categoryName' name='categoryName'
                value={state.category.categoryName}
                onChange={updateState}
                maxLength={255}
                required={true}
                placeholder={resource.category_name} />
            </label>
            <div className='col s12 m6 radio-section'>
              {resource.status}
              <div className='radio-group'>
                <label>
                  <input
                    type='radio'
                    id='active'
                    name='status'
                    onChange={(e) => updateState(e, () => setState)}
                    value='A' checked={state.category.status === 'A'} />
                  {resource.active}
                </label>
                <label>
                  <input
                    type='radio'
                    id='inactive'
                    name='status'
                    onChange={(e) => updateState(e, () => setState)}
                    value='I' checked={state.category.status === 'I'} />
                  {resource.inactive}
                </label>
              </div>
            </div>
          </section>
        </div>
        <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={save}>
              {resource.save}
            </button>}
        </footer>
      </form>
    </div>
  );
}
