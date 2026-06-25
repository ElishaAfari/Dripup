import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type PlaceBidBody = {
  auctionId: string
  amount: number
  measurementId?: string
}

type SizeRange = {
  chest?: [number, number]
  waist?: [number, number]
  hips?: [number, number]
}

Deno.serve((request) =>
  secureHandler<PlaceBidBody>(
    request,
    { roles: ['customer', 'admin'], rateLimit: { limit: 20, windowMs: 60_000 } },
    async (context, body) => {
      const { data: auction, error: auctionError } = await context.serviceClient
        .from('auctions')
        .select('id, current_bid, bid_count, size_range, ends_at, anti_snipe_seconds, status')
        .eq('id', body.auctionId)
        .single()

      if (auctionError || !auction) {
        return jsonResponse({ error: 'Auction not found.' }, 404)
      }

      const auctionRecord = auction as { current_bid: number; bid_count: number; size_range: SizeRange; ends_at: string; anti_snipe_seconds: number; status: string }
      if (auctionRecord.status !== 'live') {
        return jsonResponse({ error: 'Auction is not live.' }, 400)
      }

      if (body.amount <= Number(auctionRecord.current_bid)) {
        return jsonResponse({ error: 'Bid must exceed current bid.' }, 400)
      }

      let measurementQuery = context.serviceClient
        .from('measurements')
        .select('id, chest_cm, waist_cm, hips_cm')
        .eq('user_id', context.userId)
        .order('version', { ascending: false })
        .limit(1)

      if (body.measurementId) {
        measurementQuery = measurementQuery.eq('id', body.measurementId)
      }

      const { data: measurements } = await measurementQuery
      const measurement = measurements?.[0] as { chest_cm?: number; waist_cm?: number; hips_cm?: number } | undefined

      if (!measurement || !matchesRange(auctionRecord.size_range, measurement)) {
        await context.serviceClient.from('bids').insert({
          auction_id: body.auctionId,
          bidder_id: context.userId,
          amount: body.amount,
          accepted: false,
          reject_reason: 'measurement_out_of_range',
        })
        return jsonResponse({ accepted: false, reason: 'measurement_out_of_range' }, 422)
      }

      const now = Date.now()
      const endsAt = new Date(auctionRecord.ends_at).getTime()
      const shouldExtend = endsAt - now < auctionRecord.anti_snipe_seconds * 1000

      const { data: bid, error: bidError } = await context.serviceClient
        .from('bids')
        .insert({ auction_id: body.auctionId, bidder_id: context.userId, amount: body.amount, accepted: true })
        .select('id')
        .single()

      if (bidError) {
        return jsonResponse({ error: bidError.message }, 400)
      }

      await context.serviceClient
        .from('auctions')
        .update({
          current_bid: body.amount,
          bid_count: Number(auctionRecord.bid_count ?? 0) + 1,
          ends_at: shouldExtend ? new Date(now + auctionRecord.anti_snipe_seconds * 1000).toISOString() : auctionRecord.ends_at,
        })
        .eq('id', body.auctionId)

      return jsonResponse({ accepted: true, bidId: bid.id, amount: body.amount, antiSnipeExtended: shouldExtend })
    },
  )
)

function matchesRange(sizeRange: SizeRange, measurement: { chest_cm?: number; waist_cm?: number; hips_cm?: number }) {
  return (
    within(measurement.chest_cm, sizeRange.chest) &&
    within(measurement.waist_cm, sizeRange.waist) &&
    within(measurement.hips_cm, sizeRange.hips)
  )
}

function within(value: number | undefined, range: [number, number] | undefined) {
  if (!range || typeof value !== 'number') {
    return false
  }
  return value >= range[0] && value <= range[1]
}
