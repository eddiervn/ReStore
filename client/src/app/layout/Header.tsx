import { AppBar, Box, FormControlLabel, Switch, Toolbar, Typography } from "@mui/material";

interface Props{
  darkMode: boolean,
  handleThemeChange: () => void;
}

export default function Header({darkMode,  handleThemeChange} : Props) {

  return (
   <AppBar position="fixed">
     <Toolbar>
       <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
              RE-STORE
          </Typography>
        </Box>
        <label>
          <Switch checked={darkMode} size='small'  onChange={ handleThemeChange }/>
          <small style={{fontWeight: 'light', userSelect: 'none'}}>Dark Mode</small>
        </label>
     </Toolbar>
   </AppBar>      
  )
}
