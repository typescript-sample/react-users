import { Item } from 'onecore';
import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { formatPhone } from 'ui-plus';
import { emailOnBlur, Gender, handleError, handleSelect, inputEdit, options, phoneOnBlur, requiredOnBlur, Status } from 'uione';
import { getCompanyService, Company, getCompanyCategoriesService } from './service';
import { TextField, Autocomplete } from "@mui/material";
import Axios from "axios";
import { HttpRequest } from "axios-core";
import { useNavigate } from 'react-router-dom';

const httpRequest = new HttpRequest(Axios, options);
interface InternalState {
  company: Company;
  categoryList: string[];
  showAutocomplete: boolean;
}

const initialState: InternalState = {
  company: {} as Company,
  categoryList: [],
  showAutocomplete: false,
};
const createCompany = (): Company => {
  const company = createModel<Company>();
  return company;
};
const initialize = (
  id: string | null,
  load: (id: string | null) => void,
  set: DispatchWithCallback<Partial<InternalState>>
) => {
  const categoryService = getCompanyCategoriesService();
  categoryService.getAllCompanyCategories().then((allCompanyCategories) => {
    const categoryList: string[] = [];
    for (const item of allCompanyCategories.list) {
      categoryList.push(item.categoryName);
    }
    load(id);
    set({ categoryList, showAutocomplete: true });
  });
};
const param: EditComponentParam<Company, string, InternalState> = {
  createModel: createCompany,
  initialize
};

export const CompanyForm = () => {
  const refForm = React.useRef();
  const navigate = useNavigate();
  const { resource, state, setState, updateState, flag, save, back } = useEdit<Company, string, InternalState>(refForm, initialState, getCompanyService(), inputEdit(), param);
  const company = state.company;
  const isUpload = React.useMemo(() => window.location.pathname.includes('upload'), [window.location.pathname])

  return (
    <div className='view-container'>
      <form id='userForm' name='userForm' model-name='company' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{flag.newMode ? resource.create : resource.edit} {'Company'}</h2>
          {(!isUpload && !flag.newMode) && <button className='btn-group btn-left'><i onClick={() => navigate('upload')} className='material-icons'>photo</i></button>}
        </header>
        <div className="row">
          <label className='col s12 m6'>
            <h2>Id</h2>
            <input
              type='text'
              id='id'
              name='id'
              readOnly={!flag.newMode}
              value={company.id || ''}
              onChange={updateState}
              maxLength={20} required={true}
              placeholder='Id' />
          </label>
          <label className='col s12 m6'>
            <h2>Name</h2>
            <input
              type='text'
              id='name'
              name='name'
              value={company.name || ''}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={40} required={true}
              placeholder='Name' />
          </label>
          <label className='col s12 m6'>
            <h2>
              Size
            </h2>
            <input
              type='number'
              id='size'
              name='size'
              value={company.size || ''}
              onChange={(e: any) => {
                const value = e.currentTarget.value || "";
                setState({
                  company: {
                    ...company,
                    size: parseInt(value),
                  },
                });
              }}
              onBlur={requiredOnBlur}
              maxLength={40} required={true}
              placeholder={resource.size} />
          </label>
          <div className="col s12 m6 radio-section">
            {resource.status}
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  id="active"
                  name="status"
                  onChange={(e) => updateState(e, () => setState)}
                  value="A"
                  checked={company.status === "A"}
                />
                {resource.active}
              </label>
              <label>
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  onChange={(e) => updateState(e, () => setState)}
                  value="I"
                  checked={company.status === "I"}
                />
                {resource.inactive}
              </label>
            </div>
          </div>
          <label className='col s12 m6'>
            <h2>Description</h2>
            <input
              type='text'
              id='description'
              name='description'
              value={company.description || ''}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={40} required={true}
              placeholder={resource.description} />
          </label>
          <label className='col s12 m6'>
            <h2>Address</h2>
            <input
              type='text'
              id='address'
              name='address'
              value={company.address || ''}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={40} required={true}
              placeholder={resource.address} />
          </label>
          <label className="col s12 m6">
            {((!flag.newMode && company.categories) || flag.newMode) && (
              <Autocomplete
                multiple={true}
                options={state.categoryList}
                value={company.categories}
                onChange={(e, newValue) => {
                  const newItem = { ...company, categories: newValue };
                  setState({ company: newItem }, () => { });
                }}
                filterSelectedOptions={true}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="categories"
                    placeholder="category"
                  />
                )}
              />
            )}
          </label>
        </div>
        <footer>
          <button type='submit' id='btnSave' name='btnSave' onClick={save}>
            Save
          </button>
        </footer>
      </form>
    </div>
  )
}
