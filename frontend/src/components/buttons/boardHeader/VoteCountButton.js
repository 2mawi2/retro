import React, { useState, useContext } from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IncrementIcon from "@material-ui/icons/Add";
import DecrementIcon from "@material-ui/icons/Remove";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  withMobileDialog,
  Grid,
  Typography,
  DialogContentText,
} from "@material-ui/core";

import { defaultBoard } from "../../../utils";
import { ROLE_MODERATOR } from "../../../utils/userUtils";
import { BoardContext } from "../../../context/BoardContext";
import { UserContext } from "../../../context/UserContext";
import { VOTE_COUNT_BUTTON } from "../../../constants/testIds";
import { SET_MAX_VOTES, RESET_VOTES } from "../../../constants/eventNames";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function VoteCountButton(props) {
  const { fullScreen } = props;
  const { boardId, socket } = useContext(BoardContext);
  const { userState, setMaxVote, resetVotes } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [voteCount, setVoteCount] = useState(getVoteCount());
  const classes = useStyles();

  function getVoteCount() {
    if (userState.maxVoteCount) return userState.maxVoteCount;
    return defaultBoard.maxVoteCount;
  }

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function incr() {
    setVoteCount(voteCount + 1);
  }

  function decr() {
    setVoteCount(voteCount - 1);
  }

  function isDecrementDisabled() {
    return voteCount < 1;
  }

  function handleCancel() {
    setVoteCount(getVoteCount());
    closeDialog();
  }

  function handleSave() {
    socket.emit(SET_MAX_VOTES, voteCount, boardId);
    setMaxVote(boardId, voteCount);
    closeDialog();
  }

  function handleReset() {
    socket.emit(RESET_VOTES, boardId);
    resetVotes(boardId, voteCount);
    setVoteCount(getVoteCount());
    closeDialog();
  }

  return (
    <div>
      <Button
        size="small"
        variant="outlined"
        aria-label="Set Vote Count"
        color="primary"
        onClick={openDialog}
        disabled={userState.role !== ROLE_MODERATOR}
        data-testid={VOTE_COUNT_BUTTON}
        fullWidth
      >
        <ThumbUpIcon style={{ marginRight: 5 }} />
        Vote Count
      </Button>
      <Dialog
        fullWidth
        maxWidth="xs"
        fullScreen={fullScreen}
        open={open}
        onClose={closeDialog}
        aria-labelledby="vote-count-dialog"
        aria-describedby="vote-count-dialog-description"
      >
        <DialogTitle id="vote-count-dialog">Vote Count Settings</DialogTitle>
        <DialogContent>
          <DialogContentText id="vote-count-dialog-description">
            Set your maximum vote count or reset all votes.
          </DialogContentText>
          <hr />
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <Typography variant="body1">
                Everybody has <strong>{voteCount}</strong> votes.
              </Typography>
            </Grid>
            <br />
            <Grid item>
              <Button
                variant="contained"
                size="small"
                className={classes.button}
                aria-label="Increase Vote Count"
                onClick={incr}
              >
                <IncrementIcon fontSize="small" />
                Increase
              </Button>
              <Button
                variant="contained"
                size="small"
                className={classes.button}
                aria-label="Decrease Vote Count"
                disabled={isDecrementDisabled()}
                onClick={decr}
              >
                <DecrementIcon fontSize="small" />
                Decrease
              </Button>
            </Grid>
          </Grid>
          <hr />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleReset}>
            Reset Votes
          </Button>
          <Button color="primary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withMobileDialog()(VoteCountButton);
