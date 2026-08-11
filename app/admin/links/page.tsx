import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteLink } from '@/app/actions/links'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default async function LinksPage() {
  const supabase = await createClient()

  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, slug, name')

  if (linksError) {
    return <div className="text-red-600">Erro ao carregar links: {linksError.message}</div>
  }

  const tenantMap = new Map(tenants?.map((t) => [t.id, t]) ?? [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Links</h1>
        <Link href="/admin/links/new">
          <Button>Novo link</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os links</CardTitle>
        </CardHeader>
        <CardContent>
          {links && links.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Título</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">URL curta</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Cliente</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {links.map((link) => {
                    const tenant = tenantMap.get(link.tenant_id)
                    const shortUrl = tenant ? `/go/${tenant.slug}/${link.slug}` : ''
                    return (
                      <tr key={link.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{link.title || link.slug}</td>
                        <td className="px-4 py-3 text-sm text-primary">
                          {tenant ? (
                            <Link href={shortUrl} target="_blank">
                              {shortUrl}
                            </Link>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {tenant?.name ?? 'Cliente removido'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {link.active ? (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              Ativo
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                              Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <Link href={`/admin/links/${link.id}/edit`}>
                            <Button variant="secondary" size="sm">
                              Editar
                            </Button>
                          </Link>
                          <form action={deleteLink.bind(null, link.id)} className="ml-2 inline">
                            <Button variant="danger" size="sm" type="submit">
                              Excluir
                            </Button>
                          </form>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Nenhum link cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
