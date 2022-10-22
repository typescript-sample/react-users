import { Searchable } from "react-hook-core";
import { Item } from "./service";

interface Props {
  doSearch: (se: Searchable<Item>, isFirstLoad?: boolean | undefined) => void;
}

export function SortItem({ doSearch }: Props) {
  return (
    <select
      className="comments-sort btn button"
      defaultValue={"-publishedAt"}
      onChange={(e) => doSearch({ sortField: e.target.value })}
    >
      <option value="-publishedAt"> Date Down </option>
      <option value="publishedAt"> Date Up </option>
      <option value="-title"> Title Down </option>
      <option value="title"> Title Up </option>
      <option value="-brand"> Brand Down </option>
      <option value="brand"> Brand Up </option>
      <option value="-price"> Price Down </option>
      <option value="price"> Price Up </option>
    </select>
  );
}
