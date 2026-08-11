import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fdddavqsubtbkzrpzyhh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const email = 'relatorios@gestaup.com'
const password = 'Relatorios170983!@#'

async function main() {
  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (findError) {
    console.error('Erro ao buscar usuário:', findError)
    process.exit(1)
  }

  if (existing) {
    console.log('Usuário já existe.')
    return
  }

  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    console.error('Erro ao criar usuário:', createError)
    process.exit(1)
  }

  const { error: insertError } = await supabase
    .from('profiles')
    .insert({ id: userData.user.id, email, role: 'admin' })

  if (insertError) {
    console.error('Erro ao inserir profile:', insertError)
    process.exit(1)
  }

  console.log('Usuário admin criado:', userData.user.id)
}

main()
