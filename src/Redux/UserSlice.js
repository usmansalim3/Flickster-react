import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { auth } from '../FirebaseConfig';
import axios from 'axios';

function mapAuthCodeToMessage(authCode) {
    switch (authCode) {
      case "auth/invalid-password":
        return "Password provided is not corrected";
  
      case "auth/invalid-email":
        return "Email provided is invalid";
      case "auth/email-already-exists":
        return "Email already registered";
     case "auth/invalid-email":
        return "Invalid email"
     case "auth/email-already-in-use":
        return "Email already registered"
     case "auth/user-not-found":
        return "Email not registered"
      case "auth/wrong-password":
        return "Wrong password"
      default:
        return "Some error occured ";
    }
  }

const initialState = {
    userID:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.uid:null,
    userName:null,
    loadingLogin:false,
    loadingRegister:false,
    error:null
}

export const registerThunk=createAsyncThunk("/registerThunk",async ({email,password},{rejectWithValue})=>{
    try{
        const user=await auth.createUserWithEmailAndPassword(email,password);
        return user;
        //http://localhost:4000/flickster/register
        // console.log("here")
        // const response=await axios.post('http://192.168.0.195:4000/flickster/register',{
        //   email,
        //   password
        // });
        // return response.data.user
    }catch(error){
        console.log(error.response.data.user)
        return rejectWithValue(error.response.data.user);
    }
})

export const loginThunk=createAsyncThunk("/loginThunk",async ({email,password},{rejectWithValue})=>{
    console.log("sending")
    try{
        const user= await auth.signInWithEmailAndPassword(email,password);
        return user;
    }catch(error){
        console.log(error.response.data.user)
        return rejectWithValue(error.response.data.user);
    }
})

const UserSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    signOut:(state)=>{
        state.error=null;
        state.userID=null;
        state.userName=null
        state.loadingLogin=false;
        state.loadingRegister=false;
        localStorage.clear();
    },
    setUser:(state,{payload})=>{
        localStorage.setItem("user",JSON.stringify(payload));
        state.loadingLogin=false;
        state.error=null;
        state.userID=payload.user.uid;
        state.userName=payload.user.email
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(registerThunk.pending,(state)=>{
        state.loadingRegister=true;
    }).addCase(registerThunk.fulfilled,(state,{payload})=>{
        console.log("Logged In");
        state.error=null;
        state.userID=payload.user.uid;
        state.userName=payload.user.email
        state.loadingRegister=false;
    }).addCase(loginThunk.pending,(state)=>{
        state.loadingLogin=true;
        state.error=null;
    }).addCase(loginThunk.fulfilled,(state,{payload})=>{
        console.log("loggedin");
        console.log(payload)
        state.loadingLogin=false;
        state.error=null;
        state.userID=payload.user.uid;
        state.userName=payload.user.email
        localStorage.setItem("user",JSON.stringify(payload));
    }).addCase(registerThunk.rejected,(state,{payload})=>{
        state.loadingRegister=false;
        state.error=mapAuthCodeToMessage(payload.code)

    }).addCase(loginThunk.rejected,(state,{payload})=>{
        console.log(payload)
        state.error=mapAuthCodeToMessage(payload.code);
        state.loadingLogin=false;
    })
  }
});

export const {signOut,setUser} = UserSlice.actions

export default UserSlice.reducer