//! showdata =>showDataInDialog ///////////
//? showDataForEdit => showDialogForEdit ////////

import { useStyles } from "./DisplayAllFoodItemCss";
import {useState,useEffect} from 'react';
import { serverURL,getData,postData } from "../../services/FetchNodeServices";
import MaterialTable from "@material-table/core"
import { Avatar,Grid,TextField,Button ,Dialog,DialogActions,DialogContent,FormControl,MenuItem,InputLabel,Select} from "@mui/material";
import Heading from "../../components/heading/Heading";


import { UploadFile } from "@mui/icons-material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function DisplayAllFoodItem()
{   var navigate=useNavigate()
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const classes = useStyles();
    const [listFoodItem,setListFoodItem]=useState([]);
    const [open,setOpen]=useState(false);
    
    //?Food Name Data//////////////////////////////////////////////
   const [restaurantId,setRestaurantId]=useState("");
   const [category,setCategory]=useState([]);
   const [categoryId,setCategoryId]=useState("");
   const [foodItemName,setFoodItemName]=useState("");
   const [foodItemId,setFoodItemId]=useState("")
   const [foodType,setFoodType]=useState("");
   const [ingredients,setIngredients]=useState("");
   const [price,setPrice]=useState("");
   const [offerPrice,setOfferPrice]=useState("");
   const [iconData,setIconData]=useState({url:'',bytes:''});
   const [resError,setResError]=useState({});
   const [btnStatus,setBtnStatus]=useState(false);
   const [tempFile,setTempFile]=useState({});

   const handleError = (error,input,message)=>{
    setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}));
  }

  function validation(){
    let submitRecord=true;
    if(!restaurantId)
    {
      handleError(true,'restaurantId',"please Input Restaurant Id")
      submitRecord=false
    }
    
    if(!categoryId)
    {
      handleError(true,'categoryId','please select category')

      submitRecord=false
    }
    if(!foodItemName)
    {
      handleError(true,'foodItemName','please Input Food Item Name')

      submitRecord=false
    }
    if(!ingredients)
    {
      handleError(true,'ingredients','please Input ingredients')

      submitRecord=false
    }
    if(!price)
    {
      handleError(true,'price','please Input price')

      submitRecord=false
    }
    if(!offerPrice)
    {
      handleError(true,'offerPrice','please Input offerPrice')

      submitRecord=false
    }
    // if(!iconData.url)
    // {
    //   handleError(true,'fileFssai','Please Upload Fssai')

    //   submitRecord=false
    // }
    return submitRecord
  }

  const fetchAllCategory=async()=>{
     const result=await postData('category/fetch_all_category',{restaurantid:admin.restaurantid});
     setCategory(result.data);
  }

  useEffect(function(){
      fetchAllCategory()  
  },[]);

  const fillCategory=()=>{
    return category.map((item)=>{
      return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
    });
  }
   

  const handleIcon=(event)=>{
    setIconData({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]});
    setBtnStatus(true)
  }

  const handleSubmit=async()=>{
    if(validation()){
      const body={'restaurantid':restaurantId,'categoryid':categoryId,
      'fooditemname':foodItemName,
      'foodtype':foodType,
      'ingredients':ingredients,
      'price':price,
      'offerprice':offerPrice,
      'icon':iconData.bytes,
      'fooditemid':foodItemId}

      const result=await postData('fooditem/fooditem_edit_data',body);
      
      if(result.status)
      {
        Swal.fire({
          icon: 'success',
          title: 'Food Item Update',
          text: result.message,
          position:'top-end',
            timer:5000,
            showConfirmButton:false,
            toast:true
        })
      }
      else
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message,
          position:'top-end',
            timer:5000,
            showConfirmButton:false,
            toast:true
        })
      }
    }    
}
   //?.///////////////////////////////////////////////////////////////////////////////////

   const handleCancel=()=>{
      setBtnStatus(false);
      setIconData(tempFile)   
  }

  const editImage=async()=>{
    var formData=new FormData()
    formData.append('fooditemid',foodItemId)
    formData.append('icon',iconData.bytes)

    var result=await postData('fooditem/fooditem_edit_icon',formData)
    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Icon Update',
        text: result.message,
        position:'top-end',
            timer:5000,
            showConfirmButton:false,
            toast:true
        
      })
      
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
        position:'top-end',
            timer:5000,
            showConfirmButton:false,
            toast:true

      })
     
    }
  setBtnStatus(false)
}

  const editDeleteButton=()=>{
    return(<div>
      <Button onClick={editImage}>Edit</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </div>)
  }

    const handleEdit=(rowData)=>{
      setRestaurantId(rowData.restaurantid);
      setIconData({url:`${serverURL}/images/${rowData.icon}`,bytes:''})

      setCategoryId(rowData.categoryid);

      setFoodItemName(rowData.fooditemname);
      setFoodType(rowData.foodtype);
      setIngredients(rowData.ingredients);
      setPrice(rowData.price);
      setOfferPrice(rowData.offerprice);
      setFoodItemId(rowData.fooditemid);
      setTempFile({url:`${serverURL}/images/${rowData.icon}`,bytes:''})
  
      setOpen(true); 
    }

    const fetchAllFoodItem=async()=>{
      var result=await postData('fooditem/fetch_all_fooditem',{restaurantid:admin.restaurantid})
      setListFoodItem(result.data);
     }

    const handleDialogClose=()=>{
      setOpen(false);
      fetchAllFoodItem()
     }


     const showDataInDialog=()=>{
      return(<div >
        <div >
          <Grid container spacing={2}>
    
            <Grid item xs={12}>
              <Heading title={"Update Food Item"} />
            </Grid>
            
            <Grid item xs={6}>
               <TextField 
               onFocus={()=>handleError(false,'restaurantId','')}
               error={resError?.restaurantId?.error}
               helperText={resError?.restaurantId?.message}
               label={"Restaurant Id"} fullWidth 
               onChange={(event)=>setRestaurantId(event.target.value)}
               value={restaurantId}/>
            </Grid>
            <Grid item xs={6}>
               <FormControl fullWidth>
                <InputLabel>Category Name</InputLabel>
                <Select label={"Category Name"} onChange={(event)=>setCategoryId(event.target.value)} value={categoryId}>
                  <MenuItem>-Select Category-</MenuItem>
                  {fillCategory()}
                </Select>
               </FormControl>
            </Grid>
    
            <Grid item xs={6}>
               <TextField 
               onFocus={()=>handleError(false,'foodItemName','')}
               error={resError?.foodItemName?.error}
               helperText={resError?.foodItemName?.message}
               label={"Food Item Name"} fullWidth
               onChange={(event)=>setFoodItemName(event.target.value)}
               value={foodItemName}/>
            </Grid>
    
            <Grid item xs={6}>
              <FormControl>
                  <FormLabel >Food Type</FormLabel>
                <RadioGroup row value={foodType}>
                    <FormControlLabel value="Veg" control={<Radio />} label="Veg" 
                      onChange={(event)=>setFoodType(event.target.value)}/>
                    <FormControlLabel value="Non-Veg" control={<Radio />} label="Non Veg" 
                      onChange={(event)=>setFoodType(event.target.value)}/>
                </RadioGroup>
              </FormControl>
            </Grid>
    
            
            <Grid item xs={12}>
               <TextField 
                 onFocus={()=>handleError(false,'ingredients','')}
                 error={resError?.ingredients?.error}
                 helperText={resError?.ingredients?.message}
                 label={"Ingredients"} fullWidth value={ingredients}
                 onChange={(event)=>setIngredients(event.target.value)}/>
            </Grid>
    
            <Grid item xs={6}>
               <TextField 
                 onFocus={()=>handleError(false,'price','')}
                 error={resError?.price?.error}
                 helperText={resError?.price?.message}
                 label={"Price"} fullWidth value={price}
                 onChange={(event)=>setPrice(event.target.value)}/>
            </Grid>
            <Grid item xs={6}>
               <TextField 
                 onFocus={()=>handleError(false,'offerPrice','')}
                 error={resError?.offerPrice?.error}
                 helperText={resError?.offerPrice?.message}
                 label={"Offer Price"} fullWidth value={offerPrice}
                 onChange={(event)=>setOfferPrice(event.target.value)}/>
            </Grid>
    
            <Grid item xs={6}>
               <Button component={"label"} variant={"contained"} endIcon={<UploadFile/>} fullWidth>
                   <input hidden accept="image/*" type="file" onChange={handleIcon}/>
                   Upload Icon
               </Button>
            </Grid>
            <Grid item xs={6} className={classes.center}>
                <Avatar
                  variant="rounded"
                  alt="Remy Sharp"
                  src={iconData.url}
                  sx={{ width: 56, height: 56 }}
                /> 
                <div>
                  {btnStatus?editDeleteButton():<></>}
                </div>
            </Grid>
    
          </Grid>
        </div>
      </div>)
    }


    const showDialogForEdit=()=>{
      return(
       <Dialog
       maxWidth={'md'}
         open={open}>
           <DialogContent  >
               {showDataInDialog()}
           </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit}>Update</Button>
            <Button onClick={handleDialogClose}>Close</Button>
          </DialogActions>
       </Dialog>
      )}

    useEffect(function(){
        fetchAllFoodItem()
    },[]);

    const handleDelete=async(rowData)=>{
      Swal.fire({
        title: 'Do you want to delete the record?',
        showDenyButton: true,
       
        confirmButtonText: 'Delete',
        denyButtonText: `Don't Delete`,
      }).then(async(result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const body={'fooditemid':rowData.fooditemid}; 
          const result=await postData('fooditem/fooditem_delete',body)
           if(result.status)      
          {Swal.fire('Deleted!', '', result.message)
          fetchAllFoodItem()
           }
           else
           Swal.fire('Fail!', '', result.message)
  
        } else if (result.isDenied) {
          Swal.fire('Food item is not Deleted', '', 'info')
        }
      })
    }

    function displayAll() {
        return (
          <MaterialTable
            title="Food Item List"
            columns={[
              { title: 'Restaurant Id', field: 'restaurantid' },
              { title: 'categoryname', field: 'categoryname' },
              { title: 'Food Name', 
                render:rowData=><><b>{rowData.fooditemname}</b><> ({rowData.foodtype})</></> },
              { title: 'Ingredients', field: 'ingredients' },
              { title: 'Price',
              render:rowData=><><s>{rowData.price}</s>/<>{rowData.offerprice}</></>},
              {title:'Icon',
                render:rowData=><div><img src={`${serverURL}/images/${rowData.icon}`} style={{width:50,height:50,borderRadius:10}} /></div>}
            ]}
            data={listFoodItem}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Food Item',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Food Item',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Food Item',
                isFreeAction: true,
                onClick: (event, rowData) => navigate('/admindashboard/fooditeminterface')
              ,}
            ]}
          />
        )
      }


   return(
    <div className={classes.root}>
      <div className={classes.box}>
            {displayAll()}
      </div>
      {showDialogForEdit()}
    </div>
   )

}