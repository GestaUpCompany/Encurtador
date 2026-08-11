import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LinkForm } from '@/components/LinkForm'
import { Button } from '@/components/ui/Button'

export default async function NewLinkPage() {
  const supabase = await createClient()
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('active', true)
    .order('name')

  if (!tenants || tenants.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo link</h1>
        <p className="text-gray-600">
          Você precisa criar pelo menos um cliente ativo antes de criar um link.
        </p>
        <Link href="/admin/tenants/new">
          <Button>Criar cliente</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Novo link</h1>
        <Link href="/admin/links">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </div>
      <LinkForm tenants={tenants} />
    </div>
  )
}
