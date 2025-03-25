"use client"
import React, { useContext } from 'react';
import { Github, Twitter, Menu, PenLine, Share2, Download, Lock, Users, Pencil, MousePointer2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';


export default function Home() {

  const router = useRouter();


  const Authcontext = useContext(AuthContext)
  const user = Authcontext?.user
  const setUser = Authcontext?.setUser

  const handleLogout=()=>{
    toast.success("You have been logged out successfully.", {
      position: "top-center", 
      pauseOnHover: false,
      pauseOnFocusLoss: true,
    });
    localStorage.removeItem("D_token")
    setUser!(null)
  }


  return (
    <div className="min-h-screen bg-[#111723]">
      {/* Navigation */}
      <nav className="border-b border-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <PenLine className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-white">Drawify</span>
            </div>
            <div className='flex gap-10'>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-400 hover:text-gray-200">About</a>
                <a href="#" className="text-gray-400 hover:text-gray-200">Blog</a>
                <a href="#" className="text-gray-400 hover:text-gray-200">Libraries</a>
                <button onClick={() => router.push(`${user ? '/room' : '/auth/signin'}`)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                  Start Drawing
                </button>

              </div>
             {user?<div onClick={handleLogout} className='flex items-center justify-center bg-[#0F2139] p-2 rounded-md hover:bg-gray-300 cursor-pointer '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0077FF" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                </svg>

              </div>:''}
            </div>


            <div className="md:hidden">
              <Menu className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold  sm:text-5xl md:text-6xl">
            <span className="block text-gray-300">Draw together in</span>
            <span className="block text-blue-600">real-time, anywhere</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create, collaborate, and watch your ideas come to life instantly.
            Share your board with a simple link and draw together with your team in real-time.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button onClick={() => router.push(`${user ? '/room' : '/auth/signin'}`)} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                Create New Board
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Collaboration Demo */}
      <div className="bg-gray-850 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <h3 className="text-2xl font-extrabold text-gray-300 tracking-tight sm:text-3xl">
                  Real-time collaboration that just works
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Watch as your teammates' cursors move and drawings appear instantly.
                  No lag, no conflicts, just seamless collaboration powered by WebSocket technology.
                </p>

                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#0F2139] text-white">
                        <Users className="h-6 w-6" color='#0077FF' />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-white">Unlimited Collaborators</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Invite as many team members as you need. Everyone can draw and edit in real-time.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#0F2139] text-white">
                        <MousePointer2 className="h-6 w-6 " color='#0077FF' />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-white">Live Cursors</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      See where everyone is working with real-time cursor tracking and presence indicators.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#0F2139] text-white">
                        <Pencil className="h-6 w-6" color='#0077FF' />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-white ">Instant Updates</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Every stroke appears instantly for all participants, creating a truly synchronized experience.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0">
                <img
                  className="relative mx-auto rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1600267185393-e158a98703de?auto=format&fit=crop&w=1400&q=80"
                  alt="Collaborative drawing demonstration"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#0F2139] text-white mb-4">
              <Share2 className="h-6 w-6" color='#0077FF' />
            </div>
            <h3 className="text-lg font-medium text-white">Instant Sharing</h3>
            <p className="mt-2 text-base text-gray-500">
              Share your board with a single link. No sign-up required for viewers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#0F2139] text-white mb-4">
              <Download className="h-6 w-6" color='#0077FF' />
            </div>
            <h3 className="text-lg font-medium text-white">Export Anytime</h3>
            <p className="mt-2 text-base text-gray-500">
              Download your work in multiple formats when you're done collaborating.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#0F2139] text-white mb-4">
              <Lock className="h-6 w-6" color='#0077FF' />
            </div>
            <h3 className="text-lg font-medium text-white">Secure Connection</h3>
            <p className="mt-2 text-base text-gray-500">
              All real-time connections are encrypted and secure by default.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#111723] border-t border-gray-400">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <PenLine className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-white font-semibold">Drawify</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


