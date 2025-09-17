import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ChatUI from './components/ChatUI';
import Gallery from './components/Gallery';
import ImageCustomizer from './components/ImageCustomizer';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import Login from './components/Login';
import Register from './components/Rigister';
import OTPVerify from './components/OTPVerify';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/otp-verify" element={<OTPVerify />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/customize/:imageId" element={<ImageCustomizer />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </AuthProvider>
    </ThemeProvider>
  );
}

function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Create a New Thumbnail</h2>
        <ThumbnailGenerator />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Chat with AI</h2>
        <ChatUI />
      </div>
    </div>
  );
}

export default App;
