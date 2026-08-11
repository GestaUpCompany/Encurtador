import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'
import { headers } from 'next/headers'
import { RedirectLoading } from '@/components/RedirectLoading'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ tenant: string; link: string }>
}) {
  const { tenant: tenantSlug, link: linkSlug } = await params

  const supabase = createServiceClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, active')
    .eq('slug', tenantSlug)
    .single()

  if (!tenant || !tenant.active) {
    notFound()
  }

  const { data: link } = await supabase
    .from('links')
    .select('id, destination_url, active')
    .eq('tenant_id', tenant.id)
    .eq('slug', linkSlug)
    .single()

  if (!link || !link.active) {
    notFound()
  }

  // Record the click
  const headerList = await headers()
  const forwardedFor = headerList.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex')
  const userAgent = headerList.get('user-agent') ?? ''
  const referer = headerList.get('referer') ?? ''

  try {
    await supabase.from('clicks').insert({
      link_id: link.id,
      ip_hash: ipHash,
      user_agent: userAgent,
      referer: referer,
    })
  } catch {
    // Ignore analytics errors so the redirect always works.
  }

  return <RedirectLoading destinationUrl={link.destination_url} />
}
