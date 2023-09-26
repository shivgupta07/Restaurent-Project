
import {useState,useEffect} from 'react'
import MaterialTable from "@material-table/core"
import { serverURL,getData,postData } from "../../services/FetchNodeServices";
import { Avatar,Grid,TextField,Button ,Dialog,DialogActions,DialogContent,FormControl,} from "@mui/material";
import Heading from "../../components/heading/Heading";
import UploadFile from '@mui/icons-material/UploadFile';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
var useStyles=makeStyles({
    rootDisplay: {
        width:"auto",
        height:"90vh",
        background:"#dfe4ea",
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
      },
      boxDisplay:{
        width:"80%",
        height:"auto",
        borderRadius:10,
        background:"#fff",
        padding:15,
        marginBlock:'40px',
        boxShadow:"0 0 15px #222"
      },
      center:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }
    
})
export default function DisplayAllCategory()
{  const classes = useStyles();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  const navigate=useNavigate()

  const [listCategory,setListCategory]=useState([]);
  const [open,setOpen]=useState(false)

  const [restaurantId,setRestaurantId]=useState();
  const [categoryName,setCategoryName]=useState();
  const [icon,setIcon]=useState({url:'',bytes:''});
  const [categoryId,setCategoryId]=useState("");
  const [categoryError,setCategoryError]=useState({});
  const [btnStatus,setBtnStatus]=useState(false)
  const [tempFile,setTempFile]=useState({})

  const handleError=(error,input,message)=>{
    setCategoryError(prevState => ({...prevState, [input]:{'error':error,'message':message}}));

  };

  const validation=()=>
  {  let submitRecord=true

     if(!restaurantId)
     {
      handleError(true,'restaurantId',"Pls Input Restaurant Id"); 
      submitRecord=false;
     }

     
     if(!categoryName)
     {
      handleError(true,'categoryName',"Pls Input Category Name"); 
      submitRecord=false;
     }
     if(!icon.url)
    {
     handleError(true,'icon',"Pls Upload Icon")
      
     submitRecord=false
    }
    
    return submitRecord
  } 

  const handleIcon=(event)=>{
    setIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]});
    setBtnStatus(true)  
  }

 
  const handleSubmit=async()=>
  {
    if(validation()){

    const body={'restaurantid':restaurantId,
    'categoryname':categoryName,
    'categoryid':categoryId
  }
    
    var result=await postData('category/category_edit_data',body);
    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Category Registration',
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

  const handleCancel=()=>{
    setBtnStatus(false);
    setIcon(tempFile)
  }

  const editImage=async()=>{
    var formData=new FormData()
    formData.append('categoryid',categoryId)
    formData.append('icon',icon.bytes)

    var result=await postData('category/category_edit_icon',formData)
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

  const fetchAllCategory=async()=>{
   var result=await postData('category/fetch_all_category',{restaurantid:admin.restaurantid})
   setListCategory(result.data)

  };

  const handleEdit=(rowData)=>{
    setRestaurantId(rowData.restaurantid);
    setCategoryName(rowData.categoryname);
    setIcon({url:`${serverURL}/images/${rowData.icon}`,bytes:''})
    setCategoryId(rowData.categoryid);
    setTempFile({url:`${serverURL}/images/${rowData.icon}`,bytes:''})

    setOpen(true); 
  }

  const handleDialogClose=()=>{
    setOpen(false);
    fetchAllCategory()
   }

  const showDataInDialog=()=>{
    return(<div  >
      <div >
  
      <Grid container spacing={2}>
          
          <Grid item xs={12}>
            <Heading title={"Register Category"}/>
          </Grid>
  
          <Grid item xs={12}>
            <TextField onChange={(event)=>setRestaurantId(event.target.value)} 
            onFocus={()=>handleError(false,'restaurantId','')}
            error={categoryError?.restaurantId?.error}
            helperText={categoryError?.restaurantId?.message} 
            value={restaurantId}
            label="Restaurant Id" fullWidth/>
          </Grid>
  
          <Grid item xs={12}>
            <TextField onChange={(event)=>setCategoryName(event.target.value)} 
            onFocus={()=>handleError(false,'categoryName','')}
            error={categoryError?.categoryName?.error}
            helperText={categoryError?.categoryName?.message}
            value={categoryName}
            label="Category Name" fullWidth/>
          </Grid>
  
          <Grid item xs={6}>     
            <Button fullWidth component="label" variant="contained" endIcon={<UploadFile />}>
            <input hidden onChange={handleIcon}
                accept="image/*"
                type="file"
                onFocus={()=>handleError(false,'icon','')}
            />
              Upload Icon
            </Button>
            {categoryError?.icon?.error?<div style={{color:"#d32f2f",fontFamily:'sans-serif',fontSize:'12px',margin:"4px 14px 0px"}}>{categoryError?.icon?.message}</div>:<></> }
          </Grid>
          <Grid item xs={6}>
              </Grid>
  
          <Grid item xs={6} className={classes.center}>
              <Avatar
                variant="rounded"
                alt="Remy Sharp"
                src={icon.url}
                sx={{ width: 56, height: 56 }}
              />
              <div>
                {btnStatus?editDeleteButton():<></>}
              </div>
            </Grid>
  
              <Grid item xs={6}>
              </Grid>
                 
  
      </Grid>
      </div>
  </div>)
  }

  const showDialogForEdit=()=>{
    return(
     <Dialog
     maxWidth={'sm'}
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
      fetchAllCategory()
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
        const body={'categoryid':rowData.categoryid}; 
        const result=await postData('category/category_delete',body)
         if(result.status)      
        {Swal.fire('Deleted!', '', result.message)
        fetchAllCategory()
         }
         else
         Swal.fire('Fail!', '', result.message)

      } else if (result.isDenied) {
        Swal.fire('Category not Deleted', '', 'info')
      }
    })
  }

  function displayAll() {
    return (
      <MaterialTable
        title="Category List"
        columns={[
          { title: 'RestaurantId', field: 'restaurantid' },
          { title: 'CategoryName', field: 'categoryname' },
          { title: 'Icon', 
              render:rowData=><div><img src={`${serverURL}/images/${rowData.icon}`}  style={{width:50,height:50,borderRadius:10}} /></div> }
          
        ]}
        data={listCategory}        
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit category',
            onClick: (event, rowData) => handleEdit(rowData)
          },
          {
            icon: 'delete',
            tooltip: 'Delete category',
            onClick: (event, rowData) => handleDelete(rowData)
          },
          {
            icon: 'add',
            tooltip: 'Add Restaurant',
            isFreeAction: true,
            onClick: (event, rowData) => navigate("/admindashboard/categoryinterface")
          ,}
        ]}
      />
    )
  }

   return(
    <div className={classes.rootDisplay}>
      <div className={classes.boxDisplay}>
      {displayAll()}
    </div>
      {showDialogForEdit()}
    </div>
   )
}   