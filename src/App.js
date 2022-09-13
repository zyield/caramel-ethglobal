import './App.css'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Ens from './Ens'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ens />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
