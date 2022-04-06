import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const Auth = () => {
  const navigate = useNavigate();
  const [registerPage, setRegisterPage] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotMessageI, setForgotMessageI] = useState({
    number: 0,
    message: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // if (registerPage) {
    //   if (!username || !email || !password || !confirmPassword) {
    //     setTimeout(() => {
    //       setErrorMessage("");
    //     }, 5000);
    //     return setErrorMessage("Please fill up all the field above");
    //   } else if (password !== confirmPassword) {
    //     setFormData({ ...formData, password: "", confirmPassword: "" });
    //     setTimeout(() => {
    //       setErrorMessage("");
    //     }, 5000);
    //     // return setErrorMessage("Passwords do not match ");
    //   }
    // }

    // if (!registerPage) {
    //   if (!email || !password) {
    //     setTimeout(() => {
    //       setErrorMessage("");
    //     }, 5000);
    //     // return setErrorMessage("Please fill up all the field above");
    //   }
    // }
    try {


      if (registerPage) {
        // const { data } = await axios.post(`${baseurl}/register`, {
        //   username,
        //   email,
        //   password,
        // });
        // cookies.set("authToken", data.token);
        await axios.post("http://localhost:5000/api/auth/register",{
          withCredentials:true,
          username,
          email,
          password
        })
        .then(()=>{
          // console.log(res)
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setRegisterPage((prevState) => !prevState);

        })
        .catch(err=>console.log(err))
      }
      if (!registerPage) {
        await axios.post("http://localhost:5000/api/auth/login",{
          withCredentials:true,
          email,
          password
        })
        .then(res=>{
          console.log(res)
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          window.location.reload();

        })
        .catch(err=>{
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
          return setErrorMessage(err.response.data.error)
        })
      }
    } catch (error) {
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      if (error.response.data.error === "Incorrect Password") {
        setForgotMessageI({
          ...forgotMessageI,
          number: forgotMessageI.number + 1,
        });
        if (forgotMessageI.number >= 3) {
          setForgotMessageI({
            ...forgotMessageI,
            number: 0,
            message: "Forgot Password?",
          });
        }
      }
      return setErrorMessage(error.response.data.error);
    }
  };
  return (
    <div className="bg-gray-200 h-[100vh] flex justify-center items-center">
      <form
        className=" bg-white flex justify-center items-center flex-col gap-4 w-[30%] p-5"
        onSubmit={handleSubmit}
      >
        <h1 className={`text-xl font-bold tracking-[${registerPage?"3px":"1px"}] mb-4`}>{ registerPage?" Register":"Sign In"} </h1>
        {registerPage && (
          <div className="input-section">
            <label className="label " htmlFor="username">
              Username
            </label>
            <input
              name="username"
              className="inputs"
              type="text"
              id="username"
              placeholder="Username"
              value={formData.username}
              required
              onChange={handleChange}
            />
          </div>
        )}

        <div className="input-section">
          <label className="label " htmlFor="email">
            Email
          </label>
          <input
            name="email"
            className="inputs"
            type="text"
            id="email"
            placeholder="Email"
            value={formData.email}
            required
            onChange={handleChange}
          />
        </div>
        <div className="input-section">
          <label className="label " htmlFor="password">
            Password
          </label>
          <input
            name="password"
            className="inputs"
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            required
            onChange={handleChange}
          />
        </div>
        {registerPage && (
          <div className="input-section">
            <label className="label " htmlFor="confirmpassword">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              className="inputs"
              type="password"
              id="confirmpassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              required
              onChange={handleChange}
            />
          </div>
        )}
        <div className="w-[100%]">
          <p className="mb-2 text-red-500 font-[700]">{errorMessage}</p>
          <button
            className="w-[100%] bg-orange-600 text-white py-1 text-lg tracking-[1px]"
            type="submit"
          >
            {!registerPage ? "Sign In" : "Register"}
          </button>
          <p className=" tracking-wider mt-2 font-bold">
            {registerPage?"Already have an account? ":"Dont have an account? "}
            
            <span
              className="font-[600] cursor-pointer  underline"
              onClick={() => setRegisterPage((prevState) => !prevState)}
            >
              {!registerPage ? "Sign Up" : "Sign In"}
            </span>
          </p>
          <Link to="/auth/resetpass">
            <p className="mb-5 tracking-wide inline cursor-pointer font-[600] underline">
              {registerPage?"":"Forgot Password?"}
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Auth;
