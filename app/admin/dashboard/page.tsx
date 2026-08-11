import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { count: tenantCount } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })

  const { count: linkCount } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })

  const { count: clickCount } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tenantCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{linkCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cliques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clickCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
