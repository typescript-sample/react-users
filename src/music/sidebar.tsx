import React, { useState } from 'react'
import {
    Modal,
    IconButton,
    Box
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Playlist } from "./service/playlist";
import { useNavigate } from 'react-router';
import { usePlaylist } from "./service";
import { storage } from 'uione';
import './musics-form.scss'


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 400,
    overflowY: 'scroll',
    bgcolor: 'background.paper',
    boxShadow: 24,
    backgroundColor: '#181818',
    p: 4,
};
export const Sidebar = () => {
    const navigate = useNavigate();
    const refForm = React.useRef();
    const userId: string | undefined = storage.getUserId() || ''
    const [playList, setPlayList] = React.useState<Playlist[]>();
    const playlistService = usePlaylist()
    const loadPlaylist = async () => {
        if (!userId) {
            return
        }
        const rep: any = await playlistService.search({
            userId: userId
        })
        setPlayList(rep.list)
    }


    const handleClose = () => setOpen(false);
    const [open, setOpen] = React.useState(false);
    const [addValue, setAddValue] = React.useState<string>();
    const handleOpen = () => {
        loadPlaylist()
        setOpen(true)
    };
    const inpAdd = (e: any) => {
        setAddValue(e.target.value)
    }
    const btnAdd = async (e: any) => {
        e.preventDefault()
        console.log(addValue)
        const rep = await playlistService.insert({
            id: Math.random().toString(36).substr(2, 9),
            title: addValue,
            userId
        })
        if (rep) {
            loadPlaylist()
        }
    }
    const handleDelete = async (id: string) => {
        const rep = await playlistService.delete(id)
        if (rep) {
            loadPlaylist()
        }
    }
    const [isStateAdd, setIsStateAdd] = useState(false)
    const stateAdd = () => {
        console.log(addValue)
        if (addValue && addValue.length > 1) {
            setIsStateAdd(true)
        }else{
            setIsStateAdd(false)
        }
    }
    return (
        <div className='music-sidebar'>
            <div>
                <IconButton aria-label="home" size="large" color='inherit' onClick={() => navigate('/musics')}>
                    <HomeIcon />
                </IconButton>

            </div>
            <div>
                <IconButton aria-label="home" size="large" color='inherit' onClick={() => navigate('/musics/search')}>
                    <SearchIcon />
                </IconButton>

            </div>
            <div>
                <IconButton aria-label="home" size="large" color='inherit' onClick={() => navigate('/musics/playlist')}>
                    <LibraryMusicIcon />
                </IconButton>

            </div>
            <div>
                <IconButton aria-label="home" size="large" color='inherit' onClick={handleOpen}>
                    <AddCircleIcon  />
                </IconButton>

            </div>
            <div>
                <IconButton aria-label="home" size="large" color='inherit' onClick={() => navigate('/musics/save')}>
                    <FavoriteBorderIcon />
                </IconButton>

            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form id='usersForm' name='usersForm' noValidate={true} ref={refForm as any}>
                    <Box sx={style}>
                        <div className='music-modal-filter'>
                            <h1>Playlist</h1>
                            {
                                playList && playList.map((item: any) => {
                                    return (
                                        <div className='delete-playlist' key={item.id}>
                                            <p>#{item.title}</p>
                                            <p
                                                className='delete'
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                X
                                            </p>
                                        </div>
                                    )
                                })
                            }
                            <div><input
                                type="text"
                                id="playlist"
                                name="playlist"
                                value={addValue}
                                onChange={(e: any) => (
                                    inpAdd(e),
                                    stateAdd()
                                )}
                                maxLength={255}
                                placeholder='Add playlist'
                            />
                                {
                                    isStateAdd && (
                                        <button onClick={btnAdd}>Add playlist</button>
                                    )
                                }
                            </div>
                        </div>
                    </Box>

                </form>
            </Modal>
        </div>
    )
}
