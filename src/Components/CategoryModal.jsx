
import { Button, ButtonBase, Chip, Divider, IconButton, Modal, Rating, colors } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Input } from '@nextui-org/react';
import "./MovieDetailsCard.css"
import { useNavigate } from 'react-router';



function CategoryModal({setSaved,vis,setVis,id,data}) {
    const userID=useSelector(state=>state.userReducer.userID)
    const [val,setVal]=useState("")
    const [categories,setCategories]=useState([]) 
    const [childVis,setChildVis]=useState(false)
    const [deleteCat,setDeleteCat]=useState("")
    const navigate=useNavigate();

    useEffect(()=>{
        if(userID){
            getCategories();
        }
        async function get(){
            await firebase.firestore().collection("watchlist").doc(userID).collection("posts").where("imdbID",'==',id).get().then((snap)=>{
                snap.forEach(s=>{
                    if(s.data()){
                        setSaved(true);
                    }
                })
            })
        }
        if(userID){
            //get()
        }
      },[])
      async function getCategories(){
        const res=(await firebase.firestore().collection("watchlist").doc(userID).get()).data()?.categories;
        console.log(res);
        if(res==undefined){
            setCategories([]);
        }else{
            setCategories(res);
        }
      }
      async function addToWatchlist(val){
        if(!userID){
            navigate('/auth')
            //return
        }
        console.log("adding")
        await firebase.firestore().collection("watchlist").doc(userID).collection("posts").add({
            data,
            category:val,
            imdbID:id,
            randomID:Math.random()
        }).then((s)=>console.log(s.id)).then(()=>setVis(false))
        console.log("saved")
        setSaved(true)
        // setRefresh((val)=>!val);
      }
      async function addCategory(val){
        console.log(userID);
        if(!userID){
            navigate('/auth')
        }
        if(!val){
            return
        }
        console.log(categories)
        if(categories.length==0){
            console.log("setting")
            await firebase.firestore().collection("watchlist").doc(userID).set({
                categories:[val]
            })
        }else{
            console.log("updating")
            await firebase.firestore().collection("watchlist").doc(userID).update({
                categories:[...categories,val]
            })
        }
        setCategories([...categories,val])
      }
      async function deleteCategory(val){
        let filteredCat=categories.filter((cat)=>cat!=val)
        setCategories(filteredCat);
        await firebase.firestore().collection("watchlist").doc(userID).update({
            categories:filteredCat
        })
    
      }
      function ChildModal(){
        return(
            <Modal open={childVis} onClose={()=>setChildVis(false)} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <div style={{width:'300px',height:'200px',backgroundColor:colors.grey[300],borderRadius:10,padding:10}}>
                    <div style={{fontFamily:"Oswald",fontSize:20}}>
                        Deleting a category will delete all the movies in that list
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:'20%'}}>
                        <Button variant='contained' style={{backgroundColor:colors.red[900],fontFamily:"Oswald"}} onClick={()=>{
                            deleteCategory(deleteCat)
                            setChildVis(false)
                            }}>
                            Okay
                        </Button>
                        <Button variant='outlined' style={{color:'wheat',backgroundColor:colors.red[900],fontFamily:"Oswald",border:'none'}} onClick={()=>setChildVis(false)}>
                            back
                        </Button>
                    </div>
                </div>
            </Modal>
        )
      }
    return (
    <>
    <Modal
        open={vis}
        onClose={()=>setVis(false)} 
        style={{display:'flex',justifyContent:'center',alignItems:'center'}}
        >
            <div className='categoryBox'> 
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between'}}>
                    <Input placeholder='Which category?' value={val} onChange={(e)=>setVal(e.target.value)} width='55%' />
                    <Button title='submit' onClick={()=>addCategory(val)}  style={{backgroundColor:colors.red[900],color:'wheat',borderRadius:20,fontSize:14,fontFamily:'Oswald',letterSpacing:0.8}}>
                        Submit
                    </Button>
                </div>
                <div style={{display:'flex',gap:5,marginTop:10,flexWrap:'wrap',width:'100%'}}>
                    {categories.map(cat=>{
                        return(
                        <ButtonBase style={{borderRadius:15}} onClick={()=>{
                            addToWatchlist(cat)
                            console.log(cat)
                            // setVis(false)
                            }}>
                        <Chip label={cat} onDelete={()=>{
                            setChildVis(true)
                            setDeleteCat(cat)
                        }} style={{backgroundColor:colors.red[900],color:'wheat'}}/>
                        </ButtonBase>
                        )
                    })}
                </div>
            </div>
        </Modal>
        <ChildModal/>
        </>
  )
}

export default CategoryModal