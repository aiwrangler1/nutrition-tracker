'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Meals', href: '/meals', icon: ChartBarIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-indigo-600">MacroTracker</span>
            </div>
          </div>
          <div className="flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'inline-flex items-center px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-1" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
