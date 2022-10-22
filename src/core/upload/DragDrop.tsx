import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { DragDropProps, FileInfo, RenderItem } from 'reactx-upload';

import 'react-image-crop/dist/ReactCrop.css';

export const DragDrop = (props: DragDropProps) => {
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newList = reorder(
      props.list,
      result.source.index,
      result.destination.index
    );
    props.update(props.id, newList);
    props.setList(newList);
  };

  const reorder = (listReorder: FileInfo[], startIndex: number, endIndex: number) => {
    const result = Array.from(listReorder);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result as FileInfo[];
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable' direction='vertical'>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.list.map((item, index) => (
              <Draggable key={item.url} draggableId={item.url} index={index}>
                {(provide, _) => (
                  <div
                    key={item.url}
                    className='row card-image'
                    ref={provide.innerRef}
                    style={provide.draggableProps.style}
                    {...provide.draggableProps}
                  >
                    <div {...provide.dragHandleProps} className='col xl1 l1 m1 s1'>
                      <i className='material-icons menu-type'>menu</i>
                      <i onClick={() => props.handleDeleteFile(item.url, item.type)} className='material-icons icon-delete'>delete</i>
                    </div>
                    <RenderItem item={item} />
                  </div>
                )}
              </Draggable>
            )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

