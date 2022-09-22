import { Outlet } from 'react-router-dom'

import Account from './components/Account'
import Hero from './components/Hero'
import Footer from './components/Footer'

import { SimpleLayout } from './theme/SimpleLayout'

function PageLayout() {
  return (
    <SimpleLayout className="dark">
      <Account display_connect_button={false} />
      <div className="mt-10">
        <Outlet />
      </div>
      <Footer />
    </SimpleLayout>
  )
}

export default PageLayout
