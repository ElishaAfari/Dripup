import { nanoid } from 'nanoid'

export type RtcProvider = 'mock' | 'livekit' | 'daily' | 'mediasoup'

export type RtcSession = {
  id: string
  roomName: string
  provider: RtcProvider
  token: string
  joinedAt: string
}

export function getRtcProvider(): RtcProvider {
  const rawProvider = import.meta.env.VITE_RTC_PROVIDER
  if (rawProvider === 'livekit' || rawProvider === 'daily' || rawProvider === 'mediasoup') {
    return rawProvider
  }
  return 'mock'
}

export async function createRtcSession(roomName: string): Promise<RtcSession> {
  const provider = getRtcProvider()
  const token =
    provider === 'mock'
      ? `mock-token-${nanoid(10)}`
      : await fetchRtcToken(roomName, provider)

  return {
    id: nanoid(),
    roomName,
    provider,
    token,
    joinedAt: new Date().toISOString(),
  }
}

async function fetchRtcToken(roomName: string, provider: RtcProvider) {
  const { invokeEdgeFunction } = await import('@/lib/edgeFunctions')
  const payload = await invokeEdgeFunction<{ roomName: string; provider: RtcProvider }, { token: string }>(
    'rtc-token',
    { roomName, provider },
    { token: `mock-token-${nanoid(10)}` },
  )
  return payload.token
}
