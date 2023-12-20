import { Rating, duration } from "@mui/material"
import "../Components/MovieCard.css"
import React from 'react'
import { useDispatch } from "react-redux"
import { getDetailsThunk } from "../Redux/MovieSlice"

const MovieCard = ({title,img,genre,year,ratings,duration,type,id}) => {
  const dispatch=useDispatch();
  return (
    <div className="card" onClick={()=>{
        dispatch(getDetailsThunk({id}))
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }}>
        <img src={img} className="poster"/>
        <div style={{display:"flex",flexGrow:1,flexDirection:'column',justifyContent:'space-between'}}>
            <div style={{display:"flex",flexDirection:'row',justifyContent:"space-between",marginTop:5}}>
                <span className="title">{title}</span>
                {/* <Rating
                readOnly
                value={(ratings/2)}
                /> */}
            </div>
            {/* <div style={{display:"flex",flexDirection:'row',justifyContent:"space-between",marginTop:5}}>
                <span className="title">Genre : {ratings}</span>
                <span className="title">Duration : {duration}</span>
            </div> */}
            <div style={{display:"flex",flexDirection:'row',justifyContent:"space-between",marginTop:0}}>
                <span className="details">Year : {year}</span>
                <span className="details">{type}</span>
            </div>
        </div>
    </div>
  )
}

export default MovieCard
