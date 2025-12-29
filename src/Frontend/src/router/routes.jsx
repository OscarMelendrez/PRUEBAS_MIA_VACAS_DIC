import { createBrowserRouter } from "react-router-dom"
import Main from "../pages/mainPage"
import Login from "../pages/loginPage"
import Principal from "../pages/principalPage"

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main />
    },
    {
        path: '/principal',
        element: <Principal />
    }
])