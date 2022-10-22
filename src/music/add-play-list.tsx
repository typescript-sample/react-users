import React, { useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox';
import { useSavedListsongResponse } from './service'
import { storage } from 'uione';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useParams } from "react-router-dom";

interface Props {
    idItem: string,
    name:string
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export const AddPlaylist = ({name, idItem }: Props) => {
    const userId: string | undefined = storage.getUserId() || ''
    const { id = "" } = useParams();
    const [checked, setChecked] = React.useState(false)
    const savedItemService = useSavedListsongResponse();
    useEffect(() => {
        loadSavedItem()
    }, [])
    const loadSavedItem = async () => {
        if(!userId){
            return 
        }
        const result: any = await savedItemService.getSavedItem(idItem)
        console.log(result)
        let arr = []
        if (result) {
            arr = result.map((item: any) => {
                return item.id
            })
            if (arr || arr.length > 1) {
                const sattus = arr.some((item: any) => {
                    return item === id
                })
                setChecked(sattus)
            }
        }

    }
    const handleChange = async () => {
        if(!userId){
            return 
        }
        const result = await savedItemService.savedItem(idItem,id )
        if (result) {
            setChecked(true)
        }
    }
    return (
        <FormControlLabel
            label={name}
            control={<Checkbox
                {...label}
                icon={<BookmarkBorderIcon />}
                checkedIcon={<BookmarkIcon />}
                onClick={handleChange}
                checked={checked}
                sx={{
                    color: '#e7e6e6',
                    '&.Mui-checked': {
                      color: '#e7e6e6',
                    },
                }}
            />}
        />

    )
}
