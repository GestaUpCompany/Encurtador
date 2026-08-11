'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createLink(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const tenant_id = formData.get('tenant_id') as string
  const slug = (formData.get('slug') as string).toLowerCase().trim()
  const title = (formData.get('title') as string).trim()
  const destination_url = (formData.get('destination_url') as string).trim()
  const active = formData.get('active') === 'on'

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug deve conter apenas letras minúsculas, números e hífens.' }
  }

  if (!URL.canParse(destination_url)) {
    return { error: 'URL de destino inválida.' }
  }

  const { error } = await supabase.from('links').insert({
    tenant_id,
    slug,
    title,
    destination_url,
    active,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/links')
  redirect('/admin/links')
}

export async function updateLink(
  id: string,
  _prevState: unknown,
  formData: FormData
) {
  const supabase = await createClient()
  const tenant_id = formData.get('tenant_id') as string
  const slug = (formData.get('slug') as string).toLowerCase().trim()
  const title = (formData.get('title') as string).trim()
  const destination_url = (formData.get('destination_url') as string).trim()
  const active = formData.get('active') === 'on'

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug deve conter apenas letras minúsculas, números e hífens.' }
  }

  if (!URL.canParse(destination_url)) {
    return { error: 'URL de destino inválida.' }
  }

  const { error } = await supabase
    .from('links')
    .update({ tenant_id, slug, title, destination_url, active })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/links')
  redirect('/admin/links')
}

export async function deleteLink(id: string) {
  const supabase = await createClient()
  await supabase.from('links').delete().eq('id', id)

  revalidatePath('/admin/links')
}
