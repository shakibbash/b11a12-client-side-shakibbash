import React from 'react';
import { Outlet, useNavigation } from 'react-router';

import Navbar from '../Components/Navbar';
import Loader from '../Components/Loader';
import Footer from '../Components/Foooter';


const RootLayout = () => {
      const { state } = useNavigation();
       
    return (
        
        <div className='flex flex-col min-h-screen  bg-white text-gray-800'>
            <Navbar></Navbar>
           <main className='flex-grow bg-white'>
        {state === 'loading' ? <Loader /> : <Outlet />}
      </main>
          <footer>
              <Footer></Footer>
          </footer>
        </div>
    );
};

export default RootLayout;
