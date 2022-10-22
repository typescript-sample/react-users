import { Item } from 'onecore';
import * as React from 'react';
import { checked, OnClick, Search, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import { getJobsService, Job, JobFilter } from './service';

import {
    Chip,
    TextField,
    Autocomplete,
    ThemeProvider,
    createTheme,
} from "@mui/material";

interface JobSearch extends SearchComponentState<Job, JobFilter> {

}
const jobFilter: JobFilter = {
    id: '',
    title:'',
    description: '',
    q: ''
};
const initialState: JobSearch = {
    filter: jobFilter
};

export const JobsForm = () => {
    const navigate = useNavigate();
    const refForm = React.useRef();
    const [categories, setCategories] = React.useState<string[]>([]);
    const getFilter = (): JobFilter => {
        return value(state.filter);
    };
    const p = { getFilter };
    const { state, resource, component, updateState, search, sort, setState, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<Job, JobFilter, JobSearch>(refForm, initialState, getJobsService(), inputSearch(), p);
    const edit = (e: OnClick, id: string) => {
        console.log(id)
        e.preventDefault();
        navigate(`edit/${id}`);
    };
    const view = (e: OnClick, id: string) => {
        console.log(id)
        e.preventDefault();
        navigate(`view/${id}`);
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
                    {/* {component.addable && <Link id='btnNew' className='btn-new' to='add' />} */}
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
                        <label className='col s12 m4 l4'>
                            {'Title'}
                            <input type='text'
                                id='title' name='title'
                                value={filter.title || ''}
                                onChange={updateState}
                                maxLength={255}
                                placeholder='Title' />
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
                        <label className='col s12 m4 l4'>
                        {'Skill'}
                        <Autocomplete
                            options={[]}
                            multiple
                            id="tags-filled"
                            freeSolo
                            value={filter.skill || categories}
                            onChange={(e: any, newValue: string[]) => {
                                if (newValue.length > -1) {
                                    setCategories(newValue)
                                    setState({
                                        filter: {
                                            ...filter,
                                            skill: newValue,
                                        },
                                    });
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
                                            <tr key={i} >
                                                <td className='text-right'>{(item as any).sequenceNo}</td>
                                                <td>{item.id}</td>
                                                <td><Link to={`edit/${item.id}`}>{item.title}</Link></td>
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
                                    <li key={i} className='col s12 m6 l4 xl3'  >
                                        <section>
                                            <div onClick={e => view(e, item.id)}>
                                                <p>{item.title}</p>
                                                <p>Quantity {item.quantity}</p>
                                                <p>{`Expiration date ${item.expiredAt?.getDate()}/${item.expiredAt?.getMonth()}/${item.expiredAt?.getFullYear()} `}</p>
                                                {item.skill ? (
                                                    item.skill.map((c: any, i: number) => {
                                                        return <Chip key={i} label={c} size="small" />;
                                                    })
                                                ) : (
                                                    <span></span>
                                                )}
                                            </div>
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