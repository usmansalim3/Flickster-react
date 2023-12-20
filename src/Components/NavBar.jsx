
import { ReactSVG } from 'react-svg'
import Button from '@mui/material/Button';
import { Avatar, ButtonBase, Drawer, Icon, IconButton, colors } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import "../Components/NavBar.css"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deselectMovie, getMoviesThunk } from '../Redux/MovieSlice';
import CloseIcon from '@mui/icons-material/Close';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router';
import { signOut } from '../Redux/UserSlice';


const NavBar = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const userID=useSelector(state=>state.userReducer.userID);
    const [query,setQuery]=useState("");
    const [vis,setVis]=useState(false);
    const [timeoutID,setTimeoutID]=useState();
    const location=useLocation();
    function onSearch(query){
      setQuery(query);
      clearTimeout(timeoutID)
      const id=setTimeout(()=>{
        if(query.length>0)
        dispatch(deselectMovie())
        dispatch(getMoviesThunk({query}))
      },3000);
      setTimeoutID(id);
    }
    return (
        <div style={{
          backgroundColor:"#b00020",
          alignItems:'center',
          flexDirection:'row',
          display:'flex',
          boxShadow: '1px 2px 9px #F4AAB9',
          justifyContent:"space-evenly",
          padding:10
          // paddingTop:10,
          // paddingBottom:10,
          // paddingLeft:50,
          // paddingRight:50,
        }}>
          <div style={{display:"flex",alignItems:'center'}} onClick={()=>navigate('/')}>
            <ReactSVG src='/FlickLogo.svg' className='svgLogo'/>
            <span style={{marginLeft:'1vw',fontSize:30,fontFamily:"Oswald",color:"wheat"}}>Flickster</span>
          </div>
          <div className='textBoxContainer'>
            <SearchIcon style={{height:30,width:30}}/>
            <input placeholder='Search movie/series' className='inputBox' 
            
            value={query}
            onChange={(e)=>onSearch(e.target.value)}
            onFocus={()=>{
              if(location.pathname!='/'){
                navigate('/');
              }
            }}
            />
          </div>
          <div className='buttonsContainer' style={location.pathname=="/auth"?{display:'none'}:{}}>
            <Button variant="contained" onClick={()=>{
              dispatch(deselectMovie())
              if(userID){
                navigate("/watchlist")
              }else{
                navigate("/auth")
              }
            }} style={{
              backgroundColor:colors.red[700],fontFamily:"Oswald",letterSpacing:1
            }}>{userID?"Watchlist":"Login"}</Button>
            {userID && <Button onClick={()=>{
              navigate('/');
              dispatch(deselectMovie())
              dispatch(signOut())
            }} style={{color:'white',fontFamily:"Oswald",letterSpacing:1}}>Log out</Button>}
              {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" sx={{height:45,width:45}} /> */}
          </div>
          <div className="menuButton" >
            <span onClick={()=>setVis(true)} style={{marginTop:6}}>
              <MenuIcon style={{color:'wheat'}}/>
            </span>
            <Drawer open={vis} anchor='right' onBlur={()=>setVis(false)}>
              <div className='sideBar' style={{backgroundColor:colors.red[900]}}>
                <ButtonBase onClick={()=>{
                  dispatch(deselectMovie());
                  if(userID){
                    dispatch(signOut());
                    navigate("/auth");
                  }else{
                    navigate('/auth',{state:{mode:"login"}})
                  }
                }} style={{display:"flex",flexDirection:'row',gap:10,padding:10,justifyContent:'flex-start'}}>
                  <span onClick={()=>{
                    if(userID){
                      dispatch(signOut());
                      dispatch(deselectMovie());
                      navigate("/auth");
                    }else{
                      dispatch(deselectMovie());
                      navigate('/auth',{state:{mode:"login"}})
                    }
                  }}>
                    <AccountBoxIcon style={{fontSize:25,color:'wheat'}}/>
                  </span>
                  <span style={{fontFamily:'Oswald',fontSize:20,color:'wheat'}}>
                    {userID?"Log out":"Log in/Sign up"}
                  </span>
                </ButtonBase>
                <Divider/>
                <ButtonBase onClick={()=>{
                  navigate('/watchlist')
                  dispatch(deselectMovie())
                  // console.log("bruhh")
                }} style={{display:"flex",flexDirection:'row',gap:10,padding:10,justifyContent:'flex-start',alignItems:'center'}}>
                  <span onClick={()=>{
                    navigate('/watchlist')
                    dispatch(deselectMovie())
                  }}>
                    <AssignmentIcon style={{fontSize:25,color:'wheat'}}/>
                  </span>
                  <span style={{fontFamily:'Oswald',fontSize:20,color:'wheat'}}>
                    Watchlist
                  </span>
                </ButtonBase>
                <Divider/>
              </div>
            </Drawer>
          </div>
        </div>
      );
}

export default NavBar
