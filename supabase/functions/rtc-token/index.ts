import { SignJWT } from 'https://esm.sh/jose@5.9.6'
import { jsonResponse, secureHandler } from '../_shared/edge.ts'

type RtcTokenBody = {
  roomName: string
  provider: 'mock' | 'livekit' | 'daily' | 'mediasoup'
}

Deno.serve((request) =>
  secureHandler<RtcTokenBody>(
    request,
    { roles: ['customer', 'artisan', 'designer', 'mua', 'seller', 'admin'], rateLimit: { limit: 60, windowMs: 60_000 } },
    async (context, body) => {
      if (!body.roomName) {
        return jsonResponse({ error: 'roomName is required.' }, 400)
      }

      if (body.provider === 'livekit') {
        const apiKey = Deno.env.get('LIVEKIT_API_KEY')
        const apiSecret = Deno.env.get('LIVEKIT_API_SECRET')
        if (!apiKey || !apiSecret) {
          return jsonResponse({ error: 'LIVEKIT_API_KEY and LIVEKIT_API_SECRET are required.' }, 500)
        }

        const secret = new TextEncoder().encode(apiSecret)
        const token = await new SignJWT({
          video: {
            roomJoin: true,
            room: body.roomName,
            canPublish: true,
            canSubscribe: true,
          },
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuer(apiKey)
          .setSubject(context.userId)
          .setExpirationTime('2h')
          .sign(secret)

        return jsonResponse({ token, provider: 'livekit', roomName: body.roomName })
      }

      if (body.provider === 'daily') {
        const apiKey = Deno.env.get('DAILY_API_KEY')
        if (!apiKey) {
          return jsonResponse({ error: 'DAILY_API_KEY is required.' }, 500)
        }

        const response = await fetch('https://api.daily.co/v1/meeting-tokens', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              room_name: body.roomName,
              user_id: context.userId,
              is_owner: context.roles.includes('admin'),
              exp: Math.floor(Date.now() / 1000) + 7200,
            },
          }),
        })

        if (!response.ok) {
          return jsonResponse({ error: 'Daily token request failed.' }, 502)
        }

        const payload = await response.json() as { token: string }
        return jsonResponse({ token: payload.token, provider: 'daily', roomName: body.roomName })
      }

      if (body.provider === 'mediasoup') {
        const secret = Deno.env.get('MEDIASOUP_SIGNALING_SECRET')
        if (!secret) {
          return jsonResponse({ error: 'MEDIASOUP_SIGNALING_SECRET is required.' }, 500)
        }
        const token = btoa(JSON.stringify({ roomName: body.roomName, userId: context.userId, exp: Date.now() + 7_200_000 }))
        return jsonResponse({ token, provider: 'mediasoup', roomName: body.roomName })
      }

      return jsonResponse({ token: `mock-rtc-${crypto.randomUUID()}`, provider: 'mock', roomName: body.roomName })
    },
  )
)
