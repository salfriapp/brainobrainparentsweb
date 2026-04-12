let publicKeyPromise

function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s/g, '')

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}

async function importPublicKey(fetchPublicKey) {
  if (!window.crypto?.subtle) {
    throw new Error('Login encryption is not supported by this browser.')
  }

  const publicKeyPem = await fetchPublicKey()

  return window.crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(publicKeyPem),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-1',
    },
    false,
    ['encrypt'],
  )
}

export async function encryptLoginCredentials(credentials, fetchPublicKey) {
  publicKeyPromise ||= importPublicKey(fetchPublicKey)

  const encryptedPassword = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    await publicKeyPromise,
    new TextEncoder().encode(credentials.password),
  )

  return {
    ...credentials,
    password: arrayBufferToBase64(encryptedPassword),
    password_encrypted: true,
  }
}
