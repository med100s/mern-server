import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


function Home() {
  return (
    <div>
      <h1>Home route</h1>
    </div>
  );
}

let Login = () =>{ 
  <div>
    Hello Login!
  </div>
}
let ProtectedRoute = () =>{ 
  <div>
    Hello ProtectedRoute!
  </div>
}
let User = () =>{ 
  <div>
    Hello User!
  </div>
}

function App() {
  return (
    <Router>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login/*" element={<Login />} />
            <Route path="ProtectedRoute/*" element={<ProtectedRoute />} />
            <Route path="User/*" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
