import { useStyles } from "./TableBookingInterfaceCss"
import {Grid,TextField,Button,Select,InputLabel,MenuItem,FormControl,FormHelperText} from '@mui/material';
import Heading from "../../components/heading/Heading";
import { UploadFile } from "@mui/icons-material";

import {useState,useEffect} from 'react';
import { getData,postData} from "../../services/FetchNodeServices";
import Swal from 'sweetalert2';

export default function TableBookingInterface(){
  const classes = useStyles();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  const [restaurantId,setRestaurantId]=useState("");
  const [floor,setFloor]=useState("");
  const [tableNo,setTableNo]=useState("");
  const [noOfChairs,setNoOfChairs]=useState("");
  const [resError,setResError]=useState({});
  useEffect(function(){
    setRestaurantId(admin.restaurantid)
  
    },[])
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
    if(noOfChairs.trim().length===0)
    {
      handleError(true,'noOfChairs',"please Input No of Chairs")
      submitRecord=false
    }
    if(tableNo.trim().length===0)
    {
      handleError(true,'tableNo',"please Input Table No")
      submitRecord=false
    }
    if(floor.trim().length===0)
    {
      handleError(true,'floor',"please Input floor")
      submitRecord=false
    }

    return submitRecord
  }

  const handleSubmit=async()=>{
    console.log(restaurantId,floor,tableNo,noOfChairs);
    if(validation()){

      const formData=new FormData();
      formData.append('restaurantid',restaurantId);
      formData.append('floor',floor);
      formData.append('tableno',tableNo);
      formData.append('noofchairs',noOfChairs);

      const result=await postData('tablebooking/table_submit',formData);
      
      if(result.status)
      {
        Swal.fire({
          icon: 'success',
          title: 'Food Item Registration',
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
          <Heading title={"Register Table"} myroute={'/admindashboard/displayalltable'}/>
        </Grid>
        
        <Grid item xs={6}>
           <TextField
           disabled
           value={restaurantId} 
           label={"Restaurant Id"} fullWidth />
            
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
            onChange={(event)=>setTableNo(event.target.value)}/>
          </Grid>
          <Grid item xs={6}>
            <TextField 
              onFocus={()=>handleError(false,'noOfChairs','')}
              error={resError?.noOfChairs?.error}
              helperText={resError?.noOfChairs?.message} 
              label={"No of Chairs"} fullWidth
              onChange={(event)=>setNoOfChairs(event.target.value)}/>
          </Grid>

          <Grid item xs={6}>
            <Button onClick={handleSubmit} variant="contained" fullWidth>Submit</Button> 
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth>Reset</Button>
          </Grid>
        
      </Grid>
    </div>
  </div>)
}