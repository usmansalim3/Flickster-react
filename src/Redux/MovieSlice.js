import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState={
    movies:[],
    loading:false,
    error:false,
    selectedMovie:{},
    movieSelected:false,
    detailsLoading:false,
    filteredList:{}
}
export const getMoviesThunk=createAsyncThunk("/getMovies",async({query},{rejectWithValue})=>{
    console.log(query)
    try{
        const response=await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=9a72564e`);
        if(response.data.Error){
            console.log("error");
            return rejectWithValue(response.data.Error)
        }
        console.log(response.data)
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data)
    }
})
export const getDetailsThunk=createAsyncThunk("/getDetails",async({id},{rejectWithValue})=>{
    try{
        const response=await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=9a72564e`);
        console.log(response.data)
        if(response.data.Error){
            console.log("error");
            return rejectWithValue(response.data)
        }
        return response.data;
    }catch(error){
        return rejectWithValue(error)
    }
})
const MovieSlice=createSlice({
    name:"MovieSlice",
    initialState,
    reducers:{
        deselectMovie:(state)=>{
            state.movieSelected=false;
        },
        removeFromList:(state,{payload})=>{
            Object.keys(state.filteredList).map((cat)=>{
                state.filteredList[cat]=state.filteredList[cat].filter((movie)=>movie.imdbID!=payload);
            })
        },
        setFilteredList:(state,{payload})=>{
            state.filteredList=payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getMoviesThunk.pending,(state)=>{
            console.log("loading")
            state.loading=true;
            state.error=false;
        })
        .addCase(getMoviesThunk.fulfilled,(state,{payload})=>{
            console.log(payload)
            state.loading=false;
            state.error=false;
            state.movies=payload.Search 
        })
        .addCase(getMoviesThunk.rejected,(state,{payload})=>{
            state.loading=false;
            state.movies=[];
            state.error=true
        })
        .addCase(getDetailsThunk.fulfilled,(state,{payload})=>{
            console.log(payload);
            state.selectedMovie=payload;
            state.movieSelected=true;
            state.detailsLoading=false;
        })
        .addCase(getDetailsThunk.pending,(state)=>{
            state.detailsLoading=true;
        })
    }
})
export default MovieSlice.reducer
export const {deselectMovie,setFilteredList,removeFromList}=MovieSlice.actions