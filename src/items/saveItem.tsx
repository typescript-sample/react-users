import React, { useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useSavedItemResponse } from "./service";
import { storage } from "uione";

interface Props {
  idItem: string;
}

const label = { inputProps: { "aria-label": "Checkbox demo" } };
export const SaveItem = ({ idItem }: Props) => {
  const userId: string | undefined = storage.getUserId() || "";
  const [checked, setChecked] = React.useState(false);
  const savedItemService = useSavedItemResponse();
  useEffect(() => {
    loadSavedItem();
  }, []);
  const loadSavedItem = async () => {
    if (!userId) {
      return;
    }
    const result: any = await savedItemService.getSavedItem(userId);
    let arr = [];
    if (result) {
      arr = result.map((item: any) => {
        return item.id;
      });
      if (arr || arr.length > 1) {
        const sattus = arr.some((item: any) => {
          return item === idItem;
        });
        setChecked(sattus);
      }
    }
  };
  const handleChange = async () => {
    if(checked){
      const rep =await savedItemService.unsavedItem(userId,idItem)
      if(rep){
          setChecked(false)
      }

  }
    if (!userId||checked) {
      return;
    }
    const result = await savedItemService.savedItem(userId, idItem);
    if (result) {
      setChecked(true);
    }
  };
  return (
    <Checkbox
      {...label}
      icon={<BookmarkBorderIcon />}
      checkedIcon={<BookmarkIcon />}
      onClick={handleChange}
      checked={checked}
    />
  );
};
