import {useState} from 'react';
import {Avatar,Paper,Grid,AppBar,Toolbar,Box,Typography} from '@mui/material';
import { makeStyles } from "@mui/styles";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Route,Routes } from 'react-router-dom';
import RestaurantInterface from '../restaurant/RestaurantInterface'
import DisplayAllRestaurant from '../restaurant/DisplayAllRestaurant';
import CategoryInterface from '../Category/CategoryInterface';
import { useNavigate } from 'react-router-dom';
import { serverURL } from '../../services/FetchNodeServices';
const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "60%",
    height: "auto",
    borderRadius: "10",
    background: "#fff",
    padding: 15,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  leftBarStyle:{
    padding:5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin:5,
    flexDirection:'column'
  },
  nameStyle:{
    fontFamily:'Kanit',
    fontSize:16,
    fontWeight:'bold',
    marginTop:5,
    marginBottom:2
  },
  phoneStyle:{
    fontFamily:'Kanit',
    fontSize:12,
    fontWeight:'bold',
    color:'#636e72'
  },
  emailStyle:{
    fontFamily:'Kanit',
    fontSize:12,
    fontWeight:'bold',
    color:'#636e72'
  },
  menuStyle:{
    fontFamily:'Kanit',
    fontSize:18,
    fontWeight:'bold',
    justifyContent:'left',
    width:250
  },
  menuItemStyle:{
    fontFamily:'Kanit',
    fontSize:16,
    fontWeight:'bold',
  }
});
export default function Dashboard(props){
    var classes=useStyles()
    var navigate=useNavigate()
    var sa=JSON.parse(localStorage.getItem('SUPER'))
    const handleLogout=()=>{
      localStorage.clear()
      navigate('/loginpage')
    }
    return(
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            
            <Typography variant="h6" color="inherit" component="div">
              Super Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container space={3}>
            <Grid item xs={2}>
          <Paper className={classes.leftBarStyle}>
            <Avatar src={`${serverURL}/images/${sa.picture}`} variant='circular' style={{width:80,height:80}}/>
            <div className={classes.nameStyle}>{sa.superadminname}</div>
            <div className={classes.emailStyle}>{sa.emailid}</div>
            <div className={classes.phoneStyle}>+919993227745</div>
            <div className={classes.menuStyle}>

         <List>
          <ListItem disablePadding>
            <ListItemButton onClick={()=>navigate('/dashboard/restaurantinterface')}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Add Restaurant</span>}/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={()=>navigate('/dashboard/displayallrestaurant')}>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Restaurant List</span>}/> 
            </ListItemButton>
          </ListItem>
          <Divider variant='middle' />
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Logout</span>}/> 
            </ListItemButton>
            </ListItem>
          
        </List>
      

 </div>
         
          </Paper>
          
            </Grid>
            <Grid item xs={10} style={{padding:25,background: "#dfe4ea",height:'auto'}}>
                <Routes>
                <Route element={<RestaurantInterface/>} path='/restaurantinterface'/>
        <Route element={<DisplayAllRestaurant/>} path='/displayallrestaurant'/>
        
                </Routes>
            </Grid>

        </Grid>
      </Box>
    )
}