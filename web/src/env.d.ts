/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    /** Internal (server-side) CMS URL, e.g. http://localhost:4101 */
    readonly PAYLOAD_URL?: string
    /** Payload API key used to fetch draft posts for preview */
    readonly PAYLOAD_API_KEY?: string
    /** Shared secret validating /api/preview requests from the CMS */
    readonly PREVIEW_SECRET?: string
    /** Public CMS origin exposed to the browser (empty string = same-origin proxy mode) */
    readonly PUBLIC_PAYLOAD_URL?: string
    /** Google Analytics measurement ID */
    readonly PUBLIC_GTAG_ID?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv & ImportMetaEnv
}
