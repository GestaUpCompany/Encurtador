import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TenantForm } from '@/components/TenantForm'

export default async function EditTenantPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: tenant } = await supabase.from('tenants').select('*').eq('id', id).single()

  if (!tenant) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar cliente</h1>
      <TenantForm tenant={tenant} />
    </div>
  )
}
