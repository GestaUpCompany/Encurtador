'use client'

import { useActionState } from 'react'
import { createLink, updateLink } from '@/app/actions/links'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function LinkForm({
  tenants,
  link,
}: {
  tenants: { id: string; name: string }[]
  link?: {
    id: string
    tenant_id: string
    slug: string
    title: string | null
    destination_url: string
    active: boolean
  }
}) {
  const action = link ? updateLink.bind(null, link.id) : createLink
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do link</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <select
              id="tenant_id"
              name="tenant_id"
              defaultValue={link?.tenant_id ?? tenants[0].id}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
            >
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={link?.title ?? ''}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug curto
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              defaultValue={link?.slug ?? ''}
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Apenas letras minúsculas, números e hífens"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-500">Ex.: relatorio-mensal</p>
          </div>
          <div>
            <label htmlFor="destination_url" className="block text-sm font-medium text-gray-700">
              URL de destino (link público do Power BI/Fabric)
            </label>
            <input
              id="destination_url"
              name="destination_url"
              type="url"
              defaultValue={link?.destination_url ?? ''}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
            />
            {link && (
              <p className="mt-1 text-xs text-gray-500">
                Altere este campo quando o link do Power BI/Fabric mudar. O slug curto permanece o mesmo.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              id="active"
              name="active"
              type="checkbox"
              defaultChecked={link?.active ?? true}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Ativo
            </label>
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Salvando...' : 'Salvar'}
            </Button>
            <Link href="/admin/links">
              <Button variant="secondary" type="button">
                Voltar
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
