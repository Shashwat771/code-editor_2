import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import image from "../images/auth-side.png";
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (pwd.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      toast.error("Username must be at least 3 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(api_base_url + "/signUp", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          name: name.trim(),
          email: email.trim(),
          password: pwd
        })
      });

      const data = await response.json();

      console.log("SignUp response:", data); // Debug log

      if (data.success === true) {
        toast.success("Account created successfully! Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        setError(data.message || "Sign up failed. Please try again.");
        toast.error(data.message || "Sign up failed");
      }
    } catch (error) {
      console.error("SignUp error:", error);
      setError("Network error. Please check your connection.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-screen min-h-screen flex flex-col lg:flex-row items-center justify-between animate-fadeIn bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Left Section - Form */}
        <div className="w-full lg:w-[45%] min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-0 lg:pl-12">
          <div className="w-full max-w-md animate-slideUp">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                CodeIIT
              </h1>
              <p className="text-gray-400 text-sm">Join thousands of learners</p>
            </div>

            <form onSubmit={submitForm} className='w-full mt-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 p-6 sm:p-8 rounded-2xl backdrop-blur-md shadow-2xl'>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Create Account</h2>

              <div className="inputBox">
                <input
                  required
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  value={username}
                  type="text"
                  placeholder='Username'
                  disabled={loading}
                  minLength={3}
                  autoComplete="username"
                />
              </div>

              <div className="inputBox">
                <input
                  required
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  value={name}
                  type="text"
                  placeholder='Full Name'
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="inputBox">
                <input
                  required
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  value={email}
                  type="email"
                  placeholder='Email Address'
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="inputBox">
                <input
                  required
                  onChange={(e) => { setPwd(e.target.value); setError(""); }}
                  value={pwd}
                  type="password"
                  placeholder='Password (min 6 characters)'
                  disabled={loading}
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <p className='text-gray-400 text-sm text-center'>Already have an account? <Link to="/login" className='text-purple-400 hover:text-purple-300 font-medium transition-colors'>Login</Link></p>

              {error && <p className='text-red-400 text-sm my-3 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20'>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btnBlue w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>

              <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-xs text-purple-400">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Image (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-[55%] min-h-screen items-center justify-center p-12">
          <div className="relative w-full h-full max-w-md">
            <img className='w-full h-full object-cover rounded-2xl' src={image} alt="Coding illustration" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent rounded-2xl opacity-20"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp