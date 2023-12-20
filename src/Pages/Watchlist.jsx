import React, { useEffect, useState } from 'react'
import NavBar from '../Components/NavBar'
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import axios from 'axios';
import { setLocale } from 'yup';
import MovieCard from '../Components/MovieCard';
import MovieDetailsCard from '../Components/MovieDetailsCard';
import MovieDetailsScreen from '../Components/MovieDetailsScreen';
import LoadingAnimation from "../LoadingAnimation.json"
import Lottie from "lottie-react"
import { colors } from '@mui/material';
import { setFilteredList } from '../Redux/MovieSlice';
import { useLocation, useNavigate } from 'react-router';


function Watchlist() {
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const userID=useSelector(state=>state.userReducer.userID)
  const filteredList=useSelector(state=>state.getMoviesReducer.filteredList)
  const [movies,setMovies]=useState([]);
  // const [filteredList,setFilteredList]=useState({})
  const [categories,setCategories]=useState([]);
  const [loading,setLoading]=useState(false);
  const [refresh,setRefresh]=useState(false);
  async function fetchMovie(id){
    const {data}=await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=9a72564e`);
    return data
  }
  async function getCategories(){
    const res=(await firebase.firestore().collection("watchlist").doc(userID).get()).data()?.categories;
    if(res==undefined){
        setCategories([]);
    }else{
        setCategories(res);
    }
  }
  async function getMovies(){
    setLoading(true);
    let fl={};
    let movies=[]
    let categories=[]
    await firebase.firestore().collection("watchlist").doc(userID).collection("posts").get().then((data)=>{
      data.forEach(snap=>movies.push(snap.data()));
      // setMovies(movies);
    })
    //console.log(movies)
    const res=(await firebase.firestore().collection("watchlist").doc(userID).get()).data()?.categories;
    if(res==undefined){
        categories=[];
    }else{
        categories=res;
    }
    if(categories.length){
      categories.forEach((cat)=>{
        let arr=[]
        movies.map(movie=>{
          if(movie.category==cat){
            arr.push(movie);
          }
        })
        fl[cat]=arr;
      })
    }
    dispatch(setFilteredList(fl));
    setLoading(false);
    setCategories(categories);
  }
  console.log(filteredList)
  useEffect(()=>{
    document.title="watchlist"
    if(!userID){
      navigate('/auth')
      return
    }
    getMovies();
  },[])
  function list(){
    const a=Object.keys(filteredList).map((category)=>{
      return(
        <div>
          <div>
          <span style={{fontSize:40,fontFamily:"Oswald",marginLeft:10,color:colors.red[900]}}>
            {category}
          </span>
          </div>
          <div style={{display:'flex',flexDirection:'row',gap:5,flexWrap:"wrap"}}>
            {filteredList[category].length?filteredList[category].map(({data})=>{
              return(
                <div>
                  <MovieCard year={data.Year} title={data.Title} img={data.Poster} type={data.Type} id={data.imdbID} />
                </div>
              )
            }):
            <div style={{marginLeft:12,fontFamily:'Oswald'}}>
              No movies
            </div>}
          </div>
        </div>
      )
    })
    return a
  }
  return (
    <>
    {/* <NavBar/> */}
    {/* <MovieDetailsScreen/> */}

    {loading ? 
    <div style={{alignItems:'center',justifyContent:'center',display:"flex",flexDirection:'column'}}>
      <Lottie animationData={LoadingAnimation} autoplay loop/>
    </div> : 
    <div style={{margin:10}}>
    {list()}
    </div>
    }
    
    </>
  )
}

export default Watchlist