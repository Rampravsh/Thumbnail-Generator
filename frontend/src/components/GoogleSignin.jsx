import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Import axios
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify"; // Import toast for notifications

const GoogleSignin = () => {
  const { login } = useAuth(); // Get login function from AuthContext
  const navigate = useNavigate(); // Get navigate function

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the Google ID token to your backend
      const res = await axios.post(
        "http://localhost:5000/api/auth/google/callback",
        {
          // Updated endpoint
          token: credentialResponse.credential,
        }
      );

      const { token } = res.data; // Assuming your backend returns your app's JWT token
      localStorage.setItem("token", token); // Store your app's JWT token
      const decoded = jwtDecode(token); // Decode your app's JWT token
      login(decoded); // Update AuthContext with your app's decoded user data
      toast.success("Google login successful!");
      navigate("/"); // Navigate to home page
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleError = () => {
    console.log("Google Login Failed");
    toast.error("Google login failed. Please try again.");
  };

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap />
  );
};

export default GoogleSignin;
