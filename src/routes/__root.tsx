import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from '#/components/ui/sonner'
import DemoBanner from '#/components/DemoBanner'
import DemoProvider from '#/components/DemoProvider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { getLocale } from '#/paraglide/runtime'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`


function RootErrorComponent({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
  return (
    <html lang="en">
      <head><meta charSet="utf-8" /><title>Error — HealthShield</title></head>
      <body style={{ fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, background: '#f6f8f9' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '2rem' }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem' }}>⚠️</p>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#023047', margin: '0 0 .5rem' }}>Quelque chose s&apos;est mal passé</h1>
          <p style={{ color: '#6b7280', fontSize: '.9rem', margin: '0 0 1.5rem' }}>{message}</p>
          <button
            onClick={() => window.location.href = '/admin/dashboard'}
            style={{ background: 'linear-gradient(135deg,#023047 0%,#206ebb 100%)', color: '#fff', border: 'none', borderRadius: '.75rem', padding: '.75rem 1.5rem', cursor: 'pointer', fontSize: '.875rem', fontWeight: 600 }}
          >
            Retour au tableau de bord
          </button>
        </div>
      </body>
    </html>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  errorComponent: RootErrorComponent,
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Health Surveillance Madagascar',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <DemoBanner />
        <DemoProvider>{children}</DemoProvider>
        <Toaster richColors position="top-right" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
