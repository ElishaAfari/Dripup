import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type ReleaseBody = {
  milestoneId: string
  provider: 'paystack' | 'mtn_momo' | 'stripe'
}

Deno.serve((request) =>
  secureHandler<ReleaseBody>(
    request,
    { roles: ['customer', 'artisan', 'designer', 'mua', 'seller', 'admin'], rateLimit: { limit: 15, windowMs: 60_000 } },
    async (context, body) => {
      const { data: milestone, error: milestoneError } = await context.serviceClient
        .from('milestones')
        .select('id, amount, status, order_id, guild_order_id, client_approved_at, artisan_approved_at')
        .eq('id', body.milestoneId)
        .single()

      if (milestoneError || !milestone) {
        return jsonResponse({ error: 'Milestone not found.' }, 404)
      }

      const milestoneRecord = milestone as { amount: number; status: string; order_id?: string; guild_order_id?: string; client_approved_at?: string; artisan_approved_at?: string }
      if (!milestoneRecord.client_approved_at || !milestoneRecord.artisan_approved_at) {
        return jsonResponse({ error: 'Dual approval required before release.' }, 409)
      }

      const releaseReference = `mock_release_${crypto.randomUUID()}`
      await context.serviceClient.from('escrow_ledger').insert({
        order_id: milestoneRecord.order_id ?? null,
        guild_order_id: milestoneRecord.guild_order_id ?? null,
        milestone_id: body.milestoneId,
        provider: body.provider,
        provider_reference: releaseReference,
        entry_type: 'release',
        amount: milestoneRecord.amount,
        status: 'released',
        metadata: { regulatory_note: 'Real escrow release must be performed by a licensed partner.' },
      })

      await context.serviceClient
        .from('milestones')
        .update({ status: 'released', release_reference: releaseReference })
        .eq('id', body.milestoneId)

      return jsonResponse({ milestoneId: body.milestoneId, releaseReference })
    },
  )
)
