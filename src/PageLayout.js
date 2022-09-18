import { Outlet } from 'react-router-dom'

import Account from './components/Account'
import Hero from './components/Hero'
import Footer from './components/Footer'

function PageLayout() {
  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Account display_connect_button={false} />
        <div className="mt-10">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PageLayout
