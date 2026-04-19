import ParaglideLocaleSwitcher from './LocaleSwitcher.tsx'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--hr) bg-(--background-white-color) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <ParaglideLocaleSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
