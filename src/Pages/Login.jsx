import React, { useEffect, useLayoutEffect } from 'react'
import "../Pages/Login.css"
import {  Input, Loading } from '@nextui-org/react';
import { Button, Divider, colors } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HttpsIcon from '@mui/icons-material/Https';
import GoogleIcon from '@mui/icons-material/Google';
import PersonIcon from '@mui/icons-material/Person';
import { useFormik } from 'formik';
import * as yup from 'yup'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, registerThunk, setUser } from '../Redux/UserSlice';
import CheckIcon from '@mui/icons-material/Check';
import { auth, googleAuthProvider } from '../FirebaseConfig';


export default function Login() {
    const navigate=useNavigate();
    const {state:params}=useLocation();
    const dispatch=useDispatch();
    const state=useSelector(state=>state.userReducer)
    const formik=useFormik({
        initialValues:{
            email:'',
            password:'',
            calledBy:''
        },
        validationSchema:yup.object().shape({
            email:yup.string().min(3,"Too short!").max(30,"Name length limited reached!").required("Email is required!").email("Enter a valid email"),
            password:yup.string().min(3,"Too short!").max(20,"Name length limited reached!").required("Password is required!"),
        }),
        onSubmit:(values)=>{
            console.log(values)
            if(values.calledBy=="login"){
                dispatch(loginThunk({email:values.email,password:values.password}));
            }else{
                dispatch(registerThunk({email:values.email,password:values.password}));
            }
        }
      })
      useLayoutEffect(()=>{
        document.title="Login | Register"
      },[])
      useEffect(()=>{
       
        console.log(state);
        if(localStorage.getItem("user")){
            console.log(JSON.parse(localStorage.getItem("user")));
            dispatch(setUser(JSON.parse(localStorage.getItem("user"))))
        }
        if(state.userID){
            navigate("/");
        }
      },[dispatch,state])

      async function signInWithGoogle(){
        const result = await auth.signInWithPopup(googleAuthProvider)
        dispatch(setUser(result));
      }

  return (
    <div className='container'>
        
        <div className='loginBox' style={{backgroundColor:colors.red[900]}}>
            <span style={{fontSize:30,fontFamily:'Oswald',marginBottom:15,marginLeft:3,color:'wheat',alignSelf:'center'}}>Log in</span>
            <div style={{display:"flex",flexDirection:'column',gap:10,width:'90%',alignSelf:'center'}}>
                <Input placeholder="Email" onBlur={formik.handleBlur('email')} contentRight={
                    formik.errors.email&&formik.touched.email?<ErrorOutlineIcon style={{color:colors.red[900]}}/>:formik.touched.email&&!formik.errors.email?<CheckIcon style={{color:colors.green[900]}}/>:<></>
                } size="lg" style={{fontFamily:'Oswald',fontSize:20,width:'100%'}} value={formik.values.email}  onChange={formik.handleChange('email')} contentLeft={
                    <AccountBoxIcon style={{color:'grey',fontSize:26}}/>
                } />
                <Input.Password placeholder="Password" onBlur={formik.handleBlur('password')} value={formik.values.password} contentRight={
                    formik.errors.password&&formik.touched.password?<ErrorOutlineIcon style={{color:colors.red[900]}}/>:formik.touched.password&&!formik.errors.password?<CheckIcon style={{color:colors.green[900]}}/>:<></>} onChange={formik.handleChange('password')} style={{fontFamily:'Oswald',fontSize:20}} size="lg" contentLeft={
                    <HttpsIcon style={{color:'grey',fontSize:26}}/>
                }  />
                <div style={{alignSelf:'center',display:"flex",flexDirection:"column",justifyContent:'center',alignItems:'center'}}>
                    <span style={{color:'wheat'}}>
                    {formik.touched.email&&formik.errors.email}
                    </span>
                    <span style={{color:'wheat'}}>
                    {formik.touched.password&&formik.errors.password}
                    </span>
                    <span style={{color:'wheat'}}>
                    {state.error}
                    </span>
                </div>
            </div>
            <div style={{marginTop:20,marginLeft:5,display:"flex",justifyContent:"center",flexDirection:'column',alignItems:'center',gap:10}}>
                <Button variant='outlined' onClick={()=>{
                    formik.setFieldValue('calledBy',"login")
                    formik.handleSubmit();

                }} style={{backgroundColor:'white',fontFamily:'sans-serif',color:colors.red[900],borderColor:'white',fontWeight:'bold'}} className='button' >
                    {state.loadingLogin?<Loading type="gradient" color="currentColor" size="sm" />:"Login"}
                </Button>
                <Button variant='outlined' onClick={()=>{
                    formik.setFieldValue('calledBy',"register")
                    formik.handleSubmit();
                }}  style={{backgroundColor:'white',fontFamily:'sans-serif',color:colors.red[900],borderColor:'white',fontWeight:'bold'}} className='button' >
                    <PersonIcon style={{marginRight:10,marginLeft:'-8%'}}/>
                    {state.loadingRegister?<Loading type="gradient" color="currentColor" size="sm" />:"Register New User"}
                </Button>
            </div>
            <div style={{display:'flex',alignItems:'center'}}>
            <Divider style={{marginTop:'5%',borderColor:"wheat",width:'48%'}}/>
            <span style={{marginTop:'4%',fontFamily:'Oswald',color:'wheat',marginLeft:10,marginRight:10}}>or</span>
            <Divider style={{marginTop:'5%',borderColor:"wheat",width:"45%"}}/>
            </div>
            <span style={{fontSize:30,fontFamily:'Oswald',marginBottom:10,marginLeft:3,color:'wheat',alignSelf:'center'}}>Continue with</span>
            <div style={{display:"flex",flexDirection:"column",gap:10,display:"flex",justifyContent:"center",alignItems:'center'}}>
                <Button variant='outlined' onClick={signInWithGoogle} style={{backgroundColor:'white',fontFamily:'sans-serif',color:colors.red[900],borderColor:'white',fontWeight:'bold',width:'75%'}} >
                    <GoogleIcon style={{marginRight:10}}/>
                    Continue with Google
                </Button>
            </div>
        </div>
    </div>
  )
}
