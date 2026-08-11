import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LinkForm } from '@/components/LinkForm'
import { Button } from '@/components/ui/Button'

export default async function EditLinkPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: link } = await supabase.from('links').select('*').eq('id', id).single()
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('active', true)
    .order('name')

  if (!link || !tenants) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar link</h1>
        <Link href="/admin/links">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </div>
      <LinkForm tenants={tenants} link={link} />
    </div>
  )
}
