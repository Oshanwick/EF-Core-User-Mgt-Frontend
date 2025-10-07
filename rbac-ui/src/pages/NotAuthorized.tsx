import React from 'react';
import { Link } from 'react-router-dom';
// 1. Import the icon from lucide-react
import { ShieldAlert } from 'lucide-react';



export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="max-w-lg w-full">
        
        {/* 3. Use the ShieldAlert component from the library */}
        <ShieldAlert className="w-24 h-24 mx-auto text-red-500" />

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Access Denied
        </h1>
        
        {/* Paragraph */}
        <p className="mt-4 text-lg text-gray-600">
          Sorry, you don’t have the necessary permissions to view this page.
        </p>

        {/* Link to Home */}
        <div className="mt-10">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Homepage
          </Link>
        </div>
        
      </div>
    </div>
  );
}