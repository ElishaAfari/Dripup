import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'

export type AppRole = 'customer' | 'artisan' | 'designer' | 'mua' | 'seller' | 'admin'

export type UserContext = {
  userId: string
  roles: AppRole[]
  token: string
  client: ReturnType<typeof createClient>
  serviceClient: ReturnType<typeof createClient>
}

export type JsonRecord = Record<string, unknown>

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature, stripe-signature, x-momo-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const buckets = new Map<string, { count: number; resetAt: number }>()

export function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export function requireEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export async function secureHandler<TBody extends JsonRecord>(
  request: Request,
  options: { roles?: AppRole[]; rateLimit?: { limit: number; windowMs: number } },
  handler: (context: UserContext, body: TBody) => Promise<Response>,
) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const authorization = request.headers.get('Authorization')
    const token = authorization?.replace('Bearer ', '')
    if (!token) {
      return jsonResponse({ error: 'Missing bearer token' }, 401)
    }

    const supabaseUrl = requireEnv('SUPABASE_URL')
    const anonKey = requireEnv('SUPABASE_ANON_KEY')
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

    const client = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    })
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: userData, error: userError } = await client.auth.getUser(token)

    if (userError || !userData.user) {
      return jsonResponse({ error: 'Invalid JWT' }, 401)
    }

    const rate = options.rateLimit ?? { limit: 30, windowMs: 60_000 }
    const rateKey = `${userData.user.id}:${new URL(request.url).pathname}`
    if (!consumeRateLimit(rateKey, rate.limit, rate.windowMs)) {
      return jsonResponse({ error: 'Rate limit exceeded' }, 429)
    }

    const { data: profile } = await client
      .from('profiles')
      .select('roles')
      .eq('id', userData.user.id)
      .single()

    const roles = parseRoles(profile)
    if (options.roles?.length && !options.roles.some((role) => roles.includes(role))) {
      return jsonResponse({ error: 'Role not permitted for this function' }, 403)
    }

    const body = (await request.json()) as TBody
    return await handler(
      {
        userId: userData.user.id,
        roles,
        token,
        client,
        serviceClient,
      },
      body,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse({ error: message }, 500)
  }
}

function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= limit) {
    return false
  }

  bucket.count += 1
  return true
}

function parseRoles(profile: unknown): AppRole[] {
  const roleValues: AppRole[] = ['customer', 'artisan', 'designer', 'mua', 'seller', 'admin']
  if (!profile || typeof profile !== 'object' || !('roles' in profile)) {
    return ['customer']
  }
  const roles = (profile as { roles?: unknown }).roles
  if (!Array.isArray(roles)) {
    return ['customer']
  }
  const parsed = roles.filter((role): role is AppRole => roleValues.includes(role as AppRole))
  return parsed.length ? parsed : ['customer']
}

export function mockImageUrl(label: string) {
  return `https://dummyimage.com/1200x1500/171512/d99a26.png&text=${encodeURIComponent(label)}`
}
