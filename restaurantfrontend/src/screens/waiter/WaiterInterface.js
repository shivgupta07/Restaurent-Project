import { useStyles } from "./WaiterInterfaceCss";
import {Grid,TextField,Button,FormControl,Avatar} from '@mui/material';
import Heading from "../../components/heading/Heading";
import { UploadFile } from "@mui/icons-material";

import {useState,useEffect} from 'react';
import { getData,postData} from "../../services/FetchNodeServices";
import Swal from 'sweetalert2';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import UploadIcon from '@mui/icons-material/Upload';


export default function WaiterInterface(){
  const classes = useStyles();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  const [restaurantId,setRestaurantId]=useState("");
  const [waiterName,setWaiterName]=useState("");
  const [dob,setDob]=useState("");
  const [gender,setGender]=useState("");
  const [emailId,setEmailId]=useState('');
  const [mobileNumber,setMobileNumber]=useState('');
  const [address,setAddress]=useState('');
  const [picture,setPicture]=useState({});

  const [resError,setResError]=useState({});
  useEffect(function(){
    setRestaurantId(admin.restaurantid)
  },[])
  const handlePicture=(event)=>{
    setPicture({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
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

    if(restaurantId.length===0)
    {
      handleError(true,'restaurantId',"please Input Restaurant Id")
      submitRecord=false
    }
    if(waiterName.trim().length===0)
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
    if(address.trim().length===0)
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

      const formData=new FormData();
      formData.append('restaurantid',restaurantId);
      formData.append('waitername',waiterName);
      formData.append('gender',gender);
      formData.append('dob',dob);
      formData.append('mobileno',mobileNumber);
      formData.append('emailid',emailId);
      formData.append('address',address);
      formData.append('picture',picture.bytes);

      const result=await postData('waiter/waiter_submit',formData);
      
      if(result.status)
      {
        Swal.fire({
          icon: 'success',
          title: 'Waiter Registration',
          text: result.message
        })
      }
      else
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message,
        })
      }
    }    
}

  return(<div className={classes.root}>
    <div className={classes.box}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Heading title={"Register Waiter"} myroute={'/admindashboard/displayallwaiter'} />
        </Grid>
        
        <Grid item xs={6}>
           <TextField
           disabled
           value={restaurantId}
           label={"Restaurant Id"} fullWidth
            />
        </Grid>

          <Grid item xs={6}>
            <TextField 
            onFocus={()=>handleError(false,'waiterName','')}
            error={resError?.waiterName?.error}
            helperText={resError?.waiterName?.message}
            onChange={(event)=>setWaiterName(event.target.value)}
            label={"Waiter Name"} fullWidth
            />
          </Grid>

          <Grid item xs={6}>
             <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>        
                      <DatePicker
                        label="DOB of Waiter"
                        format="DD-MM-YYYY"
                        onChange={handleDate}
                       
                      />
                 </DemoContainer>
             </LocalizationProvider>
          </Grid>

          <Grid item xs={6}>
          <FormControl>
              <FormLabel >Gender</FormLabel>
            <RadioGroup row >
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
                      label="Mobile Number" fullWidth/>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                      onFocus={()=>handleError(false,'emailId','')}
                      error={resError?.emailId?.error}
                      helperText={resError?.emailId?.message}
                      label="Email Address" onChange={(event)=>setEmailId(event.target.value)} fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                      onFocus={()=>handleError(false,'address','')}
                      error={resError?.address?.error}
                      helperText={resError?.address?.message}
                      onChange={(event)=>setAddress(event.target.value)} label="Address" fullWidth/>
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
                    </Grid>


        <Grid item xs={6}>
            <Button variant="contained" onClick={handleSubmit} fullWidth>Submit</Button> 
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth>Reset</Button>
          </Grid>
        
      </Grid>
    </div>
  </div>)
}