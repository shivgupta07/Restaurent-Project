import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    width:"auto",
    height:"90vh",
    background:"#dfe4ea",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    flexDirection:'column',
    padding:10
  },
  box:{
    width:"90%",
    height:"auto",
    borderRadius:10,
    background:"#fff",
    padding:15,
    marginBottom:'10px',
    boxShadow:"0 0 15px #222"
  },
  tablebox:{
    width:"80%",
    height:"auto",
    borderRadius:10,
    background:"#fff",
    padding:15,
    boxShadow:"0 0 15px #222"
  },
  center:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  }
});