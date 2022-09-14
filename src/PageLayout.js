import {
  Outlet
} from "react-router-dom"

import Account from './components/Account'
import Hero from './components/Hero'

function PageLayout() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Account />
      <Hero />
      <Outlet />
    </div>
  )
}

export default PageLayout
