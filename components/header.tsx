import Link from 'next/link'

import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconNextChat
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import React from 'react'


export async function Header() {
  const session = await auth()
  
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-20 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
  
      <div className="flex items-center">
      <img src="/logo.png" alt="Wingbot" className="w-full h-auto rounded-md mb-2 max-w-[40%]">
      </img>
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
             <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
            <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" />
          </Link>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex items-center">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button
              variant="secondary"
              asChild
              className="group -ml-2 border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 hover:shadow-outline"
            >
              <Link href="/sign-in?callbackUrl=/" className="text-lg px-4 py-2 inline-block">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
