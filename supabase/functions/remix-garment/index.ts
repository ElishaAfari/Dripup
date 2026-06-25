import { jsonResponse, mockImageUrl, secureHandler } from '../_shared/edge.ts'

type RemixBody = {
  sourcePath: string
  prompt: string
}

Deno.serve((request) =>
  secureHandler<RemixBody>(
    request,
    { roles: ['customer', 'artisan', 'designer', 'admin'], rateLimit: { limit: 10, windowMs: 60_000 } },
    async (context, body) => {
      if (!body.sourcePath || !body.prompt) {
        return jsonResponse({ error: 'sourcePath and prompt are required.' }, 400)
      }

      const provider = Deno.env.get('IMAGE_TO_IMAGE_PROVIDER') ?? Deno.env.get('IMAGE_PROVIDER') ?? 'mock'
      const apiKey = Deno.env.get('IMAGE_API_KEY')
      let outputUrl = mockImageUrl('Atelier Remix')

      if (provider === 'replicate' && apiKey) {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            Authorization: `Token ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: Deno.env.get('REPLICATE_IMAGE_TO_IMAGE_VERSION'),
            input: { image: body.sourcePath, prompt: body.prompt },
          }),
        })
        const payload = await response.json() as { urls?: { get?: string } }
        outputUrl = payload.urls?.get ?? outputUrl
      }

      const { data, error } = await context.serviceClient
        .from('remixes')
        .insert({
          user_id: context.userId,
          source_path: body.sourcePath,
          output_path: outputUrl,
          prompt: body.prompt,
          sustainability_note: 'Mock estimate: retains most of the original garment material.',
          status: 'draft',
        })
        .select('id')
        .single()

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({ remixId: data.id, outputUrl, provider })
    },
  )
)
