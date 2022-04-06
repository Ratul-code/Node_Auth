import React from 'react'
import {Navigate} from "react-router-dom";
import Cookies from 'universal-cookie'
const cookies = new Cookies();
const Authenticated = ({children}) => {
    const authToken = cookies.get("authToken")
  return (
    !authToken?children:<Navigate to="/"/>
  )
}

export default Authenticated