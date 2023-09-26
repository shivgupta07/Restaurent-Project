//! showdata =>showDataInDialog ///////////
//? showDataForEdit => showDialogForEdit ////////

import {useState,useEffect} from 'react'
import MaterialTable from "@material-table/core"
import { useStyles } from './DisplayAllTableCss';
import { getData, serverURL,postData } from '../../services/FetchNodeServices';
import {Button ,Dialog,DialogActions,DialogContent} from "@mui/material";
import Heading from '../../components/heading/Heading';
import { useNavigate } from 'react-router-dom';

import {Grid,TextField,Select,InputLabel,MenuItem,FormControl,FormHelperText} from '@mui/material';
import { UploadFile } from "@mui/icons-material";
import Swal from 'sweetalert2';



export default function DisplayAllTable()
{  var classes = useStyles();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
   var navigate=useNavigate()
    const [listTable,setListTable]=useState([]);
    const [open,setOpen]=useState(false);

    //?table Data/////////////////////////////////////////////////////////////////////////////////

    const [restaurantId,setRestaurantId]=useState("");
  const [floor,setFloor]=useState("");
  const [tableNo,setTableNo]=useState("");
  const [tableId,setTableId]=useState("")
  const [noOfChairs,setNoOfChairs]=useState("");
  const [resError,setResError]=useState({});
  
  const handleError = (error,input,message)=>{
    setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}));
  }

  function validation(){
    let submitRecord=true;
    //  alert(restaurantId)
    //  alert(floor)
    //  alert(tableNo)
    //  alert(noOfChairs)   
    if(!restaurantId)
    //if(!restaurantId)
    {
      handleError(true,'restaurantId',"please Input Restaurant Id")
      submitRecord=false
    }
    if(!noOfChairs)
    //if(!noOfChairs)
    {
      handleError(true,'noOfChairs',"please Input No of Chairs")
      submitRecord=false
    }
    if(!tableNo)
    //if(!tableNo)
    {
      handleError(true,'tableNo',"please Input Table No")
      submitRecord=false
    }
   
    if(!floor)
    {
      handleError(true,'floor',"please Input floor")
      submitRecord=false
    }

    return submitRecord
  }

  const handleSubmit=async()=>{
    console.log(restaurantId,floor,tableNo,noOfChairs);
    if(validation()){

      const body={'restaurantid':restaurantId,
                  'floor':floor,
                  'tableno':tableNo, 
                  'noofchairs':noOfChairs,
                  'tableid':tableId}

      const result=await postData('tablebooking/table_edit_data',body);
      
      if(result.status)
      {
        Swal.fire({
          icon: 'success',
          title: 'Table',
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
    //?.////////////////////////////////////////////////////////////////////////////////////

    const fetchAllTable=async()=>{
     var result=await postData('tablebooking/fetch_all_table',{restaurantid:admin.restaurantid});
     setListTable(result.data);

    }

    const handleEdit=(rowData)=>{
      setRestaurantId(rowData.restaurantid);
      setFloor(rowData.floor);
      setTableNo(rowData.tableno);
      setNoOfChairs(rowData.noofchairs);
      setTableId(rowData.tableid);
      setOpen(true);
    }

    const handleDialogClose=()=>{
      setOpen(false);
      fetchAllTable();
     }

    const showDataInDialog=()=>{
      return(<div >
        <div >
          <Grid container spacing={2}>
    
            <Grid item xs={12}>
              <Heading title={"Register Table"} />
            </Grid>
            
            <Grid item xs={6}>
               <TextField
               value={restaurantId}
               onFocus={()=>handleError(false,'restaurantId','')}
               error={resError?.restaurantId?.error}
               helperText={resError?.restaurantId?.message} 
               label={"Restaurant Id"} fullWidth
               onChange={(event)=>setRestaurantId(event.target.value)}
               
            />
            </Grid>
            <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Floor</InputLabel>
                    <Select label="Floor" 
                      onFocus={()=>handleError(false,'floor','')}
                      error={resError?.floor?.error}
                      onChange={(event)=>setFloor(event.target.value)} value={floor}>
                      <MenuItem>-Select Floor-</MenuItem>
                      <MenuItem value="Roof Top">Roof Top</MenuItem>
                      <MenuItem value="Floor 1">Floor 1</MenuItem>
                      <MenuItem value="Floor 2">Floor 2</MenuItem>
                      <MenuItem value="Floor 3">Floor 3</MenuItem>
                      <MenuItem value="Floor 4">Floor 4</MenuItem>
                      <MenuItem value="Floor 5">Floor 5</MenuItem>
                      <MenuItem value="Floor 6">Floor 6</MenuItem>
                    </Select>
                    <FormHelperText style={{color:"#d32f2f"}}>
                       {resError?.floor?.message}
                    </FormHelperText>
                  </FormControl>
              </Grid>
    
              <Grid item xs={6}>
                <TextField 
                onFocus={()=>handleError(false,'tableNo','')}
                error={resError?.tableNo?.error}
                helperText={resError?.tableNo?.message}
                label={"Table No"} fullWidth
                onChange={(event)=>setTableNo(event.target.value)}
                value={tableNo}/>
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  onFocus={()=>handleError(false,'noOfChairs','')}
                  error={resError?.noOfChairs?.error}
                  helperText={resError?.noOfChairs?.message} 
                  label={"No of Chairs"} fullWidth
                  onChange={(event)=>setNoOfChairs(event.target.value)}
                  value={noOfChairs}/>
              </Grid>
            
          </Grid>
        </div>
      </div>)
    } 

    const showDialogForEdit=()=>{
      return(
        <Dialog
          maxWidth={"sm"}
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
        fetchAllTable()
    },[]);

    const handleDelete=async(rowData)=>{
      Swal.fire({
        title: 'Do you want to delete the record?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Don't Delete`,
      }).then(async(result) => {
        
        if (result.isConfirmed) {
          const body={'tableid':rowData.tableid}; 
          const result=await postData('tablebooking/table_delete',body)
           if(result.status)      
          {Swal.fire('Deleted!', '', result.message)
          fetchAllTable()
           }
           else
           Swal.fire('Fail!', '', result.message)
  
        } else if (result.isDenied) {
          Swal.fire('Table is not Deleted', '', 'info')
        }
      })
    }


    function displayAll() {
        return (
          <MaterialTable
            title="Table List"
            columns={[
              { title: 'RestaurantId', field: 'restaurantid' },
              { title: 'Floor', field:'floor'},
              { title: 'Table No', field:'tableno'},
              { title: 'No of Chairs', field:'noofchairs'}
        
            ]}
            data={listTable}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Table',
                onClick:  (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Table',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Table',
                isFreeAction:true,
                onClick: (event, rowData) => navigate('/admindashboard/tablebookinginterface')
              }
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