import React from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";

import NameInput from "./NameInput";
import CreateColumnButton from "./buttons/CreateColumnButton";
import UnblurCardsButton from "./buttons/UnblurCardsButton";
import ExportBoardButton from "./buttons/ExportBoardButton";
import ShowQrCodeButton from "./buttons/ShowQrCodeButton";
import VoteCountButton from "./buttons/VoteCountButton";

const BoardHeader = props => {
  const { classes, boardId, title, maxVoteCount } = props;
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid item>
          <NameInput boardId={boardId} />
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <CreateColumnButton className={classes.button} boardId={boardId} />
        <UnblurCardsButton className={classes.button} boardId={boardId} />
        <ExportBoardButton className={classes.button} boardId={boardId} />
        <ShowQrCodeButton className={props.classes.button} />
        <VoteCountButton
          className={classes.button}
          boardId={boardId}
          maxVoteCount={maxVoteCount}
        />
      </Grid>
    </>
  );
};

const styles = theme => ({
  button: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1)
  }
});

export default withStyles(styles)(BoardHeader);
