import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const GoogleSignin = () => {
  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);
    // Here, you would typically send the token to your backend for verification
    // and to create a user session.
    // For example:
    // axios.post('/api/auth/google', { token: credentialResponse.credential })
    //   .then(response => {
    //     // Handle successful login, e.g., store user data in context
    //   })
    //   .catch(error => {
    //     // Handle login error
    //   });
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
    />
  );
};

export default GoogleSignin;
