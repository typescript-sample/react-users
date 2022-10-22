import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  createModel,
  DispatchWithCallback,
  EditComponentParam,
  useEdit,
} from "react-hook-core";
import { inputEdit, handleError, options, storage } from "uione";
import { SuggestionService } from "suggestion-service";
import { Item, getItemService, getCategory } from "./service";
import { TextField, Autocomplete } from "@mui/material";
import { useBrandService } from "./service/item";
import { FileUpload } from "../core/upload";
import Axios from "axios";
import { HttpRequest } from "axios-core";
import { config } from "../config";
import { useNavigate } from "react-router-dom";

const httpRequest = new HttpRequest(Axios, options);
interface InternalState {
  item: Item;
  categoryList: string[];
  showAutocomplete: boolean;
}

const initialState: InternalState = {
  item: { author: storage.getUserId()} as Item,
  categoryList: [],
  showAutocomplete: false,
};

const createItem = (): Item => {
  const item = createModel<Item>();
  return item;
};

const initialize = (
  id: string | null,
  load: (id: string | null) => void,
  set: DispatchWithCallback<Partial<InternalState>>
) => {

  const categoryService = getCategory();
  categoryService.getAllCategories().then((allCategories) => {
    const categoryList: string[] = [];
    if (allCategories.list) {
      for (const item of allCategories.list) {
        categoryList.push(item.categoryName);
      }
    }
    load(id);
    set({ categoryList, showAutocomplete: true });
  });
};

const param: EditComponentParam<Item, string, InternalState> = {
  createModel: createItem,
  initialize,
};

export const MyItemForm = () => {
  const navigate = useNavigate();
  const refForm = useRef();

  const { resource, state, setState, updateState, flag, save, back } = useEdit<
    Item,
    string,
    InternalState
  >(refForm, initialState, getItemService(), inputEdit(), param);
  const item = state.item;

  const brandService = useBrandService();
  const [brandSuggestionService, setBrandSuggestionService] =
    useState<SuggestionService<string>>();
  const [listBrand, setListBrand] = useState<string[]>([]);

  useEffect(() => {
    const brandSuggestion = new SuggestionService<string>(
      brandService.query,
      20
    );
    setBrandSuggestionService(brandSuggestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [previousBrand, setPreviousBrand] = useState({
    keyword: "",
    list: [] as string[],
  });

  const onChangeBrand = (e: React.FormEvent<HTMLInputElement>) => {
    updateState(e);
    const newBrand = e.currentTarget.value;
    if (newBrand) {
      if (brandSuggestionService) {
        brandSuggestionService
          .load(newBrand, previousBrand)
          .then((res) => {
            if (res !== null) {
              setPreviousBrand(res.last);
              setListBrand(res.list);
            }
          })
          .catch(handleError);
      }
    }
  };
  const isUpload = React.useMemo(() => window.location.pathname.includes('upload'), [window.location.pathname])
  const header = React.useMemo(() =>
  (
    (flag.newMode ? resource.create : isUpload ? resource.upload : resource.edit) + " " + resource.item
    // eslint-disable-next-line
  ), [flag.newMode, isUpload])
  const onSave=(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    const userId = storage.getUserId();
    if(userId){
      updateState(event,()=>setState({
        item: {
          ...item,
          author: userId,
        },
      }))
    save(event);
    }
  }
  return (
    <div className="view-container">
      {!isUpload ? <form
        id="itemForm"
        name="itemForm"
        model-name="item"
        ref={refForm as any}
      >
        <header>
          <button
            type="button"
            id="btnBack"
            name="btnBack"
            className="btn-back"
            onClick={back}
          />
          <h2>
            {header}
          </h2>
          {(!isUpload && !flag.newMode) && <button className='btn-group btn-left'><i onClick={() => navigate('upload')} className='material-icons'>photo</i></button>}
        </header>

        <div className="row">
          <label className="col s12 m6">
            ID
            <input
              type="text"
              id="id"
              name="id"
              value={item.id || ""}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20}
              required={true}
            />
          </label>
          <label className="col s12 m6">
            {resource.person_title}
            <input
              type="text"
              id="title"
              name="title"
              value={item.title || ""}
              onChange={updateState}
              maxLength={40}
              required={true}
              placeholder={resource.person_title}
            />
          </label>
          <div className="col s12 m6 radio-section">
            {resource.status}
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  id="active"
                  name="status"
                  onChange={(e) => updateState(e, () => setState)}
                  required={true}
                  value="A"
                  checked={item.status === "A"}
                />
                {resource.active}
              </label>
              <label>
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  onChange={(e) => updateState(e, () => setState)}
                  value="I"
                  checked={item.status === "I"}
                />
                {resource.inactive}
              </label>
            </div>
          </div>
          <label className="col s12 m6">
            {resource.description}
            <input
              type="text"
              id="description"
              name="description"
              value={item.description || ""}
              onChange={updateState}
              maxLength={120}
              placeholder={resource.description}
            />
          </label>
          <label className="col s12 m6">
            Price
            <input
              type="number"
              id="price"
              name="price"
              value={item.price || ""}
              onChange={(e: any) => {
                const value = e.currentTarget.value || "";
                setState({
                  item: {
                    ...item,
                    price: parseInt(value),
                  },
                });
              }}
              maxLength={120}
              placeholder={resource.price}
              required={true}
            />
          </label>
          <label className="col s12 m6">
            Image URL
            <input
              type="text"
              id="imageURL"
              name="imageURL"
              value={item.imageURL || ""}
              onChange={updateState}
              maxLength={1500}
              placeholder="Image URL"
            />
          </label>
          <label className="col s12 m6">
            {((!flag.newMode && item.categories) || flag.newMode) && (
              <Autocomplete
                multiple={true}
                options={state.categoryList}
                value={item.categories}
                onChange={(e, newValue) => {
                  const newItem = { ...item, categories: newValue };
                  setState({ item: newItem }, () => { });
                }}
                onSubmit={
                  (e) => {
                    e.preventDefault();
                  }
                }
                filterSelectedOptions={true}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="categories"
                    placeholder="category"
                  />
                )}
              />
            )}
          </label>

          {/* Brand */}
          <label className="col s12 m6">
            Brand
            <section>
              <div className="form-group">
                <input
                  required={true}
                  list="listBrand"
                  type="text"
                  name="brand"
                  className="form-control"
                  value={item.brand}
                  onChange={onChangeBrand}
                  placeholder="Enter brand"
                  maxLength={50}
                  autoComplete="on"
                />
              </div>
              {listBrand && listBrand.length > 0 && (
                <datalist id="listBrand">
                  {listBrand.map((item, i) => {
                    return <option key={i} value={item} />;
                  })}
                </datalist>
              )}
            </section>
          </label>


          {/* <label className="col s12 m6">
            Image
            <section>
              <UploadContainer
                post={httpRequest.post}
                setURL={(dt: string) => handleChangeFile(dt)}
                type={"upload"}
                id={item.id}
                url={config.my_item_url}
                aspect={16 / 9}
                sizes={[]}
                key="34324"
              />
            </section>
          </label> */}

        </div>

        <footer>
          {!flag.readOnly && (
            <button type="submit" id="btnSave" name="btnSave" onClick={onSave}>
              {resource.save}
            </button>
          )}
        </footer>
      </form> : <form
        id="itemForm"
        name="itemForm"
        model-name="item"
        ref={refForm as any}
      >
        <header>
          <button
            type="button"
            id="btnBack"
            name="btnBack"
            className="btn-back"
            onClick={back}
          />
          <h2>
            {header}
          </h2>
        </header>

        <div className="row">
          <label className="col s12 m6">
            {resource.person_title}
            <input
              type="text"
              id="title"
              name="title"
              value={item.title || ""}
              onChange={updateState}
              maxLength={40}
              required={true}
              placeholder={resource.person_title}
            />
          </label>
          <label className="">
            Gallery
            <div className='view-container profile-info'>
              <FileUpload
                type='gallery'
                post={httpRequest.post}
                id={item.id || ''}
                url={config.my_item_url}
                sizes={[]}
                getGalllery={getItemService().fetchImageUploadedGallery}
                uploadExternalResource={getItemService().uploadExternalResource}
                deleteFileYoutube={getItemService().deleteFileYoutube}
                deleteFile={getItemService().deleteFile}
                update={getItemService().updateData}
              />
            </div>
          </label>
        </div>

        <footer>
          {!flag.readOnly && (
            <button type="submit" id="btnSave" name="btnSave" onClick={save}>
              {resource.save}
            </button>
          )}
        </footer>
      </form>}
    </div>
  );
};
