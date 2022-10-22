import { Item } from 'onecore';
import * as React from 'react';
import { checked, OnClick, Search, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import { getRoomService, Room, RoomFilter } from './service';
import { Carousel, CarouselImageItem, CarouselVideoItem } from "reactx-carousel";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './rooms.scss'
import {
  Chip,
  TextField,
  Autocomplete,
  ThemeProvider,
  createTheme,
  Button,
  Modal,
  Typography,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';

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
  typeof: [],
  language: [],
  offer: [],
  highlight: [],
  category: ["Islands"],
  guest: undefined,
  bedrooms: undefined,
  bed: undefined,
  bathrooms: undefined,
  q: ''
};
const initialState: JobSearch = {
  filter: jobFilter
};
const listCategory = [
  'Islands',
  "Beach",
  'Design',
  'Arctic',
  'Cabins',
  'Caves',
  'Sufing',
  'Golfing',
  'Tiny homes',
  'National parks',
  'Tropical'
]
const listLanguage = [
  'Vietnamese',
  "English ",
]
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
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 800,
  overflowY: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export const RoomsForm = () => {
  const navigate = useNavigate();
  const refForm = React.useRef();
  const [room, setRoom] = React.useState<string[]>([]);
  const [offer, setOffer] = React.useState<string[]>([]);
  const [category, setCategory] = React.useState<string[]>([]);
  const [language, setLanguage] = React.useState<string[]>([]);
  const getFilter = (): RoomFilter => {
    return value(state.filter);
  };
  const roomService = getRoomService()
  const p = { getFilter };
  const { state, resource, component, updateState, search, sort, setState, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<Room, RoomFilter, JobSearch>(refForm, initialState, getRoomService(), inputSearch(), p);
  const edit = (e: OnClick, id: string) => {
    // console.log(id)
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
  const [val, setValue] = React.useState('Islands');

  const handleChange = (event: any, newValue: string) => {
    // setState({
    //   filter: {
    //     ...filter,
    //     category: [newValue]
    //   },
    // })
    state.filter = {...filter,category:[newValue]}
    setValue(newValue);
    search(event)

  }

  const filter = value(state.filter);
  const [open, setOpen] = React.useState(false);
  const [valuePrice, setValuePrice] = React.useState<number[]>([1, 1000])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChangePrice = (event: Event, newValue: any) => {
    setValuePrice(newValue as number[]);
    setState({
      filter: {
        ...filter,
        price: { ...filter.price, min: parseInt(newValue[0]), max: parseInt(newValue[1]) },
      },
    });
    console.log(newValue)
  };


  return (
    <div className='view-container'>
      <div>
        <div className='room-category'>
          <Box sx={{ width: '90%', flex: '9' }}>
            <Tabs
              value={val}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
            >
              {
                listCategory.map((item: string) => {
                  return <Tab value={item} icon={<FavoriteIcon />} label={item} />
                })
              }
            </Tabs>
          </Box>
          <Button startIcon={<MultipleStopIcon />} sx={{ width: '10%', flex: '1' }} onClick={handleOpen}>Filter</Button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <form id='usersForm' name='usersForm' noValidate={true} ref={refForm as any}>
            <Box sx={style}>
              <div className='room-modal-filter'>
                <h1>Filters</h1>
                <div className='room-modal-filter-price'>
                  <h2>Price range</h2>
                  <Box sx={{ width: ' 100% ' }}>
                    <Slider
                      getAriaLabel={() => 'Temperature range'}
                      value={valuePrice}
                      onChange={handleChangePrice}
                      valueLabelDisplay="auto"
                      max={1000}
                      min={1}
                    />
                  </Box>
                  <div className='price-range'>
                    <p>Min price: ${valuePrice[0]}</p>
                    <p>Max price: ${valuePrice[1]}</p>
                  </div>
                </div>
                <hr />
                <div className='room-modal-filter-typeof'>
                  <h2>Rooms and beds</h2>
                  <div className='col s12 m6' style={{ display: 'flex' }}>
                    <h2 style={{ flex: 1 }}>Bedrooms</h2>
                    <input
                      type='number'
                      id='bedrooms'
                      name='bedrooms'
                      onChange={(e: any) => {
                        const value = e.currentTarget.value || "";
                        setState({
                          filter: {
                            ...filter,
                            bedrooms: parseInt(value),
                          },
                        });
                      }}
                      maxLength={40}
                      placeholder={"Enter number"} />
                  </div>
                  <div className='col s12 m6' style={{ display: 'flex' }}>
                    <h2 style={{ flex: 1 }}>Bed</h2>
                    <input
                      type='number'
                      id='guest'
                      name='guest'
                      onChange={(e: any) => {
                        const value = e.currentTarget.value || "";
                        setState({
                          filter: {
                            ...filter,
                            bed: parseInt(value),
                          },
                        });
                      }}
                      maxLength={40}
                      placeholder={"Enter number"} />
                  </div>
                  <div className='col s12 m6' style={{ display: 'flex' }}>
                    <h2 style={{ flex: 1 }}>Bathrooms</h2>
                    <input
                      type='number'
                      id='bathrooms'
                      name='bathrooms'
                      onChange={(e: any) => {
                        const value = e.currentTarget.value || "";
                        setState({
                          filter: {
                            ...filter,
                            bathrooms: parseInt(value),
                          },
                        });
                      }}
                      maxLength={40}
                      placeholder={"Enter number"} />
                  </div>
                </div>
                <hr />
                <div className='room-modal-filter-typeof'>
                  <h2>Type of place</h2>
                  <div className='typeof-checkbox'>
                    <label>
                      <input
                        type="checkbox"
                        id="EntirePlace"
                        name="typeof"
                        value="Toàn bộ nhà"
                        checked={checked(filter.typeof, "Toàn bộ nhà")}
                        onChange={updateState}
                      />
                      Toàn bộ nhà
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        id="PrivateRoom"
                        name="typeof"
                        value="Phòng riêng"
                        checked={checked(filter.typeof, "Phòng riêng")}
                        onChange={updateState}
                      />
                      Phòng riêng
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        id="SharedRoom"
                        name="typeof"
                        value="Phòng chung"
                        checked={checked(filter.typeof, "Phòng chung")}
                        onChange={updateState}
                      />
                      Phòng chung
                    </label>
                  </div>
                </div>

                <hr />
                <div className='room-modal-filter-typeof'>
                  <h2>Language</h2>
                  <div className='typeof-checkbox'>
                    {
                      listLanguage.map((item: string) => {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              id={item}
                              name="language"
                              value={item}
                              checked={checked(filter.language, `${item}`)}
                              onChange={updateState}
                            />
                            {item}
                          </label>
                        )
                      })
                    }

                  </div>
                </div>
                <hr />
                <div className='room-modal-filter-typeof'>
                  <h2>Amenities</h2>
                  <div className='typeof-checkbox'>
                    {
                      listOffer.map((item: string) => {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              id={item}
                              name="offer"
                              value={item}
                              checked={checked(filter.offer, `${item}`)}
                              onChange={updateState}
                            />
                            {item}
                          </label>
                        )
                      })
                    }

                  </div>
                </div>
                <hr />
                <div className='room-modal-filter-typeof'>
                  <h2>Highlight</h2>
                  <div className='typeof-checkbox'>
                    {
                      listOffer.map((item: string) => {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              id={item}
                              name="highlight"
                              value={item}
                              checked={checked(filter.highlight, `${item}`)}
                              onChange={updateState}
                            />
                            {item}
                          </label>
                        )
                      })
                    }

                  </div>
                </div>
              </div>
              <Button onClick={search}>Search</Button>
            </Box>

          </form>
        </Modal>
        <form className='list-result'>
          <ul className="row list-view">
            {list &&
              list.length > 0 &&
              list.map((room, i) => {
                return (
                  <div
                    key={i}
                    className="col s12 m6 l4 xl3"
                  >
                    <div className="card-room">
                      <div className='room-carousel-container'>
                        <Carousel infiniteLoop={true}>
                          {room.imageUrl
                            ? room.imageUrl.map((itemData, index) => {

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
                      <div className="room-location" onClick={(e) => edit(e, room.id)}>
                        <p>{room.location}</p>
                      </div>
                      <div className="room-title" onClick={(e) => edit(e, room.id)}>
                        <p>{room.title}</p>
                      </div>
                      <div className="room-price" onClick={(e) => edit(e, room.id)}>
                        <p>${room.price} night</p>
                      </div>

                    </div>
                  </div>
                );
              })}
          </ul>
        </form>
      </div>
    </div>
  )
}