import mainLogoBlack from '../images/logo_black.svg'

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="flex justify-center">
            <img width="250" src={mainLogoBlack} alt="Caramel" />
          </h2>
          <p className="max-w-xl mt-10 mx-auto text-lg text-gray-500">
            Launch a decentralized, censorship-resistant blog on your .Eth
            domain
          </p>

          <p className="mt-8 text-gray-500">
            Don’t have a .Eth domain yet? Get it{' '}
            <a
              className="text-indigo-500 hover:text-indigo-600 underline"
              href="https://app.ens.domains/"
              target="_blank"
            >
              here
            </a>
            !
          </p>
        </div>
      </div>
    </div>
  )
}
