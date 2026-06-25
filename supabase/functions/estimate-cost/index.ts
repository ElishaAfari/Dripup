import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type EstimateCostBody = {
  garmentType: string
  fabricId: string
  measurementId: string
}

Deno.serve((request) =>
  secureHandler<EstimateCostBody>(
    request,
    { roles: ['customer', 'artisan', 'designer', 'seller', 'admin'], rateLimit: { limit: 30, windowMs: 60_000 } },
    async (context, body) => {
      const { data: fabric, error: fabricError } = await context.client
        .from('fabric_catalog')
        .select('id, price_per_yard, name')
        .eq('id', body.fabricId)
        .single()
      const { data: measurement, error: measurementError } = await context.client
        .from('measurements')
        .select('id, chest_cm, waist_cm, hips_cm, height_cm')
        .eq('id', body.measurementId)
        .single()

      if (fabricError || measurementError || !fabric || !measurement) {
        return jsonResponse({ error: 'Fabric or measurement profile was not found.' }, 404)
      }

      const height = Number((measurement as { height_cm?: number }).height_cm ?? 168)
      const yardage = Math.max(2.5, Math.round((height / 100) * 3.1 * 10) / 10)
      const pricePerYard = Number((fabric as { price_per_yard?: number }).price_per_yard ?? 0)
      const trims = body.garmentType.toLowerCase().includes('gown') ? 380 : 160
      const labour = body.garmentType.toLowerCase().includes('gown') ? 1800 : 900
      const total = yardage * pricePerYard + trims + labour

      const { data, error } = await context.serviceClient
        .from('cost_estimates')
        .insert({
          user_id: context.userId,
          fabric_id: body.fabricId,
          measurement_id: body.measurementId,
          garment_type: body.garmentType,
          yardage,
          trims_amount: trims,
          labour_amount: labour,
          total_amount: total,
          breakdown: { rules: 'height-adjusted yardage plus garment labour class', llm_refinement: Deno.env.get('LLM_API_KEY') ? 'enabled' : 'mock' },
        })
        .select('id')
        .single()

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({ estimateId: data.id, yardage, trims, labour, total })
    },
  )
)
