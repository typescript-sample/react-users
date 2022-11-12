export interface Props {
  load?: any;
  data?: SortOption[]
  sort?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
interface SortOption {
  value: string
  text: string
  // sortType: "+"|"-"
}
export function Sort({ load, data }: Props) {
  
  return (
    <select
      className="comments-sort "
      defaultValue={"time"}
      onChange={(e) => load(e.target.value)}
      style={{
        border: 'none',
        outline: "none",
      }}
    >
      {
        data && data.length >= 0 ? data.map((item, index) => {
          return (
            // <option key={index} value={item.value} data-field={`${item.value}`}><span sort-type={item.sortType} id={`sort${item.value}`} onClick={_sort}>{item.text}</span></option>
            <option key={index} value={item.value} data-field={`${item.value}`}>{item.text}</option>
          )
        }) : (<>
          <option value="-time">Newest First</option>
          <option value="time">Oldest First</option>
          <option value="-rate">Highest rate</option>
          <option value="rate">Lowest rate</option>
          <option value="-replyCount">Top Reply</option>
          <option value="-usefulCount">Top Like</option></>
        )}

    </select>
  );
}
