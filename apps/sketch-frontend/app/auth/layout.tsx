import  { ReactNode } from "react";

export default function AuthLayout({children}:{children:ReactNode}){
    return <div className="bg-[#111723] text-white w-screen h-screen grid grid-cols-2">
<div className="px-20 flex flex-col justify-center gap-8">
    
    <div className="h-10 w-10 flex items-center justify-center rounded bg-[#0F2139]">
        <svg 
              viewBox="0 0 24 24" 
              className="h-7 w-7 text-primary"
              fill="none" 
              stroke="#0077FF" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V4l-8-2-8 2v8c0 6 8 10 8 10z" />
        </svg>
    </div>
            
            <h1 className="text-5xl font-semibold">
            Simple, secure access to your workspace
            </h1>
            <p className="text-lg text-gray-400"> 
                Experience our premium platform with intuitive design and powerful features to enhance your productivity.
            </p>

            <div className="flex space-x-15">
            <div className="flex space-x-3">
            <div className="h-10 w-10 flex items-center justify-center rounded bg-[#0F2139]">
            <svg 
                  viewBox="0 0 24 24" 
                  className="h-5 w-5 text-primary"
                  fill="none" 
                  stroke="#0077FF" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5M20 12h-4M12 22v-4M8 12H4" />
                </svg>
            </div>

               <div>
               <h3>Seamless Experience</h3>
               <p className="w-50 text-sm text-gray-400">Designed with elegant simplicity and thoughtful interactions.</p>
               </div>
            </div>
            
            <div className="flex space-x-3">
            <div className="h-10 w-10 flex items-center justify-center rounded bg-[#0F2139]">
           

            <svg 
                  viewBox="0 0 24 24" 
                  className="h-5 w-5 text-primary"
                  fill="none" 
                  stroke="#0077FF" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
            </div>

               <div>
               <h3>Seamless Experience</h3>
               <p className="w-50 text-sm text-gray-400">Designed with elegant simplicity and thoughtful interactions.</p>
               </div>
            </div>
            </div>



              
        </div>



        {/* right side */}
        <div className="flex justify-center items-center">{children}</div>
    </div>
}