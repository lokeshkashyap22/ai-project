"use client"
import Typical from 'react-typical';

export default function Landing() {
  return (
    <div className="relative h-screen">
      <h1 className="absolute md:left-4 md:top-4 font-bold text-4xl text-gray-100 text-center text-outline w-full md:w-auto md:text-left">
        ChatQ
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="bg-gray-100  flex-col items-center justify-center hidden md:flex">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to CHATQ  😜</h1>
            
            <h1 className="text-4xl text-gray-800 text-center">
             <Typical
            steps={[
                'Welcome to ChatQ!', 3000,
                'This chatbot will help you...', 3000,
                '...answer your queries.', 3000,
                '...provide support.', 3000,
                '...assist with coding issues.', 3000,
                '...offer study tips.', 3000,
                '...recommend resources.', 3000,
                '...and much more!', 3000,
              ]}
            loop={Infinity}
            wrapper="p"
          />
          </h1>
         
        </div>
        <div className="bg-white flex flex-col gap-8 justify-center items-center">
          <h1 className="text-5xl font-bold text-gray-800 text-center">Get started</h1>
          <div className="flex gap-6 justify-center items-center w-full">
            <button className="bg-blue-500 text-white p-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">Log in</button>
            <button className="bg-blue-500 text-white p-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
