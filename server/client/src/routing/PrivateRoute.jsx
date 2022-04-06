import React, { useContext } from 'react'
import {useLocation,Navigate,Outlet} from "react-router-dom";
import Cookies from "universal-cookie";
import { useAuth } from '../helpers/AuthContext';
// const cookies = new Cookies();


const PrivateRoute = () => {
    const {authenticated} = useAuth();
    const location = useLocation();
    return (authenticated? <Outlet/>: <Navigate to="/" state={{from:location}} replace />)
}

export default PrivateRoute