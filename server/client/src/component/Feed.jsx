import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();
axios.defaults.withCredentials=true

const Feed = () => {
  const navigate = useNavigate();
  const [privData,setPrivData] = useState();
  
  useEffect(()=>{
    const authToken = cookies.get("authToken")
    const baseurl = "http://localhost:5000/api";
    const fetchPrivateData = async()=>{

      const {data:{data}} = await axios.get(`${baseurl}/private`,{
        headers:{
          "Content-Type":"application/json",
          Authorization: `user ${authToken}`
        }
      });
      setPrivData(data);
    };
    fetchPrivateData();
  },[])
  return (
    <div>{privData}
    <p onClick={async ()=>{
       await axios.get("http://localhost:5000/api/auth/logout").then(
         window.location.reload()
       )
    }} >LogOut</p>
    <Link to="/private"><p>private</p></Link> 
    </div>
  )
}

export default Feed