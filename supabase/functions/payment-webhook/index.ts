import { jsonResponse } from '../_shared/edge.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'

type WebhookPayload = {
  event?: string
  data?: {
    reference?: string
    amount?: number
    currency?: string
    status?: string
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return jsonResponse({ ok: true })
  }

  const rawBody = await request.text()
  const provider = new URL(request.url).searchParams.get('provider') ?? 'paystack'
  const signature = request.headers.get('x-paystack-signature') ?? request.headers.get('stripe-signature') ?? request.headers.get('x-momo-signature')
  const configuredSecret = provider === 'stripe' ? Deno.env.get('STRIPE_WEBHOOK_SECRET') : provider === 'mtn_momo' ? Deno.env.get('MTN_MOMO_WEBHOOK_SECRET') : Deno.env.get('PAYSTACK_WEBHOOK_SECRET')

  if (configuredSecret && !signature) {
    return jsonResponse({ error: 'Missing webhook signature.' }, 401)
  }

  const payload = JSON.parse(rawBody) as WebhookPayload
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
  const reference = payload.data?.reference

  if (reference) {
    await supabase
      .from('escrow_ledger')
      .update({ status: payload.data?.status ?? payload.event ?? 'webhook_received', metadata: { provider, webhook: payload } })
      .eq('provider_reference', reference)
  }

  return jsonResponse({ received: true, provider, reference: reference ?? null })
})
