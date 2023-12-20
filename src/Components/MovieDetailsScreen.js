
import React from 'react'
import { useSelector } from 'react-redux';
import MovieDetailsCard from './MovieDetailsCard';
import Lottie from "lottie-react"
import LoadingAnimation from "../LoadingAnimation.json"

const MovieDetailsScreen = () => {
  const state=useSelector(state=>state.getMoviesReducer)
  const movie=state.selectedMovie
  return (
    <>
    {state.detailsLoading && <div style={{alignItems:'center',justifyContent:'center',display:"flex",flexDirection:'column'}}>
        <Lottie animationData={LoadingAnimation} autoplay loop/>
        </div>
        }
    {
        !state.detailsLoading&&state.movieSelected && <MovieDetailsCard title={movie.Title} img={movie.Poster} ratings={movie.imdbRating} rated={movie.Rated} runtime={movie.Runtime} actors={movie.Actors} director={movie.Director} plot={movie.Plot} type={movie.Type} released={movie.Released} genre={movie.Genre} id={movie.imdbID} data={movie}/>
    }
     </>
  )
}

export default MovieDetailsScreen
