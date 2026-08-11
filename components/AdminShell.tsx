'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { LayoutDashboard, Building2, Link2, BarChart3, LogOut } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/admin/tenants', icon: Building2 },
  { name: 'Links', href: '/admin/links', icon: Link2 },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-full bg-gray-50">
      <div className="flex min-h-full">
        <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <span className="text-xl font-bold text-indigo-600">GestaUp</span>
          </div>
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-0 w-64 border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="truncate text-sm text-gray-600">{userEmail}</span>
              <form action={logout}>
                <button type="submit" className="text-gray-500 hover:text-gray-700">
                  <LogOut className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
