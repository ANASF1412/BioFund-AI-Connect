import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-full min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );
};

export default Loader;
