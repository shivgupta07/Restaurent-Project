import {useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { getData,serverURL,postData } from '../../services/FetchNodeServices'
import FoodComponent from '../FoodComponent/FoodComponent';


export default function CategoryComponent(props) {
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [listCategory,setListCategory]=useState([]);
    const [categoryid,setCategoryid]=useState('');
    const [open,setOpen]=useState(false);
   
    const fetchAllCategory=async()=>{
        var result=await postData('category/fetch_all_category',{restaurantid:admin.restaurantid})
        setListCategory(result.data)
     
       };

    useEffect(function(){
        fetchAllCategory()
    },[]);

    const handleFoodListDialog=(cid)=>{
    setCategoryid(cid)
    setOpen(true)
    }

    const showCategoryList=()=>{
        return listCategory.map((item)=>{
        return(
         <div> <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
         <ListItemButton alignItems="flex-start" onClick={()=>handleFoodListDialog(item.categoryid)}>
           <ListItemAvatar>
             <Avatar alt="Remy Sharp"  src={`${serverURL}/images/${item.icon}`} sx={{width:30,height:30}} />
           </ListItemAvatar>
           <ListItemText
             primary={item.categoryname}
            
           />
         </ListItemButton>
         <Divider variant="inset" component="li" />
         </List>
      </div> )
      })
    }
    

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {showCategoryList()}
      <FoodComponent categoryid={categoryid} tableNo={props.tableNo} floorNo={props.floorNo} setOpen={setOpen}open={open} refresh={props.refresh} setRefresh={props.setRefresh}/>
    </Box>
  );
}