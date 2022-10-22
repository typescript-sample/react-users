
import { Rate } from "../review";
import { RateItem } from "../review/rateItem";

export interface Props {
  id: string;
  reactionService: any;
  commentService: any;
  userId: string;
  rateRange: number;
  list: Rate[];
  resource: any;
}

export const Review = (props: Props) => {
  const { id, list, reactionService, commentService, userId , rateRange, resource} = props;

  return (
    <>
      <ul className="row list-view">
        {list &&
          list.length > 0 &&
          list.map((i: any) => {
            return (
              <RateItem
                key={i.time}
                id={id}
                userId={userId}
                rateRange={rateRange}
                data={i}
                resource={resource}
                disable={i.disable}
                reactionService={reactionService}
                commentService={commentService}
              />
            );
          })}
      </ul>
    </>

  )

}