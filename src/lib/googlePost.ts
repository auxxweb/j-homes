export interface GooglePostResult {
  ok: boolean
  error?: string
  docUrl?: string
  mailed?: boolean
  mailError?: string
}

export function postGoogle(endpoint: string, payload: unknown): Promise<GooglePostResult> {
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000),
  }).then(async (response) => {
    const text = await response.text()
    try {
      const data = JSON.parse(text) as GooglePostResult
      if (typeof data.ok !== 'boolean') return { ok: false, error: 'The submission was not accepted.' }
      return data
    } catch {
      return { ok: false, error: 'The submission was not accepted.' }
    }
  })
}
