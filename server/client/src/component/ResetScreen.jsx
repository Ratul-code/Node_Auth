import React, { useEffect, useState } from "react";
import { useNavigate, Link,useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const ResetScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPage, setForgotPage] = useState(location.pathname.endsWith("resetpass"));
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const { email, newPassword, confirmPassword } = formData;

      // if (forgotPage) {
      //   if (!email) {
      //     setTimeout(() => {
      //       setErrorMessage("");
      //     }, 5000);
      //     return setErrorMessage("Please fill up the field above");
      //   }
      // }
      // if (!forgotPage) {
      //   if (!newPassword||!confirmPassword) {
      //       setTimeout(() => {
      //         setErrorMessage("");
      //       }, 5000);
      //       return setErrorMessage("Please fill up all the field above");
            
      //     }else if(newPassword !== confirmPassword){
      //         setTimeout(() => {
      //             setErrorMessage("");
      //             }, 5000);
      //             return setErrorMessage("Passwords do not match");
      //       }
      // }

      const baseurl = "http://localhost:5000/api/auth";

      try {
        if (forgotPage) {
          const {data:{data}} = await axios.post(`${baseurl}/forgotpassword`, {
            email,
          });
          console.log(data.token);
          setSuccessMessage("We have sent further instruction to the email above")
          setFormData({
              ...formData,
              email:""
          })
          cookies.set("resetPassToken",data.token);
          // console.log("done")
        }
        if (!forgotPage) {
            const resetToken = cookies.get("resetPassToken")
            console.log(resetToken);
          await axios.put(`${baseurl}/resetpassword/${resetToken}`, {
            password:newPassword,
          });
          cookies.remove("resetPassToken",{path:"/"})
          navigate("/auth");
        }
      } catch (error) {
        return setErrorMessage(error.response.data.error);
      }
    };
  return (
    <div className="bg-gray-200 h-[100vh] flex justify-center items-center">
      <form
        className={`bg-white flex justify-center items-center flex-col gap-4 w-[30%] p-5`}
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold tracking-[3px] mb-4">Register </h1>
        {forgotPage && (
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
        )}
        {!forgotPage && (
          <div className="input-section">
            <label className="label " htmlFor="password">
              New Password
            </label>
            <input
              name="newPassword"
              className="inputs"
              type="text"
              id="newPasword"
              placeholder="New Password"
              value={formData.newPassword}
              required
              onChange={handleChange}
            />
          </div>
        )}

        {!forgotPage && (
          <div className="input-section">
            <label className="label " htmlFor="confirmpassword">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              className="inputs"
              type="text"
              id="confirmpassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              required
              onChange={handleChange}
            />
          </div>
        )}
        <div className="w-[100%]">
          <p className="mb-2 mt-[-10px] text-red-500 font-[700]">{errorMessage}</p>
          <p className="mb-2 text-green-900 font-[700]">{successMessage}</p>
          <button
            className="w-[100%] bg-orange-600 text-white py-1 text-lg tracking-[1px]"
            type="submit"
          >
            {!forgotPage ? "Reset Password" : "Send Email"}
          </button>
          <Link to="/">
            <p className="mt-2 tracking-wide cursor-pointer font-[600] text-right underline">
              Back to Sign In
               {/* --&#62; */}
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetScreen;
