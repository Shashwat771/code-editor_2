import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar';
import { MdLightMode } from "react-icons/md";
import { BsGridFill } from "react-icons/bs";
import { Menu, X } from 'lucide-react';
import { api_base_url, toggleClass } from '../helper';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.user);
      }
      else {
        setError(data.message);
      }
    })
  }, [])

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  }

  return (
    <>
      <div className="navbar flex items-center justify-between px-3 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] h-14 sm:h-16 md:h-20 glass-strong shadow-elevated animate-slideDown" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        {/* Logo */}
        <div className="logo flex-shrink-0">
          <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer whitespace-nowrap hover:opacity-80 transition">
            CodeIIT
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="links hidden md:flex items-center gap-2 sm:gap-4 lg:gap-6">
          <Link to='/' className="text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105">Home</Link>
          <Link to='/tutorials' className="text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105">Tutorials</Link>
          <Link to='/problems' className="text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105">Problems</Link>
          <Link to='/qna' className="text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105">Q&A</Link>
        </div>

        {/* Right Section - Desktop */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <button onClick={logout} className='btnBlue !bg-gradient-to-r !from-red-500 !to-red-600 px-4 text-sm py-2'>Logout</button>
          <Avatar 
            onClick={() => { toggleClass(".dropDownNavbar", "hidden") }} 
            name={data ? data.name : ""} 
            size="36" 
            round="50%" 
            className='cursor-pointer transition-transform hover:scale-110 ring-2 ring-purple-500/30 flex-shrink-0' 
          />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Avatar 
            onClick={() => { toggleClass(".dropDownNavbar", "hidden") }} 
            name={data ? data.name : ""} 
            size="32" 
            round="50%" 
            className='cursor-pointer transition-transform hover:scale-110 ring-2 ring-purple-500/30 flex-shrink-0' 
          />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Dropdown */}
        <div className='dropDownNavbar hidden absolute right-2 sm:right-4 md:right-8 top-full mt-2 glass-strong shadow-elevated p-4 rounded-xl w-48 animate-slideDown z-50'>
          <div className='py-2 border-b border-white/20 mb-3'>
            <h3 className='text-base font-semibold' style={{ lineHeight: 1 }}>{data ? data.name : ""}</h3>
          </div>
          <i className='flex items-center gap-3 py-2 px-2 mb-1 cursor-pointer rounded-lg hover:bg-white/10 transition-all text-sm font-medium' style={{ fontStyle: "normal" }}><MdLightMode className='text-lg' /> Light mode</i>
          <i onClick={() => setIsGridLayout(!isGridLayout)} className='flex items-center gap-3 py-2 px-2 cursor-pointer rounded-lg hover:bg-white/10 transition-all text-sm font-medium' style={{ fontStyle: "normal" }}><BsGridFill className='text-lg' /> {isGridLayout ? "List" : "Grid"} layout</i>
          <button onClick={logout} className='w-full mt-3 btnBlue !bg-gradient-to-r !from-red-500 !to-red-600 text-sm py-2'>Logout</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-purple-400/20 animate-slideDown">
          <div className="px-4 py-4 space-y-2">
            <Link 
              to='/' 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Home
            </Link>
            <Link 
              to='/tutorials' 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Tutorials
            </Link>
            <Link 
              to='/problems' 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Problems
            </Link>
            <Link 
              to='/qna' 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Q&A
            </Link>
            <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
              <button 
                onClick={() => setIsGridLayout(!isGridLayout)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium"
              >
                <BsGridFill className='text-lg' /> {isGridLayout ? "List" : "Grid"} layout
              </button>
              <button 
                onClick={logout} 
                className='w-full btnBlue !bg-gradient-to-r !from-red-500 !to-red-600 text-sm py-2'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
