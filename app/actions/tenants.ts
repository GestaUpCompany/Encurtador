'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createTenant(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const slug = (formData.get('slug') as string).toLowerCase().trim()
  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string).trim()
  const active = formData.get('active') === 'on'

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug deve conter apenas letras minúsculas, números e hífens.' }
  }

  const { error } = await supabase.from('tenants').insert({
    slug,
    name,
    description,
    active,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/tenants')
  redirect('/admin/tenants')
}

export async function updateTenant(
  id: string,
  _prevState: unknown,
  formData: FormData
) {
  const supabase = await createClient()
  const slug = (formData.get('slug') as string).toLowerCase().trim()
  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string).trim()
  const active = formData.get('active') === 'on'

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug deve conter apenas letras minúsculas, números e hífens.' }
  }

  const { error } = await supabase
    .from('tenants')
    .update({ slug, name, description, active })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/tenants')
  redirect('/admin/tenants')
}

export async function deleteTenant(id: string) {
  const supabase = await createClient()
  await supabase.from('tenants').delete().eq('id', id)

  revalidatePath('/admin/tenants')
  revalidatePath('/admin/links')
}
