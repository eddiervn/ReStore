import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

interface Props{
  darkMode: boolean,
  handleThemeChange: () => void;
}

const midLinks = [
  {title: 'Catalog', path: '/catalog'},
  {title: 'About', path: '/about'},
  {title: 'Contact', path: '/contact'}
]

const rightLinks = [
  {title: 'Login', path: '/login'},
  {title: 'Register', path: '/register'}
]

export default function Header({darkMode,  handleThemeChange} : Props) {

  function renderListItem(title: string,path:string){
    return  <ListItem 
      component={NavLink} 
      to={path} 
      key={path} 
      sx={{color: 'inherit', '&:hover': {color: '#BBDEFB'}, '&.active': {color: '#FFCC80'}}}>
      {title.toUpperCase()}
      </ListItem>;
  }

  return (
   <AppBar position="fixed">
     <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component={NavLink} to='/' color="inherit" sx={{textDecoration: 'none', mr: 1}}>
            RE-STORE
          </Typography>
          <label>
            <Switch checked={darkMode} size='small'  onChange={ handleThemeChange }/>
            <small style={{fontWeight: '300', userSelect: 'none'}}>Dark Mode</small>
          </label>
        </Box>
       
        <Box display="flex" alignItems="center">
          <List sx={{display: 'flex'}}>
            { midLinks.map(({title, path}) =>  renderListItem(title, path)) }
          </List>
          <IconButton size="large" edge="start" color="inherit" sx={{mr: 2}}>
            <Badge badgeContent="4" color="warning">
              <ShoppingCart/>
            </Badge>
          </IconButton>
        </Box>
        
        <List sx={{display: 'flex'}}>
          { rightLinks.map(({title, path}) =>  renderListItem(title, path)) }
        </List>
     </Toolbar>
   </AppBar>      
  )
}
