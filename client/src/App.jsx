import "./App.css";
import { ScrollToTop } from "react-router-scroll-to-top";
// import { motion } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Sidebar, Topbar } from "./components";
import { tokenAtom, userDataAtom } from "./recoil/atoms/userAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { configKeys } from "./api/config";
import { fetchActiveBanner } from "./api/apiConnections/userConnections";
import { activeBannerAtom } from "./recoil/atoms/settingsAtom";

const Attendance = lazy(() => import("./pages/Attendance"));
const ClientWorks = lazy(() => import("./pages/ClientWorks"));
const Clients = lazy(() => import("./pages/Clients"));
const Home = lazy(() => import("./pages/Home"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const TodaysWork = lazy(() => import("./pages/TodaysWork"));
const Work = lazy(() => import("./pages/Work"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const SignInSignUp = lazy(() => import("./pages/SignInSignUp"));
const Projects = lazy(() => import("./pages/Projects"));
const UserPermissions = lazy(() => import("./pages/UserPermissions"));
const Error = lazy(() => import("./pages/ErrorPage"));

const Layout = () => {
  const [activeBanner, setActiveBanner] = useRecoilState(activeBannerAtom);

  const getActiveBanner = async () => {
    const response = await fetchActiveBanner();
    if (response?.status) {
      setActiveBanner(response.data);
    }
  };

  useEffect(() => {
    getActiveBanner();
  }, []);

  return (
    <>
      <ScrollToTop />
      <img
        src={activeBanner.bannerURL}
        className="absolute -z-10 h-[calc(100vh-0.5rem)] w-full object-cover opacity-100"
      />
      <Topbar />
      <div className="flex mt-2">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

function App() {
  const token = useRecoilValue(tokenAtom);
  const user = useRecoilValue(userDataAtom);

  const router = createBrowserRouter([
    {
      path: "/",
      element: token && <Layout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Home /> : <SignInSignUp />}
            </Suspense>
          ),
        },
        {
          path: "/my-works",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <MyWorks /> : <SignInSignUp />}
            </Suspense>
          ),
        },

        {
          path: "/clients",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Clients /> : <SignInSignUp />}
            </Suspense>
          ),
        },

        {
          path: "/attendance",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Attendance /> : <SignInSignUp />}
            </Suspense>
          ),
        },
        {
          path: "/clients-works",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <ClientWorks /> : <SignInSignUp />}
            </Suspense>
          ),
        },
        {
          path: "/my-works/work",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Work /> : <SignInSignUp />}
            </Suspense>
          ),
        },
        {
          path: "/today-works",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <TodaysWork /> : <SignInSignUp />}
            </Suspense>
          ),
        },

        {
          path: "/projects",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Projects /> : <SignInSignUp />}
            </Suspense>
          ),
        },
        {
          path: "/profile",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Profile /> : <SignInSignUp />}
            </Suspense>
          ),
        },
        {
          path: "/settings",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Settings /> : <SignInSignUp />}
            </Suspense>
          ),
        },
        {
          path: "/permissions",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? (
                user.role === configKeys.ADMIN_ROLE ? (
                  <UserPermissions />
                ) : (
                  <p className="grid place-content-center w-full h-screen">
                    Unauthorized access
                  </p>
                )
              ) : (
                <SignInSignUp />
              )}
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense
              fallback={
                <p className="h-screen text-center w-full grid place-items-center text-white">
                  Loading....
                </p>
              }
            >
              {token ? <Error /> : <SignInSignUp />}
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
