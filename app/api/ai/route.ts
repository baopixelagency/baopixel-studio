import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt, system } = body

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: system || 'Tu es un assistant expert en marketing digital et réseaux sociaux, spécialisé pour les agences africaines. Réponds en français.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ text: data.content[0]?.text || '' })
  } catch (err) {
    console.error('AI route error:', err)
    return NextResponse.json({ error: 'Erreur IA' }, { status: 500 })
  }
}
