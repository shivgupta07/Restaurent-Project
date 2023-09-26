import logo from '../../assets/logo.png'
import list from '../../assets/list.png'
import { useNavigate } from 'react-router-dom'
export default function Heading({title,myroute})
{ var navigate=useNavigate()
    return(
        <div style={{fontfamily:'Kanit',
        fontWeight:'bold',
        fontSize:'20',
        letterSpacing:1,
        display:"flex",
        alignItems:"center",
        flexDirection:"row"
         }}>
        <img src={logo} width="60"/>
           <div>{title}</div>
           <img src={list} width="25" style={{marginLeft:'auto'}} onClick={()=>navigate(`${myroute}`)}/>
            </div>
    )
}