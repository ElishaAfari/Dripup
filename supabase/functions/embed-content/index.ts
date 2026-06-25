import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type EmbedBody = {
  ownerTable: string
  ownerId: string
  content: string
}

Deno.serve((request) =>
  secureHandler<EmbedBody>(
    request,
    { roles: ['customer', 'artisan', 'designer', 'mua', 'seller', 'admin'], rateLimit: { limit: 60, windowMs: 60_000 } },
    async (context, body) => {
      const embeddingApiKey = Deno.env.get('EMBEDDINGS_API_KEY') ?? Deno.env.get('OPENAI_API_KEY')
      let embedding = Array.from({ length: 1536 }, (_, index) => (index % 17) / 17)

      if (embeddingApiKey) {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${embeddingApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: Deno.env.get('EMBEDDINGS_MODEL') ?? 'text-embedding-3-small',
            input: body.content,
          }),
        })
        const payload = await response.json() as { data?: { embedding?: number[] }[] }
        embedding = payload.data?.[0]?.embedding ?? embedding
      }

      const { data, error } = await context.serviceClient
        .from('embeddings')
        .insert({
          owner_table: body.ownerTable,
          owner_id: body.ownerId,
          content: body.content,
          embedding,
          metadata: { provider: embeddingApiKey ? 'openai-compatible' : 'mock' },
        })
        .select('id')
        .single()

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({ embeddingId: data.id, dimensions: embedding.length })
    },
  )
)
