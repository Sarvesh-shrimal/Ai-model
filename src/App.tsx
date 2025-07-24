import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { First } from './pages/First'

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element= {<First/>} />
      </Routes>
      
    </Router>
    
  )
}

export default App
