
import { Button, ButtonBase, Chip, Divider, IconButton, Modal, Rating, colors } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deselectMovie, removeFromList } from '../Redux/MovieSlice';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Collapse, Input } from '@nextui-org/react';
import "./MovieDetailsCard.css"
import { useNavigate } from 'react-router';
import CategoryModal from './CategoryModal';


const MovieDetailsCard = ({img,title,ratings,actors,director,genre,plot,rated,runtime,released,id,data,refresh}) => {
  actors=actors.split(",");
  genre=genre.split(",");
  const [vis,setVis]=useState(false)
  const navigate=useNavigate()
  const dispatch=useDispatch();
  const userID=useSelector(state=>state.userReducer.userID)
  const [val,setVal]=useState("")
  const [categories,setCategories]=useState([])
  const [saved,setSaved]=useState(false)
  const [selectedCategory,setSelectedCategory]=useState("");

  useEffect(()=>{
    console.log("getting")
    if(userID){
        get()
    }
  },[])

async function get(){
    await firebase.firestore().collection("watchlist").doc(userID).collection("posts").where("imdbID",'==',id).get().then((snap)=>{
        snap.forEach(s=>{
            console.log(s.data())
            if(s.data()){
                setSaved(true);
            }
        })
    })
  }
  async function deleteMovie(id){
    console.log('del')
    const unsub=firebase.firestore().collection("watchlist").doc(userID).collection("posts").where("imdbID",'==',id).onSnapshot((snap)=>{
        snap.docs.forEach(snap=>{
            snap.ref.delete()
            console.log("got em")
            unsub()
        })
        // snap.forEach(snap=>{
        //     snap.ref.delete();
        // })
    })
    dispatch(removeFromList(id));
    // refresh((val)=>!val);
  }
  return (
    <>
    <div style={{
        display:'flex',
        flexDirection:'row',
        padding:"20px 0px",
        flexWrap:'wrap',
        justifyContent:'center'
    }}>
        <CategoryModal vis={vis} setSaved={setSaved} setVis={setVis} id={id} data={data} />
        <img style={{height:"23rem",width:"350px"}} src={img}/>
        <div style={{display:'flex',flexDirection:"column",rowGap:6,marginLeft:10}}>
            <div style={{display:'flex',flexDirection:"row",alignItems:'center',gap:10,flexWrap:'wrap'}}>
                <span style={{fontSize:26,fontFamily:'Oswald',fontWeight:'bold'}}>{title}</span>
                <Rating
                readOnly
                value={ratings/2}
                />
                <div style={{display:"flex",flexGrow:1,justifyContent:'flex-end',gap:5}}>
                    <IconButton onClick={()=>{
                        if(!userID){
                            navigate('/auth')
                            dispatch(deselectMovie())
                            return
                        }

                        if(saved){
                            deleteMovie(id)
                            dispatch(deselectMovie())
                        }else{
                            setVis(true);
                        }
                    }}>
                        {saved?<BookmarkIcon style={{color:colors.red[900]}}/>:<BookmarkBorderIcon style={{color:colors.red[900]}} />}
                    </IconButton>
                    <IconButton onClick={()=>dispatch(deselectMovie())} >
                        <CloseIcon />
                    </IconButton>
                    </div>
            </div>
            <div><span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>Released : {released}</span></div>
            <div><span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>Runtime : {runtime}</span></div>
            <div><span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>Rated : {rated}</span></div>
            <div style={{display:'flex',alignItems:'center',gap:3,flexWrap:'wrap'}}>
                <span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>Genre : </span>
                {genre.map(genre=><Chip label={genre} size="small" style={{fontSize:14,fontFamily:'Roboto',marginTop:1,backgroundColor:colors.red[800],color:'white'}}/>)}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:3,flexWrap:'wrap'}}>
                <span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>Director : {director} </span> 
            </div>
            <div style={{display:'flex',alignItems:'center',gap:3,flexWrap:'wrap'}}><span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>Actors : </span>
            {actors.map(actor=><Chip variant="outlined" label={actor} size="small" style={{fontSize:14,fontFamily:'Roboto',marginTop:1,color:colors.red}} />)}
            </div>
            <div>
                <Collapse title="More info" style={{fontSize:16,fontFamily:'Oswald'}}>
                  <div style={{display:'flex',flexDirection:'column',fontSize:18}}>
                    {data.Ratings.map(rating=>{
                        return(
                            <div>
                            <span>{rating.Source} : </span>
                            <span> {rating.Value}</span>
                            </div>
                        )
                    })}
                    <div>
                        Awards :
                        <span> {data.Awards?data.Awards:"None"}</span>
                    </div>
                  </div>
                </Collapse>
            </div>
            <div><span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>Plot : </span>
            <span style={{fontSize:18,fontFamily:'Oswald',fontWeight:'bold'}}>
                {plot}
            </span>
            </div>
        </div>
        {/* <div onClick={()=>{}}><CloseIcon style={{}}/></div> */}
    </div>
    <Divider style={{borderWidth:1}}/>
    </>
  )
}

export default MovieDetailsCard

