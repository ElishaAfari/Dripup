import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type MatchVendorsBody = {
  embedding: number[]
  count?: number
  region?: string
}

Deno.serve((request) =>
  secureHandler<MatchVendorsBody>(
    request,
    { roles: ['customer', 'artisan', 'designer', 'admin'], rateLimit: { limit: 40, windowMs: 60_000 } },
    async (context, body) => {
      const vectorLiteral = `[${body.embedding.slice(0, 1536).join(',')}]`
      const { data, error } = await context.serviceClient.rpc('match_vendors_by_embedding', {
        query_embedding: vectorLiteral,
        match_count: body.count ?? 12,
      })

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      const matches = body.region
        ? (data as { location_region?: string }[]).filter((item) => item.location_region === body.region)
        : data

      return jsonResponse({ matches })
    },
  )
)
