
import React from 'react'
import { useSelector } from 'react-redux'
import MovieCard from './MovieCard';
import Lottie from "lottie-react"
import LoadingAnimation from "../LoadingAnimation.json"
import notFound from "../notFound.json"
import { colors } from '@mui/material';
import searchMovie from "../searchMovie.json"

const SearchScreen = () => {
  const state=useSelector((state)=>state.getMoviesReducer);
  return (
    <div style={{
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        padding:' 20px 30px',
        justifyContent:"space-around",
        rowGap:'20px'
      }}>
    {
      state.error && <div style={{alignItems:'center',justifyContent:'center',display:"flex",flexDirection:'column'}}>
      <Lottie animationData={notFound} autoplay loop/>
      <div style={{fontSize:32,fontFamily:"Oswald",color:colors.red[900]}}>No Such movie/series found</div>
    </div> 
    }
    {!state.error && !state.loading && state.movies.length==0 && 
    <div style={{fontFamily:'Oswald',fontSize:28,marginTop:'15vh',color:colors.red[900],display:'flex',flexDirection:'column',justifyContent:'center',alignItems:"center"}}>
      <Lottie animationData={searchMovie} autoplay loop/>
      <span>
      SEARCH FOR ANY MOVIE/SERIES
      </span>
    </div>
    }
    {   state.loading 
        ? <div style={{alignItems:'center',justifyContent:'center',display:"flex",flexDirection:'column'}}>
            <Lottie animationData={LoadingAnimation} autoplay loop/>
          </div> 
        : state.movies.map(({Year,Type,Title,Poster,imdbID})=><MovieCard year={Year} title={Title} img={Poster} type={Type} id={imdbID}/>)
    }
    </div>
  )
}

export default SearchScreen
