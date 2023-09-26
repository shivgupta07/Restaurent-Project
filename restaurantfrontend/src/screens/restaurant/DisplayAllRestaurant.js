import MaterialTable from "@material-table/core"
import { useState,useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import UploadFile from "@mui/icons-material/UploadFile";
import Swal from 'sweetalert2'
import { serverURL, getData, postData } from "../../services/FetchNodeServices";
import Heading from "../../components/heading/Heading";
const useStyles = makeStyles({
  rootdisplay: {
    width: "auto",
    height: "90vh",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  boxdisplay: {
    width: "80%",
    height: "auto",
    borderRadius: "10",
    background: "#fff",
    padding: 15,
  },
  root: {
    
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    
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
  
});

export default function DisplayAllRestaurant()
{
    var classes = useStyles();
    const [listRestaurant,setListRestaurant]=useState([])
    const [open,setOpen]=useState(false)
    //////////////// Restaurant Data /////////////
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateid, setStateId] = useState("");
  const [restaurantid, setRestaurantId] = useState("");
  const [cityid, setCityId] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailid, setEmailId] = useState("");
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState("");
  const [fssai, setFssai] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [gstType, setGstType] = useState("");
  const [fileFssai, setFileFssai] = useState({ url: "", bytes: "" });
  const [fileShopAct, setFileShopAct] = useState({ url: "", bytes: "" });
  const [fileLogo, setFileLogo] = useState({ url: "", bytes: "" });
  const[resError,setResError]=useState({})
  const [btnStatus,setBtnStatus]=useState({fssai:false,shopAct:false,logo:false})
  const [tempFile,setTempFile]=useState({fssai:'',shopAct:'',logo:''})

  const handleError = (error,input,message)=>{
    setResError(prevState=>({...prevState,[input]:{'error':error,'message':message}}));
  };

const validation=()=>
{
  var submitRecord=true
  if(restaurantName.trim().length==0)
  {
    handleError(true,'restaurantName','pls input Restaurant Name')
    
    submitRecord=false
  }
  if(ownerName.trim().length==0)
  {
    handleError(true,'ownerName','Pls Input Owner Name')
    
    submitRecord=false
  }
  if(!mobileNo || !(/^[0-9]{10}$/).test(mobileNo))
  {
    handleError(true,'mobileNo','Pls Input Correct Mobile Number')
    
    submitRecord=false
  }
  
  if(!emailid || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid) ))
  {
    handleError(true,'emailid','Pls Input Correct Emailid')
    
    submitRecord=false
  }

  if(!address)
  {
    handleError(true,'address','Pls Input Correct Address')
    
    submitRecord=false
  }

  
  if(!stateid)
  {
    handleError(true,'stateid','Pls Select State')
    
    submitRecord=false
  }
  if(!fileFssai.url)
  {
    handleError(true,'fileFssai','Pls Upload Fssai')
    
    submitRecord=false
  }
  return submitRecord
}
  const fetchAllStates = async () => {
    var result = await getData("statecity/fetch_all_states");
    setStates(result.data);
  };

  useEffect(function () {
    fetchAllStates();
  }, []);

  const fillState = () => {
    return states.map((item) => {
      return <MenuItem value={item.stateid}>{item.statename}</MenuItem>;
    });
  };

  const fetchAllCities = async (stateid) => {
    var body = { stateid: stateid };
    var result = await postData("statecity/fetch_all_cities", body);
    setCities(result.data);
  };

  const fillCities = () => {
    return cities.map((item) => {
      return <MenuItem value={item.cityid}>{item.cityname}</MenuItem>;
    });
  };

  const handleStateChange = (event) => {
    setStateId(event.target.value);
    fetchAllCities(event.target.value);
  };

  const handleFssai = (event) => {
    setFileFssai({url: URL.createObjectURL(event.target.files[0]),bytes: event.target.files[0],
    });
    setBtnStatus((prev)=>({...prev,fssai:true}))
  };

  const handleShopAct = (event) => {
    setFileShopAct({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
    setBtnStatus((prev)=>({...prev,shopAct:true}))

  };

  const handleLogo = (event) => {
    setFileLogo({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
    setBtnStatus((prev)=>({...prev,logo:true}))
   
  };

  const handleSubmit = async () => {
    if (validation())
    {
    var d = new Date();
    var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
   var body={"restaurantname":restaurantName,
    "ownername":ownerName,
    "phonenumber":phoneNumber,
    "emailid":emailid,
    "mobileno":mobileNo,
    "address":address,
    "stateid":stateid,
    "cityid":cityid,
    "url":url,
    "fssai":fssai,
    "gstno":gstNo,
    "gsttype":gstType,
    "updatedat":cd,
  restaurantid:restaurantid}
    var result = await postData("restaurants/restaurant_edit_data",body);
    if(result.status)
    {
      Swal.fire({

        icon: 'success',
        title: 'Restaurant Registration',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end',
        
      })
     
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end',
      })
      
    }
  }
  
  };
    //////////////////////////////////////////////



    const handleCancel=(imgStatus)=>{
      if(imgStatus==1)
      {
      setBtnStatus((prev)=>({...prev,fssai:false}))
      setFileFssai({url:tempFile.fssai,bytes:''})
    }
    else if(imgStatus==2)
    {
    setBtnStatus((prev)=>({...prev,shopAct:false}))
    setFileShopAct({url:tempFile.shopAct,bytes:''})
  }
  if(imgStatus==3)
      {
      setBtnStatus((prev)=>({...prev,logo:false}))
      setFileLogo({url:tempFile.logo,bytes:''})
    }
  }
    
    const editImage=async(imgStatus)=>{
      if(imgStatus==1)
      {
      
    var formData=new FormData()
    formData.append('restaurantid',restaurantid)
    formData.append('filefssai',fileFssai.bytes)
    var result=await postData('restaurants/restaurant_edit_fssai',formData)

    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Restaurant Registration',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end',
        
      })
      
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end',
        
      })
      
    }
  setBtnStatus((prev)=>({...prev,fssai:false}))
      }
      else  if(imgStatus==2)
      {
      
    var formData=new FormData()
    formData.append('restaurantid',restaurantid)
    formData.append('fileshopact',fileShopAct.bytes)
    var result=await postData('restaurants/restaurant_edit_shopact',formData)

    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Restaurant Registration',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end',
        
      })
      
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end',
        
      })
      
    }
  setBtnStatus((prev)=>({...prev,shopAct:false}))
      }
      else if(imgStatus==3)
      {
      
    var formData=new FormData()
    formData.append('restaurantid',restaurantid)
    formData.append('logo',fileLogo.bytes)
    var result=await postData('restaurants/restaurant_edit_logo',formData)

    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Restaurant Registration',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end'
        
      })
      
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
        timer: 5000,
        showConfirmButton:false,
        toast:true,
        position:'top-end'
        
      })
      
    }
  setBtnStatus((prev)=>({...prev,logo:false}))
      }
fetchAllRestaurant()
    }

    

    const editDeleteButton=(imgStatus)=>{
      return(<div>
     <Button onClick={()=>editImage(imgStatus)}>Edit</Button>
     <Button onClick={()=>handleCancel(imgStatus)}>Cancel</Button>
      </div> )
    }


    const fetchAllRestaurant=async()=>{
        var result=await getData('restaurants/fetch_all_restaurant')
        setListRestaurant(result.data)
    }

    const handleEdit=(rowData)=>{
      fetchAllCities(rowData.stateid)
      setRestaurantId(rowData.restaurantid)
      setRestaurantName(rowData.restaurantname)
      setOwnerName(rowData.ownername)
      setPhoneNumber(rowData.phonenumber)
      setMobileNo(rowData.mobileno)
      setAddress(rowData.address)
      setEmailId(rowData.emailid)
      setStateId(rowData.stateid)
      setCityId(rowData.cityid)
      setUrl(rowData.url)
      setFssai(rowData.fssai)
      setGstNo(rowData.gstno)
      setGstType(rowData.gsttype)
      setFileFssai({url:`${serverURL}/images/${rowData.filefssai}`,bytes:''})
      setFileLogo({url:`${serverURL}/images/${rowData.filelogo}`,bytes:''})
      setFileShopAct({url:`${serverURL}/images/${rowData.fileshopact}`,bytes:''})
      setTempFile({fssai:`${serverURL}/images/${rowData.filefssai}`,logo:`${serverURL}/images/${rowData.filelogo}`,shopAct:`${serverURL}/images/${rowData.fileshopact}`})
      setOpen(true)
    }
    const handleDialogClose=()=>{
      setOpen(false)
      fetchAllRestaurant()
    }
    const showData=()=>{
      return (
        <div className={classes.root}>
          <div className={classes.box}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Heading title={"Restaurant Registration"} />
              </Grid>
              <Grid item xs={6}>
                <TextField
               onFocus={()=>handleError(false,'restaurantName','')}
                error={resError?.restaurantName?.error}
                helperText={resError?.restaurantName?.message}
                  onChange={(event) => setRestaurantName(event.target.value)}
                  label="Restaurant Name"
                  fullWidth
                  value={restaurantName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                onFocus={()=>handleError(false,'ownerName','')}
                error={resError?.ownerName?.error}
                helperText={resError?.ownerName?.message}
                  onChange={(event) => setOwnerName(event.target.value)}
                  label="Owner Name"
                  fullWidth
                  value={ownerName}
                />
              </Grid>
    
              <Grid item xs={4}>
                <TextField
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  label="Phone Number"
                  fullWidth
                  value={phoneNumber}
                />
              </Grid>
    
              <Grid item xs={4}>
                <TextField
                 onFocus={()=>handleError(false,'mobileNo','')}
                 error={resError?.mobileNo?.error}
                 helperText={resError?.mobileNo?.message}
                  onChange={(event) => setMobileNo(event.target.value)}
                  label="Mobile Number"
                  fullWidth
                  value={mobileNo}
                />
              </Grid>
    
              <Grid item xs={4}>
                <TextField
                onFocus={()=>handleError(false,'emailid','')}
                error={resError?.emailid?.error}
                helperText={resError?.emailid?.message}
                  onChange={(event) => setEmailId(event.target.value)}
                  label="Email Address"
                  fullWidth
                  value={emailid}
                />
              </Grid>
    
              <Grid item xs={12}>
                <TextField
                onFocus={()=>handleError(false,'address','')}
                error={resError?.address?.error}
                helperText={resError?.address?.message}
                  onChange={(event) => setAddress(event.target.value)}
                  label="Address"
                  fullWidth
                  value={address}
                />
              </Grid>
    
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                  onFocus={()=>handleError(false,'stateid','')}
                  error={resError?.stateid?.error}
                  helperText={resError?.stateid?.message}
                    label="State"
                    value={stateid}
                    onChange={handleStateChange}
                  >
                    <MenuItem>-Select State-</MenuItem>
                    {fillState()}
                  </Select>
                  <FormHelperText style={{color:'red'}}>{resError?.stateid?.message}</FormHelperText>
                </FormControl>
                {
                //resError?.stateid?.error?<div>{resError?.stateid?.message}</div>:<></>
                 }
              </Grid>
    
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    label="City"
                    value={cityid}
                    onChange={(event) => setCityId(event.target.value)}
                  >
                    <MenuItem>-Select City-</MenuItem>
                    {fillCities()}
                  </Select>
                </FormControl>
              </Grid>
    
              <Grid item xs={4}>
                <TextField
                  onChange={(event) => setUrl(event.target.value)}
                  label="URL"
                  fullWidth
                  value={url}
                  
                />
              </Grid>
    
              <Grid item xs={4}>
                <TextField
                  onChange={(event) => setFssai(event.target.value)}
                  label="FSSAI Number"
                  fullWidth
                  value={fssai}
                />
              </Grid>
    
              <Grid item xs={4}>
                <TextField
                  onChange={(event) => setGstNo(event.target.value)}
                  label="GST Number"
                  fullWidth
                  value={gstNo}
                />
              </Grid>
    
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>GST Type</InputLabel>
                  <Select
                    label="GST Type"
                    value={gstType}
                    onChange={(event) => setGstType(event.target.value)}
                  >
                    <MenuItem>-Select GST Type-</MenuItem>
                    <MenuItem value="5 Star">5 Star</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
    
              <Grid item xs={4} >
                
                <Button
                  fullWidth
                  component="label"
                  variant="contained"
                  endIcon={<UploadFile />}
                >
                  <input
                  onFocus={()=>handleError(false,'fileFssai','')}
                    onChange={handleFssai}
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                  />
                  Upload FSSAI
                </Button>
                {
                  resError?.fileFssai?.error?<div style={{color:'red',fontSize:11.5,margin:5}}>{resError?.fileFssai?.message}</div>:<></>
                }
              
              </Grid>
    
              <Grid item xs={4}>
                <Button
                  fullWidth
                  component="label"
                  variant="contained"
                  endIcon={<UploadFile />}
                >
                  <input
                    onChange={handleShopAct}
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                  />
                  Upload Shop Act
                </Button>
              </Grid>
    
              <Grid item xs={4}>
                <Button
                  fullWidth
                  component="label"
                  variant="contained"
                  endIcon={<UploadFile />}
                >
                  <input
                    onChange={handleLogo}
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                  />
                  Upload LOGO
                </Button>
              </Grid>
    
              <Grid item xs={4} className={classes.center}>
                <Avatar
                  variant="rounded"
                  alt="Remy Sharp"
                  src={fileFssai.url}
                  sx={{ width: 56, height: 56 }}
                />
                <div>
                  {btnStatus.fssai?editDeleteButton(1):<></>}
                </div>
              </Grid>
    
              <Grid item xs={4} className={classes.center}>
                <Avatar
                  variant="rounded"
                  alt="Remy Sharp"
                  src={fileShopAct.url}
                  sx={{ width: 56, height: 56 }}
                />
                <div>
                  {btnStatus.shopAct?editDeleteButton(2):<></>}
                </div>
              </Grid>
    
              <Grid item xs={4} className={classes.center}>
                <Avatar
                  variant="rounded"
                  alt="Remy Sharp"
                  src={fileLogo.url}
                  sx={{ width: 56, height: 56 }}
                />
                <div>
                  {btnStatus.logo?editDeleteButton(3):<></>}
                </div>
              </Grid>
          

            </Grid>
          </div>
        </div>
      );
    }

    const showDataForEdit=()=>{
      return(
        <Dialog
        maxWidth={'lg'}
        open={open}>
          <DialogContent >
            {showData()}
          </DialogContent>
              <DialogActions>
              <Button onClick={handleSubmit} variant="contained">Edit</Button>
                <Button onClick={handleDialogClose} variant="contained">Close</Button>

          </DialogActions>

        </Dialog>
      )
    }





    useEffect(function(){
        fetchAllRestaurant()
    },[])

    const handleDelete=async(rowData)=>{
      
        Swal.fire({
          title: 'Do you want to Delete the Record?',
          showDenyButton: true,
          confirmButtonText: 'Delete',
          denyButtonText: `Don't Delete`,
        }).then(async(result) => {
          /* Read more about isConfirmed, isDenied below */

          if (result.isConfirmed) {
            var body={'restaurantid':rowData.restaurantid}
      var result=await postData('restaurants/restaurant_delete',body)
      if(result.status)
      {
        Swal.fire('Deleted!', '',result.message)
        fetchAllRestaurant()
      }
      else 
      
         Swal.fire('Deleted', '',result.message)
          }
       else if (restaurantName.isDenied){
        Swal.fire('Restaurant not Deleted', '', 'info')
       }
        })
      

    }
    function DisplayAll(){
        return (
          <MaterialTable
            title="Restaurant List"
            columns={[
              { title: 'Restaurant', 
              render:rowData=><><div>{rowData.restaurantname}</div><div>{rowData.ownername}</div></>},
              { title: 'Ownername', 
              render:rowData=><><div>{rowData.address}</div><div>{rowData.cityname}</div><div>{rowData.statename}</div></>},
              { title: 'Contact',
              render:rowData=><><div>{rowData.phonenumber}</div><div>{rowData.mobileno}</div><div>{rowData.emailid}</div></>},
              { title: 'Documents',
              render:rowData=><><div>GST:{rowData.gstno}/TYPE:{rowData.gsttype}</div><div>FSSAI:{rowData.fssai}</div></>},
              { title: 'Website',
              render:rowData=><div><a href='{rowData.url}'></a></div>},
              { title: 'Logo',
              render:rowData=><div><img src={`${serverURL}/images/${rowData.filelogo}`} style={{width:50,height:50,borderRadius:10}}/></div>},

            ]}
            data={listRestaurant}      
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Restaurant',
                onClick: (event, rowData) =>handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Restaurant',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Restaurant',
                isFreeAction:true,
                onClick: (event, rowData) => alert("You want to delete " + rowData.name)
              }
            ]}
          />
        )
      }

    return(
        <div className={classes.root}>
        <div className={classes.box}>
            {DisplayAll()}
    </div>
    {showDataForEdit()}
    </div>)
}