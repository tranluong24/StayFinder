//import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Layout from './layouts/Layout'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import HomePage from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import AdminPage from './pages/Admin';



const App = () => {
  const { isLoggedIn, role } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage/>
          </Layout>
        } />

        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          } />

        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />

        <Route path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          } />

        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        } />

        {isLoggedIn && (
          <>
            {role === "user" && (
              <>
              <Route
                path="/hotel/:hotelId/booking" 
                element={
                  <Layout>
                    <Booking />
                  </Layout>
                } />
              <Route
                path="/my-bookings"
                element={
                  <Layout>
                    <MyBookings />
                  </Layout>
                }/>
              </>
            )}

            {role === "host" && (
              <>
              {/* <Route
                path="/hotel/:hotelId/booking" 
                element={
                  <Layout>
                    <Booking />
                  </Layout>
                } /> */}
            
              <Route
                path="/add-hotel" element={
                  <Layout>
                    <AddHotel />
                  </Layout>
                } />
            
              <Route
                path="/my-hotels" element={
                  <Layout>
                    <MyHotels />
                  </Layout>
                } />
              <Route
                path="/edit-hotel/:hotelId"
                element={
                  <Layout>
                    <EditHotel />
                  </Layout>
                }
              />
              {/* <Route
                path="/my-bookings"
                element={
                  <Layout>
                    <MyBookings />
                  </Layout>
                }/> */}
              </>
            )}
            {(role === 'admin' || role === "guest") && (   
              <>           
                <Route path="/admin" element={
                  <AdminPage/>
                } />
              </>
            )}
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
