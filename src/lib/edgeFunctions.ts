import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export type EdgeFunctionName =
  | 'generate-design'
  | 'remix-garment'
  | 'estimate-cost'
  | 'estimate-measurements-cleanup'
  | 'place-bid'
  | 'escrow-capture'
  | 'escrow-release'
  | 'payment-webhook'
  | 'embed-content'
  | 'match-vendors'
  | 'rtc-token'

export async function invokeEdgeFunction<TRequest extends Record<string, unknown>, TResponse>(
  name: EdgeFunctionName,
  payload: TRequest,
  mockResponse: TResponse,
): Promise<TResponse> {
  if (!isSupabaseConfigured()) {
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    return mockResponse
  }

  const { data, error } = await supabase.functions.invoke<TResponse>(name, {
    body: payload,
  })

  if (error) {
    throw error
  }

  return data ?? mockResponse
}
