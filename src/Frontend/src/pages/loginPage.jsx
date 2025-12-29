import { useState } from "react";
import Service from "../service/Service";

const Login = () => {
    const [credenciales, setCredenciales] = useState ({
        user: '',
        password:''
    })

    const handleSubmit = (e) => {
        e.PreventDefault();
    }

    const onChangeCredentials = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        })
        console.log(credenciales);
    }

    const handleLogin = () => {
        Service.login(credenciales)
        .then(Response => {
            
        })
        .catch(error => {
            console.log(error)
        })
    }

    return(
        <>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Login</title>
            <div className="bg-gray-50 dark:bg-red-900" style={{width: '100vw'}}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                    <img
                    className="w-8 h-8 mr-2"
                    src="https://es.wikipedia.org/wiki/Archivo:Usac_logo.png"
                    alt="png"
                    />
                    GoDisk
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-red-700 dark:border-red-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Inicia Sesión
                    </h2>
                    <form
                        className="space-y-4 md:space-y-6"
                        encType="multipart/form-data"
                        method="POST"
                        action="/sigin/"
                        onSubmit={handleSubmit}
                    >
                        <div>
                        <label
                            htmlFor="user"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Código
                        </label>
                        <input
                            type="text"
                            name="user"
                            id="user"
                            className="bg-red-50 border border-red-300 text-red-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-500 dark:border-red-400 dark:placeholder-red-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="EV-OR00"
                            required=""
                            value={credenciales.user}
                            onChange={onChangeCredentials}
                        />
                        </div>
                        <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-500 dark:border-red-400 dark:placeholder-red-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required=""
                            value={credenciales.password}
                            onChange={onChangeCredentials}
                        />
                        </div>
                        <button
                        type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 bg-red-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                        >
                        Iniciar Sesión
                        </button>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default Login