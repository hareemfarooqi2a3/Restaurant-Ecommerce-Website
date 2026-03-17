import { createClient, type SanityClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo-project";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-01-01";

export function getClient(preview?: { token: string }): SanityClient {
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'published',
  stega: {
     enabled: false,
     studioUrl: '/studio',
  },
});
if (preview) {
  if (!preview.token) {
    throw new Error('Missing preview token')
  }
  return client.withConfig({
    token: preview.token,
    useCdn: false,
    ignoreBrowserTokenWarning: true,
    perspective: 'previewDrafts',
  })
}
return client
}

// Export the default client instance configured for writes
export const client: SanityClient = getClient();

// You could potentially export a separate read client if needed
// export const readClient = createClient({ ...config with useCdn: true, no token ... });



// NOTE:
// Do not run Sanity migrations/patches at module import time.
// If you need a slug backfill, turn it into an explicit script/command instead.