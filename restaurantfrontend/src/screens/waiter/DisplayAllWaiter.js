//! showdata =>showDataInDialog ///////////
//? showDataForEdit => showDialogForEdit ////////

import { useStyles } from "./DisplayAllWaiterCss";

import {useState,useEffect} from 'react'
import MaterialTable from "@material-table/core"
import { getData, serverURL,postData } from '../../services/FetchNodeServices';
import {Button ,Dialog,DialogActions,DialogContent} from "@mui/material";
import Heading from '../../components/heading/Heading';
import { useNavigate } from "react-router-dom";


import {Grid,TextField,Select,InputLabel,MenuItem,FormControl,FormHelperText,Avatar} from '@mui/material';
import { UploadFile } from "@mui/icons-material";
import Swal from 'sweetalert2';


import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import UploadIcon from '@mui/icons-material/Upload';


export default function DisplayAllWaiter()
{  var classes = useStyles();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
    var navigate=useNavigate()
    const [listWaiter,setListWaiter]=useState([]);
    const [open,setOpen]=useState(false);

    //?Waiter Data/////////////////////////////////////////////////////////////////////////////////
    const [restaurantId,setRestaurantId]=useState("");
    const [waiterId,setWaiterId]=useState("");
    const [waiterName,setWaiterName]=useState("");
    const [dob,setDob]=useState("");
    const [gender,setGender]=useState("");
    const [emailId,setEmailId]=useState('');
    const [mobileNumber,setMobileNumber]=useState('');
    const [address,setAddress]=useState('');
    const [picture,setPicture]=useState({});

    const [btnStatus,setBtnStatus]=useState(false);
    const [tempFile,setTempFile]=useState({});
    const [resError,setResError]=useState({});
    
    const handlePicture=(event)=>{
      setPicture({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
      setBtnStatus(true)
    }
  
    const handleDate=(event)=>{
      const m=String(Number(event.$M)+1);
      const d=String(event.$D);
      const y=String(event.$y);
      setDob(y+"-"+m+"-"+d);   
    }
  
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
      if(!waiterName)
      {
        handleError(true,'waiterName',"please Input waiter Name")
        submitRecord=false
      }
      if(!mobileNumber || !(/^[0-9]{10}$/).test(mobileNumber))
      {
        handleError(true,'mobileNumber',"Please Input 10 digit Mobile Number")
         
        submitRecord=false
      }
      if(!emailId || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)))
      {
        handleError(true,'emailId',"Please Input Correct Email Address")
         
        submitRecord=false 
      }
      if(!address)
      {
        handleError(true,'address',"please input address")
  
        submitRecord=false;
      }
      if(!picture.url)
      {
        handleError(true,'picture','Please Upload picture')
  
        submitRecord=false
      }
  
      return submitRecord
    }
  
    const handleSubmit=async()=>{
      if(validation()){
  
        const body={'restaurantid':restaurantId,
                    'waiterid':waiterId,
                   'waitername':waiterName,
                   'gender':gender,
                   'dob':dob,
                   'mobileno':mobileNumber,
                   'emailid':emailId,
                   'address':address}
  
        const result=await postData('waiter/waiter_edit_data',body);
        
        if(result.status)
        {
          Swal.fire({
            icon: 'success',
            title: 'Waiter Registration',
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

    const handleCancel=()=>{
      setBtnStatus(false);
      setPicture(tempFile);   
  }

  const editImage=async()=>{
    var formData=new FormData()
    formData.append('waiterid',waiterId)
    formData.append('picture',picture.bytes)

    var result=await postData('waiter/waiter_edit_icon',formData)
    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Picture Update',
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
  setBtnStatus(false);
}

  const editDeleteButton=()=>{
    return(<div>
      <Button onClick={editImage}>Edit</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </div>)
  }


    const fetchAllWaiter=async()=>{
     var result=await postData('waiter/fetch_all_waiter',{restaurantid:admin.restaurantid});
     setListWaiter(result.data);

    }

    const handleEdit=(rowData)=>{
      setRestaurantId(rowData.restaurantid);
      setWaiterId(rowData.waiterid);
      setWaiterName(rowData.waitername);
      setGender(rowData.gender);
      setDob(rowData.dob);
      setMobileNumber(rowData.mobileno);
      setEmailId(rowData.emailid);
      setAddress(rowData.address);
      setPicture({url:`${serverURL}/images/${rowData.picture}`,bytes:''});
      setTempFile({url:`${serverURL}/images/${rowData.picture}`,bytes:''});
      
      setOpen(true);
    }

    const handleDialogClose=()=>{
      setOpen(false);
      fetchAllWaiter();
    }

    const showDataInDialog=()=>{    
      return(<div >
        <div >
          <Grid container spacing={1.4}>

            <Grid item xs={12}>
              <Heading title={"Register Waiter"} />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                onFocus={()=>handleError(false,'restaurantId','')}
                error={resError?.restaurantId?.error}
                helperText={resError?.restaurantId?.message}
                onChange={(event)=>setRestaurantId(event.target.value)}
                label={"Restaurant Id"} fullWidth
                value={restaurantId}
              />
            </Grid>

              <Grid item xs={6}>
                <TextField 
                  onFocus={()=>handleError(false,'waiterName','')}
                  error={resError?.waiterName?.error}
                  helperText={resError?.waiterName?.message}
                  onChange={(event)=>setWaiterName(event.target.value)}
                  label={"Waiter Name"} fullWidth
                  value={waiterName}
                />
              </Grid>

              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>        
                          <DatePicker
                            label="DOB of Waiter"
                            format="DD-MM-YYYY"
                            defaultValue={dayjs(dob)}
                            onChange={handleDate}                           
                          />
                    </DemoContainer>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={6}>
              <FormControl>
                  <FormLabel >Gender</FormLabel>
                <RadioGroup row value={gender}>
                    <FormControlLabel value="Male" control={<Radio />} label="Male" 
                      onChange={(event)=>setGender(event.target.value)}/>
                    <FormControlLabel value="Female" control={<Radio />} label="Female" 
                      onChange={(event)=>setGender(event.target.value)}/>
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
                          <TextField 
                          onFocus={()=>handleError(false,'mobileNumber','')}
                          error={resError?.mobileNumber?.error}
                          helperText={resError?.mobileNumber?.message}
                          onChange={(event)=>setMobileNumber(event.target.value)} 
                          label="Mobile Number" fullWidth
                          value={mobileNumber}/>
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                          onFocus={()=>handleError(false,'emailId','')}
                          error={resError?.emailId?.error}
                          helperText={resError?.emailId?.message}
                          label="Email Address" onChange={(event)=>setEmailId(event.target.value)} fullWidth
                          value={emailId}/>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                          onFocus={()=>handleError(false,'address','')}
                          error={resError?.address?.error}
                          helperText={resError?.address?.message}
                          onChange={(event)=>setAddress(event.target.value)} label="Address" fullWidth
                          value={address}/>
                        </Grid>

                        <Grid item xs={6}>
                          <Button fullWidth component="label" variant="contained" endIcon=    {<UploadIcon/>}>
                              <input 
                              onFocus={()=>handleError(false,'picture','')}
                              hidden onChange={handlePicture} 
                              accept="image/*" multiple type="file"/>
                              Upload Picture
                          </Button>
                          {
                          resError?.picture?.error?<div style={{color:"#d32f2f",fontFamily:'sans-serif',fontSize:'12px',margin:"4px 14px 0px"}}>{resError?.picture?.message}</div>:<></>
                          }
                        </Grid>

                        <Grid item xs={6} className={classes.center}>
                          <Avatar
                            variant="rounded"
                            alt="Remy Sharp"
                            src={picture.url}
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
          maxWidth={"md"}
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
        fetchAllWaiter()
    },[]);

    const handleDelete=async(rowData)=>{
      Swal.fire({
        title: 'Do you want to delete the record?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Don't Delete`,
      }).then(async(result) => {
        
        if (result.isConfirmed) {
          const body={'waiterid':rowData.waiterid}; 
          const result=await postData('waiter/waiter_delete',body);

           if(result.status)      
          {Swal.fire('Deleted!', '', result.message)
          fetchAllWaiter()
           }
           else
           Swal.fire('Fail!', '', result.message)
  
        } else if (result.isDenied) {
          Swal.fire('Waiter is not Deleted', '', 'info')
        }
      })
    }


    function displayAll() {
        return (
          <MaterialTable
            title="Table List"
            columns={[
              { title: 'Restaurant Id', field: 'restaurantid' },
              { title: 'Waiter Name', field:'waitername'},
              { title: 'Gender/ Birth Date' , render:rowData=><><div>{rowData.gender}/</div><>{rowData.dob}</></>},
              { title: 'Mobile No/ Email Id', render:rowData=><><div>{rowData.mobileno}</div><div>{rowData.emailid}</div></>},
              { title: 'Address' , field:'address'},
              { title: 'Picture' , render:rowData=><div><img src={`${serverURL}/images/${rowData.picture}`} style={{width:50,height:50,borderRadius:10}} /></div>}
            ]}
            data={listWaiter}        
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
                onClick: (event, rowData) => navigate('/admindashboard/waiterinterface')
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