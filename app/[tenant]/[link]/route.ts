import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const RESERVED_PATHS = ['admin', 'login', 'api', '_next']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string; link: string }> }
) {
  const { tenant: tenantSlug, link: linkSlug } = await params

  // Let static routes like /admin/* and /login match before this dynamic route.
  if (RESERVED_PATHS.includes(tenantSlug)) {
    return NextResponse.next()
  }

  const supabase = createServiceClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, active')
    .eq('slug', tenantSlug)
    .single()

  if (!tenant || !tenant.active) {
    return NextResponse.json(
      { error: 'Link não encontrado ou inativo.' },
      { status: 404 }
    )
  }

  const { data: link } = await supabase
    .from('links')
    .select('id, destination_url, active')
    .eq('tenant_id', tenant.id)
    .eq('slug', linkSlug)
    .single()

  if (!link || !link.active) {
    return NextResponse.json(
      { error: 'Link não encontrado ou inativo.' },
      { status: 404 }
    )
  }

  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

  const userAgent = request.headers.get('user-agent') ?? ''
  const referer = request.headers.get('referer') ?? ''

  // Fire-and-forget click registration to avoid blocking the redirect.
  void (async () => {
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
  })()

  return NextResponse.redirect(link.destination_url, { status: 307 })
}
