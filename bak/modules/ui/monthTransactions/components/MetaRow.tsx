import React, { FC} from 'react';
import { Box,  Grid } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

export interface MetaRowProps {
  receipts?: any;
  primary?: any;
  other?: any;
}

const MetaRow: FC<MetaRowProps> = ({ receipts, primary, other }) => {

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));


  return <Box pt={1} pb={1} p={2}>
    <Grid container justify="flex-end">
      <Grid item xs={smUp ? 2 : 4} style={{textAlign: 'right'}}>
        {receipts}
      </Grid>
      <Grid item xs={smUp ? 2 : 4} style={{textAlign: 'right'}}>
        {primary}
      </Grid>
      <Grid item xs={smUp ? 2 : 4} style={{textAlign: 'right'}}>
        {other}
      </Grid>
    </Grid>
  </Box>
}

export default MetaRow;
