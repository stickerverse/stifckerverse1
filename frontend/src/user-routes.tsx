
// THIS FILE IS AUTOGENERATED WHEN PAGES ARE UPDATED
import { lazy } from "react";
import { RouteObject } from "react-router";


import { UserGuard } from "app";


const Admin = lazy(() => import("./pages/Admin.tsx"));
const App = lazy(() => import("./pages/App.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Design = lazy(() => import("./pages/Design.tsx"));
const DesignStudio = lazy(() => import("./pages/DesignStudio.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Logout = lazy(() => import("./pages/Logout.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.tsx"));

export const userRoutes: RouteObject[] = [

	{ path: "/admin", element: <UserGuard><Admin /></UserGuard>},
	{ path: "/", element: <App />},
	{ path: "/cart", element: <UserGuard><Cart /></UserGuard>},
	{ path: "/design", element: <UserGuard><Design /></UserGuard>},
	{ path: "/design-studio", element: <UserGuard><DesignStudio /></UserGuard>},
	{ path: "/designstudio", element: <UserGuard><DesignStudio /></UserGuard>},
	{ path: "/login", element: <Login />},
	{ path: "/logout", element: <UserGuard><Logout /></UserGuard>},
	{ path: "/profile", element: <UserGuard><Profile /></UserGuard>},
	{ path: "/register", element: <UserGuard><Register /></UserGuard>},
	{ path: "/user-profile", element: <UserGuard><UserProfile /></UserGuard>},
	{ path: "/userprofile", element: <UserGuard><UserProfile /></UserGuard>},

];
