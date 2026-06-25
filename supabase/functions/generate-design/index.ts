import { jsonResponse, mockImageUrl, secureHandler } from '../_shared/edge.ts'

type GenerateDesignBody = {
  prompt: string
  moodboardId?: string
}

Deno.serve((request) =>
  secureHandler<GenerateDesignBody>(
    request,
    { roles: ['customer', 'artisan', 'designer', 'admin'], rateLimit: { limit: 12, windowMs: 60_000 } },
    async (context, body) => {
      if (!body.prompt || body.prompt.trim().length < 8) {
        return jsonResponse({ error: 'Prompt must be at least 8 characters.' }, 400)
      }

      const provider = Deno.env.get('IMAGE_PROVIDER') ?? 'mock'
      const apiKey = Deno.env.get('IMAGE_API_KEY')
      let imageUrl = mockImageUrl('Atelier Dream-to-Draft')

      if (provider === 'openai' && apiKey) {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: Deno.env.get('IMAGE_MODEL') ?? 'gpt-image-1',
            prompt: body.prompt,
            size: '1024x1536',
          }),
        })
        const payload = await response.json() as { data?: { url?: string }[] }
        imageUrl = payload.data?.[0]?.url ?? imageUrl
      }

      const { data, error } = await context.serviceClient
        .from('designs')
        .insert({
          user_id: context.userId,
          prompt: body.prompt,
          image_path: imageUrl,
          provider,
          status: 'draft',
          metadata: { moodboardId: body.moodboardId ?? null },
        })
        .select('id')
        .single()

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({ designId: data.id, imageUrl, provider })
    },
  )
)
