import pull from "lodash/pull";

import { UPDATE_BOARD } from "../constants/eventNames";

export const handleNormalDrag = (board, dragResult, setBoard, socket) => {
  const { boardId, columns } = board;
  const { source, destination, draggableId } = dragResult;

  const startColumn = columns[source.droppableId];
  const destinationColumn = columns[destination.droppableId];

  const startItems = Array.from(startColumn.itemIds);
  const destinationItems = Array.from(destinationColumn.itemIds);

  startItems.splice(source.index, 1);
  destinationItems.splice(destination.index, 0, draggableId);

  const newStartColumn = {
    ...startColumn,
    itemIds: startItems,
  };

  const newDestinationColumn = {
    ...destinationColumn,
    itemIds: destinationItems,
  };

  const newBoard = {
    ...board,
    columns: {
      ...columns,
      [newStartColumn.id]: newStartColumn,
      [newDestinationColumn.id]: newDestinationColumn,
    },
  };

  setBoard(newBoard);
  socket.emit(UPDATE_BOARD, newBoard, boardId);
};

export const handleInsideColumnDrag = (board, dragResult, setBoard, socket) => {
  const { boardId, columns } = board;
  const { source, destination, draggableId } = dragResult;

  const startColumn = columns[source.droppableId];
  const newItemIds = Array.from(startColumn.itemIds);

  newItemIds.splice(source.index, 1);
  newItemIds.splice(destination.index, 0, draggableId);

  const newCol = { ...startColumn, itemIds: newItemIds };
  const newBoard = {
    ...board,
    columns: {
      ...columns,
      [newCol.id]: newCol,
    },
  };

  setBoard(newBoard);
  socket.emit(UPDATE_BOARD, newBoard, boardId);
};

export const handleColumnDrag = (board, dragResult, setBoard, socket) => {
  const { boardId, columnOrder } = board;
  const { source, destination, draggableId } = dragResult;
  const newColumnOrder = Array.from(columnOrder);

  newColumnOrder.splice(source.index, 1);
  newColumnOrder.splice(destination.index, 0, draggableId);

  const newBoard = {
    ...board,
    columnOrder: newColumnOrder,
  };

  setBoard(newBoard);
  socket.emit(UPDATE_BOARD, newBoard, boardId);
};

export const handleCombine = (board, dragResult, stopMerge, setBoard, socket) => {
  const { items, columns, boardId } = board;
  const { combine, draggableId, source } = dragResult;

  // get all related objects of the context of combine
  const itemToCombine = items[combine.draggableId];
  const itemToCombineWith = items[draggableId];
  const itemToCombineWithColumn = columns[source.droppableId];

  // extract the item content
  const originalContent = itemToCombine.content;
  const contentToMerge = itemToCombineWith.content;

  // combine the content
  const newContent = `${originalContent}\n===\n${contentToMerge}`;
  itemToCombine.content = newContent;

  // remove the merged item
  const newItemIds = pull(itemToCombineWithColumn.itemIds, itemToCombineWith.id);

  // update state
  const newColumn = {
    ...itemToCombineWithColumn,
    itemIds: newItemIds,
  };

  const newBoard = {
    ...board,
    columns: {
      ...columns,
      [newColumn.id]: newColumn,
    },
  };

  stopMerge();
  setBoard(newBoard);
  socket.emit(UPDATE_BOARD, newBoard, boardId);
};
