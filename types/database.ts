export type Profile = {
  id: string
  email: string
  role: string
  created_at: string
}

export type Tenant = {
  id: string
  slug: string
  name: string
  description: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export type Link = {
  id: string
  tenant_id: string
  slug: string
  title: string | null
  destination_url: string
  active: boolean
  created_at: string
  updated_at: string
}

export type Click = {
  id: string
  link_id: string
  clicked_at: string
  ip_hash: string | null
  user_agent: string | null
  referer: string | null
  country: string | null
  city: string | null
}
