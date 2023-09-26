import { useState, useEffect } from "react";
import { Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material";
import UploadFile from "@mui/icons-material/UploadFile";
import Swal from 'sweetalert2'
import { serverURL, getData, postData } from "../../services/FetchNodeServices";
import Heading from "../../components/heading/Heading";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    root: {
      width: "auto",
      height: "90vh",
      background: "#dfe4ea",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    box: {
      width: "80%",
      height: "auto",
      borderRadius: "10",
      background: "#fff",
      padding: 15,
      boxShadow:"0 0 15px #222"
    },
    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });
  export default function CategoryInterface() {
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    var classes = useStyles();
    const [restaurantid, setRestaurantId] = useState(admin.restaurantid);
    const [categoryName, setCategoryName] = useState("");
    const [fileIcon, setFileIcon] = useState({ url: "", bytes: "" });
    const[ctgryError,setCtgryError]=useState("")
    
    useEffect(function(){
      setRestaurantId(admin.restaurantid)
    },[])

    const handleError = (error,input,message)=>{
      setCtgryError(prevState=>({...prevState,[input]:{'error':error,'message':message}}));
    };
    const validation=()=>
  {
  var submitRecord=true
  if(restaurantid.length==0)
  {
    handleError(true,'restaurantid','pls input Restaurant Id')
    
    submitRecord=false
  }
  if(categoryName.trim().length==0)
  {
    handleError(true,'categoryName','Pls Enter Category Name')
    
    submitRecord=false
  }
  if(!fileIcon.url)
  {
    handleError(true,'fileIcon','Pls Upload Icon')
    
    submitRecord=false
  }
  return submitRecord
  }
    const handleIcon = (event) => {
      setFileIcon({
        url: URL.createObjectURL(event.target.files[0]),
        bytes: event.target.files[0],
      });
    };

    const handleSubmit = async () => {
      if(validation())
      {
      var formData = new FormData();
      formData.append('restaurantid',restaurantid)
      formData.append('categoryname',categoryName)
      formData.append('fileicon',fileIcon.bytes)
      var result= await postData("category/category_sub", formData);
      if(result.status)
      {
        Swal.fire({
          icon: 'success',
          title: 'Category Registration',
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
      }
    return (
        <div className={classes.root}>
      <div className={classes.box}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
            <Heading title={"Category Register"} myroute={'/admindashboard/displayallcategory'} />
          </Grid>
          <Grid item xs={12}>
            <TextField
            
             value={restaurantid}
             disabled
              label="Restaurant ID"
              fullWidth
              
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
             onFocus={()=>handleError(false,'categoryname','')}
             error={ctgryError?.categoryName?.error}
             helperText={ctgryError?.categoryName?.message}
            onChange={(event) => setCategoryName(event.target.value)}
              label="Category Name"
              fullWidth
              
            />
          </Grid>

          <Grid item xs={4}>
            <Button
              fullWidth
              component="label"
              variant="contained"
              endIcon={<UploadFile />}
            >
              <input
               onChange={handleIcon}
                hidden
                accept="image/*"
                type="file"
              />
              Upload Icon
            </Button>
            {
              ctgryError?.fileIcon?.error?<div style={{color:'red',fontSize:11.5,margin:5}}>{ctgryError?.fileIcon?.message}</div>:<></>
            }
          </Grid>

          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>

          <Grid item xs={4} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileIcon.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>

          <Grid item xs={6}>
            <Button fullWidth onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button fullWidth variant="contained">
              Reset
            </Button>
          </Grid>

          
      </Grid>

      </div>
    </div>
  );
}