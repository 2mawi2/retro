const fs = require("fs");

const { getPath, getBoard, stringify, logError } = require("../utils");
const {
  UPDATE_BOARD,
  JOIN_BOARD,
  UNBLUR_CARDS,
  JOIN_ERROR,
  SET_MAX_VOTES,
  RESET_VOTES,
  SHOW_CONTINUE_DISCUSSION
} = require("./event-names");

const UTF8 = "utf8";

const joinBoard = (io, client) => {
  client.on(JOIN_BOARD, boardId => {
    fs.readFile(getPath(boardId), UTF8, (error, file) => {
      if (error) {
        client.emit(JOIN_ERROR);
      } else {
        client.emit(JOIN_BOARD, getBoard(file));
      }
    });
  });
};

const updateBoard = (io, client, roomId) => {
  client.on(UPDATE_BOARD, (board, boardId) => {
    fs.writeFile(getPath(boardId), stringify(board), UTF8, error => {
      if (error) logError(UPDATE_BOARD, error);
      io.to(roomId).emit(UPDATE_BOARD, board);
    });
  });
};

const unblurCards = (io, client, roomId) => {
  client.on(UNBLUR_CARDS, boardId => {
    const path = getPath(boardId);
    fs.readFile(path, UTF8, (error, file) => {
      if (error) logError(UNBLUR_CARDS, error);

      const board = getBoard(file);
      board.isBlurred = !board.isBlurred;

      for (let cardId in board.items) {
        board.items[cardId].isBlurred = board.isBlurred;
      }

      fs.writeFile(path, stringify(board), UTF8, error => {
        if (error) logError(UNBLUR_CARDS, error);
        io.to(roomId).emit(UPDATE_BOARD, board);
      });
    });
  });
};

const setMaxVotes = (io, client, roomId) => {
  client.on(SET_MAX_VOTES, (voteCount, boardId) => {
    const path = getPath(boardId);

    fs.readFile(path, UTF8, (error, file) => {
      if (error) logError(SET_MAX_VOTES, error);

      const board = getBoard(file);
      board.maxVoteCount = voteCount;

      for (let cardId in board.items) {
        board.items[cardId].points = 0;
      }

      fs.writeFile(path, stringify(board), UTF8, error => {
        if (error) logError(SET_MAX_VOTES, error);
        io.to(roomId).emit(SET_MAX_VOTES, board);
      });
    });
  });
};

const resetVotes = (io, client, roomId) => {
  client.on(RESET_VOTES, boardId => {
    const path = getPath(boardId);

    fs.readFile(path, UTF8, (error, file) => {
      if (error) logError(RESET_VOTES, error);
      const board = getBoard(file);

      for (let cardId in board.items) {
        board.items[cardId].points = 0;
      }

      fs.writeFile(path, stringify(board), UTF8, error => {
        if (error) logError(RESET_VOTES, error);
        io.to(roomId).emit(RESET_VOTES, board);
      });
    });
  });
};

const toggleContinueDiscussion = (io, client, roomId) => {
  client.on(SHOW_CONTINUE_DISCUSSION, boardId => {
    const path = getPath(boardId);

    fs.readFile(path, UTF8, (error, file) => {
      if (error) logError(SHOW_CONTINUE_DISCUSSION, error);

      const board = getBoard(file);
      board.showContinueDiscussion = !board.showContinueDiscussion;

      fs.writeFile(path, stringify(board), UTF8, error => {
        if (error) logError(SHOW_CONTINUE_DISCUSSION, error);
        io.to(roomId).emit(SHOW_CONTINUE_DISCUSSION, board);
      });
    });
  });
};

module.exports = {
  updateBoard,
  joinBoard,
  unblurCards,
  setMaxVotes,
  resetVotes,
  toggleContinueDiscussion
};
