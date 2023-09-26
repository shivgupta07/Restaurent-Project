import { useState, useEffect } from "react";
import { Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import UploadFile from "@mui/icons-material/UploadFile";
import Swal from 'sweetalert2'
import { serverURL, getData, postData } from "../../services/FetchNodeServices";
import Heading from "../../components/heading/Heading";
//a
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  root: {
    width: "auto",
    height: "auto",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "auto",
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
export default function RestaurantInterface() {
  var classes = useStyles();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateid, setStateId] = useState("");
  const [cityid, setCityId] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailid, setEmailId] = useState("");
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState("");
  const [fssai, setFssai] = useState("");
  const [gstno, setGstNo] = useState("");
  const [gstType, setGstType] = useState("");
  const [fileFssai, setFileFssai] = useState({ url: "", bytes: "" });
  const [fileShopAct, setFileShopAct] = useState({ url: "", bytes: "" });
  const [fileLogo, setFileLogo] = useState({ url: "", bytes: "" });
  const[resError,setResError]=useState({})
  const[password,setPassword]=useState("")

  const handleReset=()=>{
    setRestaurantName('')
    setOwnerName('')
    setStateId('-Select State-')
    setCityId('-Select City-')
    setAddress('')
    setFileLogo({ url: "", bytes: "" })
 
   }
  
  const generatePassword=()=>{
    var pwd=parseInt(Math.random()*8999)+1000
    return pwd
  }
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
    setFileFssai({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleShopAct = (event) => {
    setFileShopAct({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleLogo = (event) => {
    setFileLogo({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleSubmit = async () => {
    if (validation())
    {
    var formData = new FormData();
    formData.append("restaurantname", restaurantName);
    formData.append("ownername", ownerName);
    formData.append("phonenumber", phoneNumber);
    formData.append("emailid", emailid);
    formData.append("mobileno", mobileNo);
    formData.append("address", address);
    formData.append("stateid", stateid);
    formData.append("cityid", cityid);
    formData.append("url", url);
    formData.append("fssai", fssai);
    formData.append("gstno", gstno);
    formData.append("gsttype", gstType);
    formData.append("filelogo", fileLogo.bytes);
    formData.append("fileshopact", fileShopAct.bytes);
    formData.append("filefssai", fileFssai.bytes);
    formData.append('password',generatePassword())
    var d = new Date();
    var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    formData.append("createdat", cd);
    formData.append("updatedat", cd);
    var result = await postData("restaurants/restaurant_submit", formData);
    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Restaurant Registration',
        text: result.message
        
      })
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message
        
      })
    }
  }
  };
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
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              onChange={(event) => setPhoneNumber(event.target.value)}
              label="Phone Number"
              fullWidth
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
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              onChange={(event) => setFssai(event.target.value)}
              label="FSSAI Number"
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              onChange={(event) => setGstNo(event.target.value)}
              label="GST Number"
              fullWidth
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

          <Grid item xs={4}>
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
          </Grid>

          <Grid item xs={4} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileShopAct.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>

          <Grid item xs={4} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileLogo.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button onClick={handleSubmit} fullWidth variant="contained">
              Submit
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button onClick={handleReset} fullWidth variant="contained">
              Reset
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
