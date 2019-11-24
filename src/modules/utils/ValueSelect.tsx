import React, { Fragment, ReactElement, useState } from 'react';
import { Box, Button, Dialog, Grid, TextField } from '@material-ui/core';

export interface ValueSelectProps<T>{
  label: string;
  options: T[];
  value?: T;
  keyFn: (option?:T) => string|number|undefined;
  titleFn: (option?:T) => string;
  onChange: (option?:T) => void;
}

// normal function
function ValueSelect<T>(props: ValueSelectProps<T>): ReactElement<ValueSelectProps<T>> {
  const { label, options, value, keyFn, titleFn, onChange } = props;
  const [open,setOpen] = useState(false);
  const [focus, setFocus] = useState(false);

  function handleFocus(newFocus: boolean){
    if(newFocus && !focus){
      setOpen(true);
      setFocus(true);
    }else if(!open){
      setFocus(false);
    }
  }

  return (
    <Fragment>
      <TextField
        fullWidth
        label={label}
        value={titleFn(value)}
        variant="outlined"
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        onClick={() => setOpen(true)}
        inputProps={{ style: {caretColor: 'transparent'} }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={1}>
          <Grid container spacing={1} direction="column">
            {options.map((option) => (
              <Grid item key={keyFn(option)}>
                <Button fullWidth variant="contained" onClick={() => {
                  setOpen(false);
                  onChange(option);
                }}>
                  {titleFn(option)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Dialog>
    </Fragment>
  );
}

export default ValueSelect;
