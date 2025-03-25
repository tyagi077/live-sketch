"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


function signup() {
    interface FormValues {
        Name:string,
        Email: string,
        password: string
    }
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();

    const router = useRouter()

    const handleClick = () => {
        router.push("/auth/signin")
        
    }


    const formSubmit = async(data: FormValues) => {
       try{
        const response= await axios.post(`${HTTP_BACKEND}/signup`,{
            username:data.Email,
            password:data.password,
            name:data.Name
        })
        
        if(response.data.status){
            toast.success(response.data.message)
            router.push("/auth/signin")
        }else{
            toast.error(response.data.message)
        }
       }catch(error:any){
        if (error.response) {
            // Extract message from backend error response
            toast.error(error.response.data.message);
        } else if (error.request) {
            // No response received from server
            toast.error("No response from server. Please try again later.");
        } else {
            // Other errors (e.g., network issues)
            toast.error(error.message);
        }
       }
    }
    return (
        <div className=" flex flex-col items-center justify-center rounded border border-gray-800 px-10 py-20 bg-[#0E131E]">
            <div className="h-10 w-10 mb-4 flex items-center justify-center rounded-full bg-[#0F2139]">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#0077FF" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>

            </div>
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-gray-400 text-sm pt-2 pb-6 ">Enter your credentials to access your account</p>
            <div className="mb-6">
                <form className="" onSubmit={handleSubmit(formSubmit)}>
                    <div className="my-4">
                        <label className="font-medium " >Name</label>
                        <div className={`${errors.Name && 'border border-red-600'} bg-[#151D2C] mt-2 rounded-lg`}>
                            <input className="focus:outline-none w-100 p-3 rounded-lg text-white" placeholder="Full Name" type="text" {...register('Name',
                                {
                                    required: { value: true, message: "Required" },
                                    minLength:{value:3,message:"minimum 3"},
                                    maxLength:{value:20,message:"Limit 20"}
                                  
                                }
                            )} />
                        </div>
                        {errors?.Name && <p className="text-red-600" >{errors.Name.message}</p>}
                    </div>
                    <div className="my-4">
                        <label className="font-medium " >Email</label>
                        <div className={`${errors.Email && 'border border-red-600'} bg-[#151D2C] mt-2 rounded-lg`}>
                            <input className="focus:outline-none w-100 p-3 rounded-lg text-white" placeholder="name@example.com" type="email" {...register('Email',
                                {
                                    required: { value: true, message: "Required" },
                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "invalid email address" }
                                }
                            )} />
                        </div>
                        {errors?.Email && <p className="text-red-600" >{errors.Email.message}</p>}
                    </div>
                    <div className="my-4">
                        <label>Password</label>

                        <div className={` ${errors.password && 'border border-red-600'} bg-[#151D2C] mt-2 rounded-lg`}>
                            <input className=" focus:outline-none w-100 text-white p-3 rounded-lg focus:outline " placeholder="......." type="text"  {...register('password',

                                {
                                    required: { value: true, message: "Required" },
                                    minLength: { value: 3, message: "minimum 3" },
                                    maxLength: { value: 20, message: "maximum 20" },
                                }
                            )} />
                        </div>
                        {errors.password && <p className="text-red-600">{errors.password.message}</p>}

                    </div>
                    <div>
                        <button className="relative w-100 bg-[#0077FF] py-3 rounded-lg font-medium" disabled={isSubmitting}>{isSubmitting ? 'creating....' : 'Create account'}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute top-3.5 left-65  size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                        </button>
                       

                    </div>
                </form>
            </div>
            <div>
                <p className="text-center">Already have an account? <span onClick={handleClick} className="cursor-pointer text-[#0077FF]">Sign in</span></p>
            </div>

        </div>
    )
}

export default signup