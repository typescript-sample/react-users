import React, { useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox';
import { useSavedItemResponse } from './service'
import { storage } from 'uione';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

interface Props{
    idItem:string
}

export const SavedMusic = ({idItem}:Props) => {
    const userId: string | undefined = storage.getUserId() || ''
    const [checked, setChecked] = React.useState(false)
    const savedItemService = useSavedItemResponse();
    useEffect(()=>{
        loadSavedItem()
    },[])
    const loadSavedItem=async()=>{
        if(!userId){
            return 
        }
        const result:any = await savedItemService.getSavedItem(userId)
        console.log(result)
        let arr=[]
        if(result){
            arr=result.map((item:any)=>{
                return item.id
            })
            if(arr||arr.length>1){
                const sattus=arr.some((item:any)=>{
                    return item===idItem
                })
                setChecked(sattus)
            }
        }
       
    }
    const handleChange=async()=>{
        if(checked){
            const rep =await savedItemService.unsavedItem(userId,idItem)
            if(rep){
                setChecked(false)
            }

        }
        if(!userId||checked){
            return 
        }
        const result= await savedItemService.savedItem(userId,idItem)
        if(result){
            setChecked(true)
        }
    }
    return (
            <Checkbox
                icon={<FavoriteBorder color='inherit' />}
                checkedIcon={<Favorite color='inherit' />}
                onClick={handleChange}
                checked={checked}   
                sx={{
                    padding:0,
                    color: '#e7e6e6',
                    '&.Mui-checked': {
                      color: '#e7e6e6',
                    },
                    '& .MuiSvgIcon-root': { fontSize: 50 }
                  }}
            />
    )
}
