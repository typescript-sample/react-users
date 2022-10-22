import React, { useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { usePlaylist } from './service'
import { storage } from 'uione';
import {
    Chip, Button,
    Modal, Box
} from "@mui/material";
import { Playlist } from './service/playlist';
import { AddPlaylist } from './add-play-list';
import PlaylistAddBorderIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

interface Props {
    idItem: string
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 400,
    overflowY: 'scroll',
    bgcolor: '#181818',
    boxShadow: 24,
    p: 4,
};
// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export const AddPlaylistMusic = ({ idItem }: Props) => {
    const userId: string | undefined = storage.getUserId() || ''
    const [checked, setChecked] = React.useState(false)
    const playlistService = usePlaylist();
    const [playList, setPlayList] = React.useState<Playlist[]>();
    useEffect(() => {
        loadPlaylist()
    }, [])
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
    const handleOpen = () => {
        setOpen(true)
    };
    const refForm = React.useRef();
    return (
        <>
            <Checkbox
                // {...label}
                icon={<PlaylistAddBorderIcon color='inherit' />}
                checkedIcon={<PlaylistAddIcon color='inherit' />}
                onClick={handleOpen}
                checked={checked}
                sx={{
                    color: '#e7e6e6',
                    '&.Mui-checked': {
                        color: '#e7e6e6',
                    },
                    '& .MuiSvgIcon-root': { fontSize: 50 }
                }}

            />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form id='usersForm' name='usersForm' noValidate={true} ref={refForm as any}>
                    <Box sx={style}>
                        {
                            playList && playList.map((item: any) => {
                                return (
                                    <div
                                        key={item.id}
                                        style={{
                                            paddingBottom: '20px',
                                            backgroundColor: '#181818'
                                        }}>
                                        <AddPlaylist idItem={item.id} name={item.title} />
                                    </div>
                                )
                            })
                        }
                    </Box>

                </form>
            </Modal>
        </>
    )
}
