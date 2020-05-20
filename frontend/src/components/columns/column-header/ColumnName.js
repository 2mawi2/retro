import React from "react";

import { Typography } from "@material-ui/core";
import { COLUMN_NAME } from "../../../constants/testIds";

function ColumnName(props) {
  const { columnTitle } = props;

  return (
    <Typography variant="subtitle2" data-testid={COLUMN_NAME}>
      {columnTitle}
    </Typography>
  );
}

export default ColumnName;
