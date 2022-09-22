import { Container } from './Container'

export function SimpleLayout({ title, intro, children }) {
  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <Container>
        <div className="relative mt-16 sm:mt-20">{children}</div>
      </Container>
    </>
  )
}
