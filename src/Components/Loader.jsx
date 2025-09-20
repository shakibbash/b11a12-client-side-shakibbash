import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="relative">
                <div className="w-20 h-20 border-primary border-4 rounded-full"></div>
                <div className="w-20 h-20 border-accent border-t-4 animate-spin rounded-full absolute top-0 left-0"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-dark font-bold">
                      <img className='w-[100px]'
                        src='Public/assets/logo-2.png' 
        
                    />
                </div>
            </div>
            <div className="ml-4 text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Loading...
            </div>
        </div>
    )
}

export default Loader 