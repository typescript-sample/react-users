import { useEffect, useRef, useState } from 'react'
import { getRoomService, Room, RoomFilter } from './service';
import { Link, useParams } from 'react-router-dom';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import QuiltedImageList from './image-list';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export const RoomForm = () => {
  const { id = "" } = useParams()
  const [roomDetail, setRoomDetail] = useState<Room>();
  const roomService = getRoomService()
  const load = async () => {
    const rep = await roomService.load(id)
    if (rep) {
      setRoomDetail({
        ...roomDetail,
        ...rep
      })
    }
  }
  useEffect(() => {
    load()
  }, [])
  return (
    <div className='view-container'>
      <div className="room-view">
        <div className="room-view-title">
          {roomDetail?.title}
        </div>
        <div className="room-view-location-save">
          <div>{roomDetail?.location}</div>
          <div>
            <FormControlLabel
              label="Save"
              control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />}
            />
          </div>
        </div>
        <div className="room-view-picture">
          <QuiltedImageList />
        </div>
        <div className="room-view-detail">
          <div className="room-view-detail-info">
            <h1> Hosted by {roomDetail?.host}</h1>
            <h3>{roomDetail?.guest} guest.{roomDetail?.bedrooms}bedrooms.{roomDetail?.bed}bed.{roomDetail?.bathrooms}bathrooms </h3>
            <hr />
            <div className='detail-info-highlight'>
                {
                  roomDetail?.highlight.map((item:any)=>{
                    return (
                      <div><Favorite />{item}</div>
                    )
                  })
                }
            </div>
          </div>
          <div className="room-view-info-reserve">
          </div>
        </div>
      </div>
    </div>
  )
}

