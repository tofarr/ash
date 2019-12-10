import React, { ChangeEvent, FC } from 'react';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, TextField, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import Settings from '../Settings';

export interface SettingsFormProps{
  settings: Settings;
  onChange: (settings: Settings) => void;
  onSubmit?: (settings: Settings) => void;
}

const SettingsForm: FC<SettingsFormProps> = ({ settings, onChange, onSubmit }) => {

  function handleSubmit(){
    if(onSubmit){
      onSubmit(settings);
    }
  }

  function renderGeneralInfo(){
    return (
      <Box p={1}>
        <Typography variant="h6">General Information</Typography>
        <Divider />
        <Box pt={2} pb={2}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth variant="outlined" label="Congregation Name" value={settings.congregation_name}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, congregation_name: event.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth variant="outlined" label="City" value={settings.city}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, city: event.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth variant="outlined" label="Province or State" value={settings.province_or_state}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, province_or_state: event.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth variant="outlined" label="Accounts Servant or Overseer" value={settings.accounts_servant_or_overseer}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, accounts_servant_or_overseer: event.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth variant="outlined" label="Authorized Signer" value={settings.authorized_signer}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, authorized_signer: event.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth variant="outlined" label="Other Account Description" value={settings.other_account_description}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, other_account_description: event.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.cash_box}
                    color="primary"
                    onChange={() => onChange({...settings, cash_box: !settings.cash_box})} />
                }
                label="Use Cash Box for Primary Account" />
            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }

  function renderFormatting(){
    return (
      <Box p={1}>
        <Typography variant="h6">Formatting</Typography>
        <Divider />
        <Box pt={2} pb={2}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField fullWidth variant="outlined"
                label={`Month Format (e.g.: ${moment().format(settings.formatting.date_format)})`}
                value={settings.formatting.date_format}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, formatting: { ...settings.formatting, date_format: event.target.value }})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth variant="outlined"
                label={`Month Format (e.g.: ${moment().format(settings.formatting.month_format)})`}
                value={settings.formatting.month_format}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({...settings, formatting: { ...settings.formatting, month_format: event.target.value }})} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }

  function renderMeetingDays(){
    return (
      <Box p={1}>
        <Typography variant="h6">Meeting Days</Typography>
        <Divider />
        <Box pt={2} pb={2}>
          <Grid container spacing={1} alignItems="center">
            {renderMeetingDay('sun', 'Sunday')}
            {renderMeetingDay('mon', 'Monday')}
            {renderMeetingDay('tue', 'Tuesday')}
            {renderMeetingDay('wed', 'Wednesday')}
            {renderMeetingDay('thu', 'Thursday')}
            {renderMeetingDay('fri', 'Friday')}
            {renderMeetingDay('sat', 'Saturday')}
          </Grid>
        </Box>
      </Box>
    );
  }

  function renderMeetingDay(attr: 'sun'|'mon'|'tue'|'wed'|'thu'|'fri'|'sat', label: string){
    return (
      <Grid item xs={6} sm={4} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.meeting_days[attr]}
              color="primary"
              onChange={() => {
                const meeting_days = { ...settings.meeting_days };
                meeting_days[attr] = !meeting_days[attr];
                onChange({...settings, meeting_days})
            }} />
          }
          label={label} />
      </Grid>
    )
  }

  function renderButton(){
    return (
      <Box p={1}>
        <Grid container justify="flex-end">
          <Grid item xs sm="auto">
            <Button fullWidth variant="contained" type="submit" color="primary">
              <EditIcon />
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {renderGeneralInfo()}
      {renderFormatting()}
      {renderMeetingDays()}
      {renderButton()}
    </form>
  );
}

export default SettingsForm;
