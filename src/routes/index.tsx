import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          Welcome
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8">
          Your UNICEF app is ready to build.
        </p>
      </section>
    </main>
  )
}
