import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteTenant } from '@/app/actions/tenants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default async function TenantsPage() {
  const supabase = await createClient()
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-600">Erro ao carregar clientes: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Link href="/admin/tenants/new">
          <Button>Novo cliente</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {tenants && tenants.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Slug</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{tenant.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tenant.slug}</td>
                    <td className="px-4 py-3 text-sm">
                      {tenant.active ? (
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
                      <Link href={`/admin/tenants/${tenant.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <form action={deleteTenant.bind(null, tenant.id)} className="ml-2 inline">
                        <Button variant="danger" size="sm" type="submit">
                          Excluir
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-600">Nenhum cliente cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
