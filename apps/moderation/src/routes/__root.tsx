import Header from '#/components/Header'
import Sidebar from '#/components/Sidebar'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { queryClient } from '@repo/shared/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useSession } from '#/lib/auth-client'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
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
        title: 'Moderation Panel',
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
  const { data: session } = useSession()

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body className="bg-base text-primary wrap-anywhere flex h-screen flex-col overflow-hidden font-sans antialiased selection:bg-[rgba(108,140,255,0.24)]">
          {session ? (
            <>
              <Header />
              <div className="flex min-h-0 flex-1">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">{children}</main>
              </div>
            </>
          ) : (
            children
          )}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  )
}
