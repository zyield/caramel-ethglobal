import mainLogoWhite from '../images/logo_white.svg'

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="flex justify-center">
          <img width="250" src={mainLogoWhite} alt="Caramel" />
        </h2>
        <p className="max-w-xl mt-10 mx-auto text-lg text-zinc-600 dark:text-zinc-400">
          Launch a decentralized, censorship-resistant blog on your .Eth domain
        </p>

        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-8">
          Don’t have a .Eth domain yet? Get it{' '}
          <a
            className="font-medium text-teal-500"
            href="https://app.ens.domains/"
            target="_blank"
          >
            here
          </a>
          !
        </p>
      </div>
    </div>
  )
}
