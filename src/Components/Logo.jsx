import React from 'react';
import { MdForum } from 'react-icons/md';

const Logo = () => {
    return (
        <div>
                   <div className="flex items-center space-x-2">
                          <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-2 rounded-lg shadow-lg">
                            <MdForum className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-indigo-400 bg-clip-text text-transparent">
                            ForumX
                          </div>
                        </div>
        </div>
    );
};

export default Logo;