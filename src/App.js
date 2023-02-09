import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
// import Login from './components/login.component'
import MultiDashboard from './components/multidashboard'
import Home from './components/home'
import Search from './components/search'
// import User from './components/user'
// import image from './assets/logo.svg';


function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/home'}>
              <div> Paylocity Workshop </div >
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul class="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/home'}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/search'}>
                    Search
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/dashboard'}>
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            {/* <div className="collapse navbar-collapse justify-content-end">
              <ul className="navbar-nav ml-auto ">
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </nav>
        <div className="component">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/search" element={<Search />} />
            <Route path="/dashboard" element={<MultiDashboard />}></Route>
          </Routes>
        </div>
      </div>
    </Router>


  )
}
export default App