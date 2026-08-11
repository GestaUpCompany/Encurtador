import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, slug, name')

  const tenantMap = new Map(tenants?.map((t) => [t.id, t]) ?? [])

  const { data: links } = await supabase
    .from('links')
    .select('id, slug, title, tenant_id')
    .order('created_at', { ascending: false })

  const linkIds = links?.map((l) => l.id) ?? []

  const { data: clicks } = await supabase
    .from('clicks')
    .select('link_id, clicked_at')
    .in(
      'link_id',
      linkIds.length > 0 ? linkIds : ['00000000-0000-0000-0000-000000000000']
    )

  const totals = new Map<string, number>()
  clicks?.forEach((c) => {
    totals.set(c.link_id, (totals.get(c.link_id) ?? 0) + 1)
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cliques por link</CardTitle>
        </CardHeader>
        <CardContent>
          {links && links.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Título</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">URL curta</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Cliques</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {links.map((link) => {
                    const tenant = tenantMap.get(link.tenant_id)
                    return (
                      <tr key={link.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {link.title || link.slug}
                        </td>
                        <td className="px-4 py-3 text-sm text-primary">
                          {tenant ? `/go/${tenant.slug}/${link.slug}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          {totals.get(link.id) ?? 0}
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
