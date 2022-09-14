import './App.css'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import PageLayout from './PageLayout'
import Home from './Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
