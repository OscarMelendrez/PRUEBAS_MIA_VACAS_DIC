import { useState } from "react";

const Main = () => {

    
    return(
        <>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Login</title>
            <div className="bg-gray-50 dark:bg-red-900" style={{width: '100vw'}}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="flex flex-col items-center justify-center mb-6 text-5xl font-semibold text-white dark:text-white" >
                    GoDisk
                </h1>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-red-800 dark:border-red-950">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-10 ">
                    <button
                        type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 bg-red-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >
                        Iniciar Sesion
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default Main