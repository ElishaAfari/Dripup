import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type CaptureBody = {
  orderId?: string
  guildOrderId?: string
  amount: number
  provider: 'paystack' | 'mtn_momo' | 'stripe'
  currency?: string
}

Deno.serve((request) =>
  secureHandler<CaptureBody>(
    request,
    { roles: ['customer', 'admin'], rateLimit: { limit: 15, windowMs: 60_000 } },
    async (context, body) => {
      const providerReference = `mock_capture_${crypto.randomUUID()}`
      const providerKeyName = body.provider === 'paystack' ? 'PAYSTACK_SECRET_KEY' : body.provider === 'mtn_momo' ? 'MTN_MOMO_API_KEY' : 'STRIPE_SECRET_KEY'
      const providerConfigured = Boolean(Deno.env.get(providerKeyName))

      const { data, error } = await context.serviceClient
        .from('escrow_ledger')
        .insert({
          order_id: body.orderId ?? null,
          guild_order_id: body.guildOrderId ?? null,
          profile_id: context.userId,
          provider: body.provider,
          provider_reference: providerReference,
          entry_type: 'capture',
          amount: body.amount,
          currency: body.currency ?? 'GHS',
          status: providerConfigured ? 'captured' : 'mock_captured',
          metadata: { regulatory_note: 'Real escrow must be operated through a licensed payment or escrow partner.' },
        })
        .select('id')
        .single()

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({ ledgerId: data.id, providerReference, providerConfigured })
    },
  )
)
