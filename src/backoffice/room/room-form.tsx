import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { emailOnBlur, Gender, handleError, handleSelect, inputEdit, phoneOnBlur, requiredOnBlur, Status } from 'uione';
import { getRoomService, Room } from './service';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
    Chip,
    Autocomplete,
    ThemeProvider,
    createTheme,
} from "@mui/material";

interface InternalState {
    room: Room;
}

const createRoom = (): Room => {
    const room = createModel<Room>();
    return room;
};
const initialState: InternalState = {
    room: {} as
        Room,
};
const param: EditComponentParam<Room, string, InternalState> = {
    createModel: createRoom
};
interface date {
    publishedAt: Date | null;
    expiredAt: Date | null;
}
const listOffer = [
    "Máy giặt",
    "Sân hoặc ban công",
    "Điều hòa nhiệt độ",
    "Bữa sáng",
    "Cho phép ở dài hạn",
    "Cho phép hút thuốc"
];
const listHighlight = [
    "Self check-in",
    "Great location",
    "Dive right in"
];
const listCategory = [
    "Beach",
    "Tiny Home",
    "Islands"
];
const listLanguage = [
    "Tiếng Anh",
    "Tiếng Việt"
];
const listTypeof = [
    "Toàn bộ nhà",
    "Phòng riêng",
    "Phòng chung"
];
export const BRoomForm = () => {
    const refForm = React.useRef();
    const navigate = useNavigate();
    const { resource, state, setState, updateState, flag, save, back } = useEdit<Room, string, InternalState>(refForm, initialState, getRoomService(), inputEdit(), param);
    const room = state.room;
    console.log(room)
    const theme = createTheme({
        palette: {
            primary: {
                main: "#4db6ac",
            },
        },
    });
    const [value, setValue] = React.useState<date>({
        publishedAt: new Date,
        expiredAt: new Date
    }
    );
    // const handleChange = (newValue: Date | null) => {
    //     setValue(newValue);
    // };
    const isUpload = React.useMemo(() => window.location.pathname.includes('upload'), [window.location.pathname])
 
    return (
        <div className='view-container'>
            <form id='roomForm' name='roomForm' model-name='room' ref={refForm as any}>
                <header>
                    <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
                    <h2>{flag.newMode ? resource.create : resource.edit} {'job'}</h2>
                    {(!isUpload && !flag.newMode) && <button className='btn-group btn-left'><i onClick={() => navigate('upload')} className='material-icons'>photo</i></button>}
                </header>
                <div className="row">
                    <label className='col s12 m6'>
                        <h2>Id</h2>
                        <input
                            type='text'
                            id='id'
                            name='id'
                            value={room.id || ''}
                            readOnly={!flag.newMode}
                            onChange={updateState}
                            maxLength={20} required={true}
                            placeholder='Id' />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Title</h2>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            value={room.title || ''}
                            onChange={updateState}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder='Title' />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Host</h2>
                        <input
                            type='text'
                            id='host'
                            name='host'
                            value={room.host || ''}
                            onChange={updateState}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder='Host' />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Region</h2>
                        <input
                            type='text'
                            id='region'
                            name='region'
                            value={room.region || ''}
                            onChange={updateState}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder='Region' />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Property type</h2>
                        <input
                            type='text'
                            id='property'
                            name='property'
                            value={room.property || ''}
                            onChange={updateState}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder='Peroperty' />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Location</h2>
                        <input
                            type='text'
                            id='location'
                            name='location'
                            value={room.location || ''}
                            onChange={updateState}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder='Location' />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Description</h2>
                        <textarea rows={5} cols={70}
                            id='description'
                            name='description'
                            onBlur={requiredOnBlur}
                            onChange={(e: any) => {
                                setState({
                                    room: {
                                        ...room,
                                        description: e.target.value,
                                    },
                                });

                            }}
                            defaultValue={room.description || ''}
                            placeholder={resource.description}
                        />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Price</h2>
                        <input
                            type='number'
                            id='price'
                            name='price'
                            value={room.price || ''}
                            onChange={(e: any) => {
                                const value = e.currentTarget.value || "";
                                setState({
                                    room: {
                                        ...room,
                                        price: parseInt(value),
                                    },
                                });
                            }}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder={"Price"} />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Guest</h2>
                        <input
                            type='number'
                            id='guest'
                            name='guest'
                            value={room.guest || ''}
                            onChange={(e: any) => {
                                const value = e.currentTarget.value || "";
                                setState({
                                    room: {
                                        ...room,
                                        guest: parseInt(value),
                                    },
                                });
                            }}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder={"Guest"} />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Bedrooms</h2>
                        <input
                            type='number'
                            id='bedrooms'
                            name='bedrooms'
                            value={room.bedrooms || ''}
                            onChange={(e: any) => {
                                const value = e.currentTarget.value || "";
                                setState({
                                    room: {
                                        ...room,
                                        bedrooms: parseInt(value),
                                    },
                                });
                            }}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder={"Guest"} />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Bed</h2>
                        <input
                            type='number'
                            id='guest'
                            name='guest'
                            value={room.bed || ''}
                            onChange={(e: any) => {
                                const value = e.currentTarget.value || "";
                                setState({
                                    room: {
                                        ...room,
                                        bed: parseInt(value),
                                    },
                                });
                            }}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder={"Bed"} />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Bathrooms</h2>
                        <input
                            type='number'
                            id='bathrooms'
                            name='bathrooms'
                            value={room.bathrooms || ''}
                            onChange={(e: any) => {
                                const value = e.currentTarget.value || "";
                                setState({
                                    room: {
                                        ...room,
                                        bathrooms: parseInt(value),
                                    },
                                });
                            }}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder={"Bathrooms"} />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Offer</h2>
                        {((!flag.newMode && room.offer) || flag.newMode) && (
                            <Autocomplete
                                multiple={true}
                                options={listOffer}
                                value={room.offer}
                                onChange={(e, newValue) => {
                                    console.log(newValue)
                                    const newItem = { ...room, offer: newValue };
                                    setState({ room: newItem }, () => { });
                                }}
                                filterSelectedOptions={true}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Offer"
                                        placeholder="Offer"
                                    />
                                )}
                            />
                        )}
                    </label>
                    <label className='col s12 m6'>
                        <h2>Highlight</h2>
                        {((!flag.newMode && room.offer) || flag.newMode) && (
                            <Autocomplete
                                multiple={true}
                                options={listHighlight}
                                value={room.highlight}
                                onChange={(e, newValue) => {
                                    const newItem = { ...room, highlight: newValue };
                                    setState({ room: newItem }, () => { });
                                }}
                                filterSelectedOptions={true}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Highlight"
                                        placeholder="Highlight"
                                    />
                                )}
                            />
                        )}
                    </label>
                    <label className='col s12 m6'>
                        <h2>Category</h2>
                        {((!flag.newMode && room.offer) || flag.newMode) && (
                            <Autocomplete
                                multiple={true}
                                options={listCategory}
                                value={room.category}
                                onChange={(e, newValue) => {
                                    const newItem = { ...room, category: newValue };
                                    setState({ room: newItem }, () => { });
                                }}
                                filterSelectedOptions={true}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Category"
                                        placeholder="Category"
                                    />
                                )}
                            />
                        )}
                    </label>
                    <label className='col s12 m6'>
                        <h2>Language</h2>
                        {((!flag.newMode && room.offer) || flag.newMode) && (
                            <Autocomplete
                                multiple={true}
                                options={listLanguage}
                                value={room.language}
                                onChange={(e, newValue) => {
                                    const newItem = { ...room, language: newValue };
                                    setState({ room: newItem }, () => { });
                                }}
                                filterSelectedOptions={true}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Language"
                                        placeholder="Language"
                                    />
                                )}
                            />
                        )}
                    </label>
                    <label className='col s12 m6'>
                        <h2>Type of place</h2>
                        {((!flag.newMode && room.offer) || flag.newMode) && (
                            <Autocomplete
                                multiple={true}
                                options={listTypeof}
                                value={room.typeof}
                                onChange={(e, newValue) => {
                                    const newItem = { ...room, typeof: newValue };
                                    setState({ room: newItem }, () => { });
                                }}
                                filterSelectedOptions={true}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Type of place"
                                        placeholder="Type of place"
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
