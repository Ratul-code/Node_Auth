import React, { createContext, useContext, useState } from 'react'
import axios from 'axios';
const AuthContext = createContext();
const AuthContextProvider = ({children}) => {
    const [authenticated,setAuthenticated] = useState(undefined)
    
  return (
    <AuthContext.Provider value={{authenticated,setAuthenticated}}>
      {children}
    </AuthContext.Provider>
  )
}
export const  useAuth = ()=>useContext(AuthContext);

export default AuthContextProvider