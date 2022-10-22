import { Searchable } from "react-hook-core";
import { Rates } from "./service/rate";

interface Props {
  doSearch: (se: Searchable<Rates>, isFirstLoad?: boolean | undefined) => void;
}

export function Sort({ doSearch }: Props) {
  return (
    <select
      className="comments-sort btn button"
      defaultValue={"-time"}
      onChange={(e) => doSearch({ sortField: e.target.value })}
    >
      <option value="-time">Newest First</option>
      <option value="time">Oldest First</option>
      <option value="-rate">Highest rate</option>
      <option value="rate">Lowest rate</option>
      <option value="-replyCount">Top Reply</option>
      <option value="-usefulCount">Top Like</option>
    </select>
  );
}
