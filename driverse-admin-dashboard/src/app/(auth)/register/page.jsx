// "use client";
// import { useRouter } from "next/navigation";
// // import loginImg from '../../../../public/assets/loginImg.jpg'
// import { useState } from "react";
// import axios from 'axios';
// import { toast } from "sonner";
// import { PulseLoader } from "react-spinners";
// export default function Login() {
//   const [authData, setAuthData] = useState({
//     FirstName:"",
//     LastName:"",
//     email:"",
//     password:"",
//   })
//   const [loading , setLoading]= useState(false);
//  const handlesubmit = async  (e)=>{
//   e.preventDefault()
//   setLoading(true);
//   try {
//     if(!authData){
//       toast.error('Fill the require Fields')
//     }
//   const res = await  axios.post("/api/adminregister", {
//     FirstName: authData.FirstName,
//     LastName: authData.LastName,
//     email: authData.email,
//     password: authData.password
//   })
//    if (res.status === 200){
//     setAuthData({  name:"",
//     email:"",
//     password:"",})
//    } 
//    toast.success('User Register Sucessfully') 
//   } catch (error) {
//     console.log(error)
//     toast.error('Unable To Create Customer');
//   }finally{
//     setLoading(false);
//   }
//  }
//   return (
//     <div className="flex min-h-screen bg-black">
//     <div className="container mx-auto px-4 flex items-center justify-center">
//       <div className="w-full max-w-4xl">
//         <div className="flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden">
//           {/* Left Side - Image Section */}
//           <div 
//             className="md:w-1/2 bg-cover bg-center relative"
//             style={{ 
//               backgroundImage: `url('login.png')`,
//               minHeight: '500px'
//             }}
//           >
//             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//               <div className="bg-white bg-opacity-20 p-6 rounded-lg text-center border border-white">
//                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
//                   Welcome Back
//                 </h1>
//                 <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
//                   To Driverse Admin
//                 </h2>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Registration Form */}
//           <div className="md:w-1/2 bg-white p-8 flex flex-col justify-center mb-4  rounded-sm ">
//             <div className="text-center mb-4">
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 viewBox="0 0 24 24" 
//                 className="w-16 h-16 mx-auto mb-4 text-gray-700"
//               >
//                 <path 
//                   fillRule="evenodd" 
//                   d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" 
//                   clipRule="evenodd" 
//                 />
//               </svg>

//               <h2 className="text-3xl font-bold text-gray-800 mb-2">
//                 Register
//               </h2>
//               <p className="text-gray-600">
//                 Please Register to continue
//               </p>
//             </div>

//             <form className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label 
//                     htmlFor="firstName" 
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     First Name
//                   </label>
//                   <input 
//                     type="text"
//                     id="firstName"
//                     placeholder="First Name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     onChange={(e) => setAuthData({...authData, FirstName: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label 
//                     htmlFor="lastName" 
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Last Name
//                   </label>
//                   <input 
//                     type="text"
//                     id="lastName"
//                     placeholder="Last Name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     onChange={(e) => setAuthData({...authData, LastName: e.target.value})}
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label 
//                   htmlFor="email" 
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Email
//                 </label>
//                 <input 
//                   type="email"
//                   id="email"
//                   placeholder="Enter your Email"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                   onChange={(e) => setAuthData({...authData, email: e.target.value})}
//                   required
//                 />
//               </div>

//               <div>
//                 <label 
//                   htmlFor="password" 
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Password
//                 </label>
//                 <input 
//                   type="password"
//                   id="password"
//                   placeholder="Enter your password"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                   onChange={(e) => setAuthData({...authData, password: e.target.value})}
//                   required
//                 />
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="button"
//                   onClick={Login}
//                   disabled={loading}
//                   className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
//                 >
//                   {loading ? <Spinner /> : 'Register'}
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// }



"use client";
import { useState } from "react";
import axios from 'axios';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [authData, setAuthData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!authData.FirstName || !authData.LastName || !authData.email || !authData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      const res = await axios.post("/api/adminregister", {
        FirstName: authData.FirstName,
        LastName: authData.LastName,
        email: authData.email,
        password: authData.password
      });

      if (res.status === 200) {
        toast.success('User Registered Successfully');
        // Reset form or redirect
        setAuthData({
          FirstName: "",
          LastName: "",
          email: "",
          password: ""
        });
        // Optionally redirect to login or dashboard
        // router.push('/login');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to Create User');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden">
            {/* Left Side - Image Section */}
            <div 
              className="md:w-1/2 bg-cover bg-center relative"
              style={{ 
                backgroundImage: `url('/login.png')`,
                minHeight: '500px'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white bg-opacity-20 p-6 rounded-lg text-center border border-white">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome Back
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
                    To Driverse Admin
                  </h2>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="md:w-1/2 bg-white p-8 flex flex-col justify-center mb-4 rounded-sm">
              <div className="text-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className="w-16 h-16 mx-auto mb-4 text-gray-700"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" 
                    clipRule="evenodd" 
                  />
                </svg>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Register
                </h2>
                <p className="text-gray-600">
                  Please Register to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="firstName" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input 
                      type="text"
                      id="firstName"
                      placeholder="First Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      value={authData.FirstName}
                      onChange={(e) => setAuthData({...authData, FirstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="lastName" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input 
                      type="text"
                      id="lastName"
                      placeholder="Last Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      value={authData.LastName}
                      onChange={(e) => setAuthData({...authData, LastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input 
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={authData.email}
                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input 
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={authData.password}
                    onChange={(e) => setAuthData({...authData, password: e.target.value})}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
                  >
                    {loading ? <Spinner /> : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}