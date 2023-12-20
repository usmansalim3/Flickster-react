import React, { useEffect } from 'react'
import NavBar from '../Components/NavBar'
import MovieDetailsScreen from '../Components/MovieDetailsScreen'
import SearchScreen from '../Components/SearchScreen'

export default function LandingPage() {
  useEffect(()=>{
    document.title="Flickster"
  },[])
  return (
    <div>
    {/* <NavBar/> */}
    {/* <MovieDetailsScreen/> */}
    <SearchScreen/>
    </div>
  )
}
