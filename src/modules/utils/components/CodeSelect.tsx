import React, { Fragment, ReactElement, ReactNode, useState } from 'react';
import { Box, Button, Dialog, Grid, TextField } from '@material-ui/core';

export interface CodeSelectProps<T>{
  label: string;
  options: T[];
  value?: T;
  required?: boolean;
  keyFn: (option?:T) => string|number|undefined;
  titleFn: (option?:T) => string;
  descriptionFn: (option?:T) => string|ReactNode;
  onChange: (option?:T) => void;
}

// normal function
function CodeSelect<T>(props: CodeSelectProps<T>): ReactElement<CodeSelectProps<T>> {
  const { label, options, value, required, keyFn, titleFn, descriptionFn, onChange } = props;
  const [open,setOpen] = useState(false);
  const [focus, setFocus] = useState(false);

  function handleFocus(){
    if(!focus){
      setFocus(true);
      setOpen(true);
    }
  }

  function handleBlur(){
    if(!open){
      setFocus(false);
    }
  }

  function handleClick(){
    setOpen(true);
  }

  return (
    <Fragment>
      <TextField
        fullWidth
        label={label}
        value={titleFn(value)}
        variant="outlined"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        inputProps={{ style: {caretColor: 'transparent'} }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={1}>
          <Grid container spacing={1} direction="column">
            { !required &&
              <Grid item>
                <Button fullWidth variant="contained" onClick={() => {
                  setOpen(false);
                  onChange(undefined);
                }}>
                    <Grid container>
                      <Grid item>
                        None
                      </Grid>
                    </Grid>
                </Button>
              </Grid>
            }
            {options.map((option) => (
              <Grid item key={keyFn(option)}>
                <Button fullWidth variant="contained" onClick={() => {
                  setOpen(false);
                  onChange(option);
                }} style={{textAlign: 'left'}}>
                  {descriptionFn(option)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Dialog>
    </Fragment>
  );
}

export default CodeSelect;
