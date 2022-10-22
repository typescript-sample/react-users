import * as React from "react";
import { OnClick} from "react-hook-core";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {  Item } from "./service";

import { Chip } from "@mui/material";
import { SaveItem } from "./saveItem";
import { useSavedItemResponse } from "./service";
import { storage } from "uione";

export const MyItem = () => {
  const navigate = useNavigate();
  const savedItemService = useSavedItemResponse();
  const userId: string | undefined = storage.getUserId() || "";
  const [checked, setChecked] = React.useState(false);
  const [list, setList] = React.useState<Item[]>()
  const edit = (e: OnClick, id: string) => {
    e.preventDefault();
    navigate(`/items/${id}`);
  };
  React.useEffect(() => {
    loadSavedItem();
  }, []);
  const loadSavedItem = async () => {
    if (!userId) {
      return;
    }
    const result: any = await savedItemService.getSavedItem(userId);
    setList(result)
  };
  console.log(list)
  return (
    <div className="view-container">
      <div>
        <form className="list-result">
            <ul className="row list-view">
              {list &&
                list.length > 0 &&
                list.map((item, i) => {
                  return (
                    <li key={i} className="col s12 m6 l4 xl3" >
                      <section>
                        <div onClick={(e: any) => edit(e, item.id)}>
                          <h3>
                            <Link to={`/${item.id}`}>{item.title}</Link>
                          </h3>
                          <p>{item.description}</p>
                          <Chip label={item.brand} size="small" />
                          <p>{item.price}</p>
                          {item.categories &&
                            item.categories.map((c: any, i: number) => {
                              return <Chip key={i} label={c} size="small" />;
                            })}
                        </div>
                        <SaveItem idItem={item.id} />
                      </section>
                    </li>
                  );
                })}
            </ul>
        </form>
      </div>
    </div>
  );
};
