import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { First } from './modules/form/pages/First'
import { Layout } from './components/Layout/Layout';
import { Login } from './modules/auth/pages/Login';
import PrivateRoute from './utils/PrivateRoutes';


function App() {


  return (
    <Router>
      

      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='/' element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          
          <Route path='first' element={<First />} />
        </Route>

      </Routes>



    </Router>

  )
}

export default App
