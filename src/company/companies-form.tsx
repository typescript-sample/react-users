import * as React from 'react';
import { Autocomplete, Chip, createTheme, TextField, ThemeProvider } from "@mui/material";
import { checked, OnClick, Search, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import { Company, CompanyFilter, getCompanyService } from './service';

interface CompanySearch extends SearchComponentState<Company, CompanyFilter> {

}
const companyFilter: CompanyFilter = {
  id: '',
  name: '',
  description: '',
  status: "",
  categories: [],
  size: {
    max: undefined,
    min: undefined,
  },
  q: ''
};
const initialState: CompanySearch = {
  filter: companyFilter
};

export const CompaniesFormClient = () => {
  const navigate = useNavigate();
  const refForm = React.useRef();
  const [categories, setCategories] = React.useState<string[]>([]);
  const getFilter = (): CompanyFilter => {
    return value(state.filter);
  };
  const p = { getFilter };
  const { state, resource, component, updateState, search, sort, setState, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<Company, CompanyFilter, CompanySearch>(refForm, initialState, getCompanyService(), inputSearch(), p);
  const edit = (e: OnClick, id: string) => {
    e.preventDefault();
    navigate(`${id}`);
  };
  const { list } = state;
  const theme = createTheme({
    palette: {
      primary: {
        main: "#4db6ac",
      },
    },
  });
  const filter = value(state.filter);
  return (
    <div className='view-container'>
      <header>
        <h2>Companies</h2>
        <div className='btn-group'>
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
          {component.addable && <Link id='btnNew' className='btn-new' to='add' />}
        </div>
      </header>
      <div>
        <form id='usersForm' name='usersForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group'>
            <Search className='col s12 m6 search-input'
              size={component.pageSize}
              sizes={component.pageSizes}
              pageSizeChanged={pageSizeChanged}
              onChange={updateState}
              placeholder={resource.keyword}
              toggle={toggleFilter}
              value={filter.q || ""}
              search={search}
              clear={clearQ}
            />
            <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
          </section>
          <section className='row search-group inline' hidden={component.hideFilter}>
            <label className="col s12 m4 l3">
              Id
              <input
                type="text"
                id="id"
                name="id"
                value={filter.id || ""}
                onChange={updateState}
                maxLength={255}
                placeholder="Id"
              />
            </label>
            <label className='col s12 m4 l4'>
              {'Name'}
              <input type='text'
                id='name' name='name'
                value={filter.name || ''}
                onChange={updateState}
                maxLength={255}
                placeholder='Name' />
            </label>
            <label className="col s12 m4 l4 checkbox-section">
              {resource.status}
              <section className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    id="A"
                    name="status"
                    value="A"
                    checked={checked(filter.status, "A")}
                    onChange={updateState}
                  />
                  {resource.active}
                </label>
                <label>
                  <input
                    type="checkbox"
                    id="I"
                    name="status"
                    value="I"
                    checked={checked(filter.status, "I")}
                    onChange={updateState}
                  />
                  {resource.inactive}
                </label>
              </section>
            </label>
            <label className='col s12 m4 l4'>
              {'Description'}
              <input type='text'
                id='description' name='description'
                value={filter.description || ''}
                onChange={updateState}
                maxLength={255}
                placeholder='Description' />
            </label>
            <label className="col s12 m4 l4">
              Size from
              <input
                type="number"
                id="pricemin"
                name="pricemin"
                value={filter.size?.min || ""}
                onChange={(e: any) => {
                  const value = e.currentTarget.value || "";
                  setState({
                    filter: {
                      ...filter,
                      size: { ...filter.size, min: parseInt(value) },
                    },
                  });
                }}
                maxLength={255}
                placeholder="Size"
              />
            </label>
            <label className="col s12 m4 l3">
              to
              <input
                type="number"
                id="pricemax"
                name="pricemax"
                value={filter.size?.max || ""}
                onChange={(e: any) => {
                  const value = e.currentTarget.value || "";
                  setState({
                    filter: {
                      ...filter,
                      size: { ...filter.size, max: parseInt(value) },
                    },
                  });
                }}
                maxLength={255}
                placeholder="Size"
              />
            </label>
            <label className="col s12 m12 l3">
              Categories
              <Autocomplete
                options={[]}
                multiple
                id="tags-filled"
                freeSolo
                value={categories}
                onChange={(e: any, newValue: string[]) => {
                  if (newValue.length > -1) {
                    setCategories(newValue);
                    setState({ filter: { ...filter, categories: newValue } });
                  }
                }}
                renderTags={(v: readonly string[], getTagProps: any) =>
                  v.map((option: string, i: number) => (
                    <Chip
                      key={i}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ i })}
                    />
                  ))
                }
                renderInput={(params: any) => (
                  <ThemeProvider theme={theme}>
                    <TextField
                      {...params}
                      variant="standard"
                      name="categories"
                      color="primary"
                      label={resource.categories}
                      placeholder={resource.categories}
                    />
                  </ThemeProvider>
                )}
              />
            </label>
          </section>
        </form>
        <form className='list-result'>
          {
            component.view === 'table' && <div className='table-responsive'>
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field='id'><button type='button' id='sortId' onClick={sort}>Id</button></th>
                    <th data-field='name'><button type='button' id='sortName' onClick={sort}>Name</button></th>
                    <th data-field='desciption'><button type='button' id='sortDesciption' onClick={sort}>Description</button></th>
                  </tr>
                </thead>
                <tbody>
                  {list && list.length > 0 && list.map((item, i) => {

                    return (
                      <tr key={i} onClick={e => edit(e, item.id)}>
                        <td className='text-right'>{(item as any).sequenceNo}</td>
                        <td>{item.id}</td>
                        <td><Link to={`edit/${item.id}`}>{item.name}</Link></td>
                        <td>{item.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          }
          {
            component.view !== 'table' && <ul className='row list-view'>
              {list && list.length > 0 && list.map((item, i) => {
                return (
                  <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, item.id)} >
                    <section>
                      <div>
                        <p>{item.name}</p>
                        <p>{item.description}</p>
                        <p>{item.size}</p>
                        {item.categories ? (
                          item.categories.map((c: any, i: number) => {
                            return <Chip key={i} label={c} size="small" />;
                          })
                        ) : (
                          <span></span>
                        )}
                      </div>
                      <button className='btn-detail' />
                    </section>
                  </li>
                );
              })}
            </ul>
          }
        </form>
      </div>
    </div>
  )
}