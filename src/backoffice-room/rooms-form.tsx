import { Item } from 'onecore';
import * as React from 'react';
import { checked, OnClick, Search, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import { getRoomService, Room, RoomFilter } from './service';
import { Carousel, CarouselImageItem, CarouselVideoItem } from "reactx-carousel";
import {
    Chip,
    TextField,
    Autocomplete,
    ThemeProvider,
    createTheme,
} from "@mui/material";

interface JobSearch extends SearchComponentState<Room, RoomFilter> {

}
const jobFilter: RoomFilter = {
    id: '',
    title: '',
    description: '',
    price: {
        max: undefined,
        min: undefined,
    },
    // room:[],
    guest: undefined,
    bedrooms: undefined,
    bed: undefined,
    bathrooms: undefined,
    q: ''
};
const initialState: JobSearch = {
    filter: jobFilter
};

export const BRoomsForm = () => {
    const navigate = useNavigate();
    const refForm = React.useRef();
    const [room, setRoom] = React.useState<string[]>([]);
    const [offer, setOffer] = React.useState<string[]>([]);
    const [category, setCategory] = React.useState<string[]>([]);
    const [language, setLanguage] = React.useState<string[]>([]);
    const getFilter = (): RoomFilter => {
        return value(state.filter);
    };
    const p = { getFilter };
    const { state, resource, component, updateState, search, sort, setState, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<Room, RoomFilter, JobSearch>(refForm, initialState, getRoomService(), inputSearch(), p);
    const edit = (e: OnClick, id: string) => {
        console.log(id)
        e.preventDefault();
        navigate(`edit/${id}`);
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
                <h2>Room</h2>
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
                            {'Region'}
                            <input type='text'
                                id='region' name='region'
                                value={filter.region || ''}
                                onChange={updateState}
                                maxLength={255}
                                placeholder='Region' />
                        </label>
                        <label className='col s12 m4 l4'>
                            {'Property type'}
                            <input type='text'
                                id='property' name='property'
                                value={filter.property || ''}
                                onChange={updateState}
                                maxLength={255}
                                placeholder='Property type' />
                        </label>
                        <label className="col s12 m4 l4">
                            Price from
                            <input
                                type="number"
                                id="pricemin"
                                name="pricemin"
                                value={filter.price?.min || ""}
                                onChange={(e: any) => {
                                    const value = e.currentTarget.value || "";
                                    setState({
                                        filter: {
                                            ...filter,
                                            price: { ...filter.price, min: parseInt(value) },
                                        },
                                    });
                                }}
                                maxLength={255}
                                placeholder="Number"
                            />
                        </label>
                        <label className="col s12 m4 l3">
                            to
                            <input
                                type="number"
                                id="pricemax"
                                name="pricemax"
                                value={filter.price?.max || ""}
                                onChange={(e: any) => {
                                    const value = e.currentTarget.value || "";
                                    setState({
                                        filter: {
                                            ...filter,
                                            price: { ...filter.price, max: parseInt(value) },
                                        },
                                    });
                                }}
                                maxLength={255}
                                placeholder="Number"
                            />
                        </label>
                        <label className="col s12 m4 l3">
                            Guest
                            <input
                                type="number"
                                id="guest"
                                name="guest"
                                value={filter.guest || ""}
                                onChange={(e: any) => {
                                    const value = e.currentTarget.value || "";
                                    setState({
                                        filter: {
                                            ...filter,
                                            guest: parseInt(value)
                                        },
                                    });
                                }}
                                maxLength={255}
                                placeholder="Number"
                            />
                        </label>
                        <label className="col s12 m4 l3">
                            Bedrooms
                            <input
                                type="number"
                                id="bebrooms"
                                name="bedrooms"
                                value={filter.bedrooms || ""}
                                onChange={(e: any) => {
                                    const value = e.currentTarget.value || "";
                                    setState({
                                        filter: {
                                            ...filter,
                                            bedrooms: parseInt(value)
                                        },
                                    });
                                }}
                                maxLength={255}
                                placeholder="Number"
                            />
                        </label>
                        <label className="col s12 m4 l3">
                            Bed
                            <input
                                type="number"
                                id="bed"
                                name="bed"
                                value={filter.bed || ""}
                                onChange={(e: any) => {
                                    const value = e.currentTarget.value || "";
                                    setState({
                                        filter: {
                                            ...filter,
                                            bed: parseInt(value)
                                        },
                                    });
                                }}
                                maxLength={255}
                                placeholder="Number"
                            />
                        </label>
                        <label className="col s12 m4 l3">
                            Bathrooms
                            <input
                                type="number"
                                id="bathrooms"
                                name="bathrooms"
                                value={filter.bathrooms || ""}
                                onChange={(e: any) => {
                                    const value = e.currentTarget.value || "";
                                    setState({
                                        filter: {
                                            ...filter,
                                            bathrooms: parseInt(value)
                                        },
                                    });
                                }}
                                maxLength={255}
                                placeholder="Number"
                            />
                        </label>
                        {/* <label className='col s12 m4 l4'>
                            {'Rooms and beds'}
                            <Autocomplete
                                options={[]}
                                multiple
                                id="tags-filled"
                                freeSolo
                                value={filter.room || room}
                                onChange={(e: any, newValue: string[]) => {
                                    if (newValue.length > -1) {
                                        setRoom(newValue)
                                        setState({
                                            filter: {
                                                ...filter,
                                                room: newValue,
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
                        </label> */}
                        <label className='col s12 m4 l4'>
                            {'Amenities'}
                            <Autocomplete
                                options={[]}
                                multiple
                                id="tags-filled"
                                freeSolo
                                value={filter.offer || offer}
                                onChange={(e: any, newValue: string[]) => {
                                    if (newValue.length > -1) {
                                        setOffer(newValue)
                                        setState({
                                            filter: {
                                                ...filter,
                                                offer: newValue,
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
                        <label className='col s12 m4 l4'>
                            {'Category'}
                            <Autocomplete
                                options={[]}
                                multiple
                                id="tags-filled"
                                freeSolo
                                value={filter.category || category}
                                onChange={(e: any, newValue: string[]) => {
                                    if (newValue.length > -1) {
                                        setCategory(newValue)
                                        setState({
                                            filter: {
                                                ...filter,
                                                category: newValue,
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
                        <label className='col s12 m4 l4'>
                            {'Language'}
                            <Autocomplete
                                options={[]}
                                multiple
                                id="tags-filled"
                                freeSolo
                                value={filter.language || language}
                                onChange={(e: any, newValue: string[]) => {
                                    if (newValue.length > -1) {
                                        setLanguage(newValue)
                                        setState({
                                            filter: {
                                                ...filter,
                                                language: newValue,
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
                                            <tr key={i} onClick={e => edit(e, item.id)}>
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
                        component.view !== 'table' && <ul className="row list-view">
                            {list &&
                                list.length > 0 &&
                                list.map((room, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className="col s12 m6 l4 xl3"
                                        >
                                            <div className="card-user">
                                                <div className='user-carousel-container'>
                                                    <Carousel infiniteLoop={true}>
                                                        {room.gallery
                                                            ? room.gallery.map((itemData, index) => {

                                                                return (
                                                                    // <img className='image-carousel' src={itemData.url} key={index} alt={itemData.url} draggable={false}/>
                                                                    <CarouselImageItem
                                                                        key={index}
                                                                        src={itemData.url}
                                                                    />
                                                                );

                                                            })
                                                        : [<></>]}
                                                    </Carousel>
                                                </div>
                                                <div className="room-desciption"  onClick={(e) => edit(e, room.id)}>
                                                    <p>{room.title}</p>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                        </ul>
                    }
                </form>
            </div>
        </div>
    )
}