import discord_logo_svg from '../images/discord.svg'

function Footer() {
  return (
    <footer className="w-full text-center mt-32 border-zinc-100 pt-10 pb-16 border-t dark:border-zinc-700/40">
      <p className="text-base text-zinc-600 dark:text-zinc-400">
        Coming soon - Own your content, migrate your posts from Medium + other
        platforms
      </p>
      <div className="mt-8 flex justify-center">
        <a href="https://discord.gg/rBmyfNAP" target="_blank"><img src={discord_logo_svg} className="w-10" /></a>
      </div>
    </footer>
  )
}

export default Footer
