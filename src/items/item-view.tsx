import { useState, useEffect } from "react";
import { Item, getItemService, useItemResponse, useItemReaction, useItemComment } from "./service";
import { useParams } from "react-router-dom";
import { Chip } from "@mui/material";
import { storage } from "uione";
import ReactImageMagnify from "react-image-magnify";

import "./item.css";
import { ItemResponse } from "./response";
import { ItemSlider } from "./item-slider";
import { FileInfo } from "reactx-upload";
import { ModalItemView } from "./modal-item-view";
import { SaveItem } from "./saveItem"

export const ItemView = () => {
  const { id = "" } = useParams();
  const [item, setItem] = useState<Item>();
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const itemService = getItemService();
  const responseService = useItemResponse();
  const reactionService = useItemReaction();
  const commentService = useItemComment();
  const userId: string | undefined = storage.getUserId() || "";

  useEffect(() => {
    getItem(id ?? "");
  }, [id]);

  const getItem = async (id: string) => {
    const currentItem = await itemService.load(id);
    if (currentItem) {
      setItem(currentItem);
    }
  };

  const onSelectImage = (index: number, isClick: boolean) => {
    setCurrentImage(index);
    isClick ?? setIsOpenModal(true);
  };

  return (
    <div className="">
      <div style={{float:'right'}}>
        <SaveItem idItem={id} />
      </div>
      {item && (
        <div className="row" style={{ height: 600 }}>
          <div className="col s1">
            <ItemSlider
              setCurrentImage={onSelectImage}
              items={item.gallery ?? [{ url: item.imageURL } as FileInfo]}
              currentImage={currentImage}
              handleHoverImage={onSelectImage}
            />
          </div>
          <div className="col s11 item-view">
            <div className="main-img">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "",
                    isFluidWidth: true,
                    src: currentImage
                      ? item.gallery![currentImage].url
                      : item?.gallery
                        ? item.gallery[0].url
                        : item.imageURL,

                  },
                  largeImage: {
                    src: currentImage
                      ? item.gallery![currentImage].url
                      : item?.gallery
                        ? item.gallery[0].url
                        : item.imageURL,
                    width: 1200,
                    height: 1800,
                  },
                  enlargedImageContainerDimensions: {
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Chip label={item.brand} />
              <p>{item.price}</p>
              <span>
                {item.categories
                  ? item.categories.map((c: any, i: number) => {
                    return <Chip key={i} label={c} />;
                  })
                  : ""}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <ItemResponse i={item} get={getItem} id={id} userId={userId} responseService={responseService} reactionService={reactionService} commentService={commentService}/>

      <ModalItemView
        selectedImage={currentImage}
        gallery={item?.gallery ?? []}
        closeModalConfirm={() => setIsOpenModal(false)}
        modalConfirmIsOpen={isOpenModal}
      />
    </div>
  );
};


