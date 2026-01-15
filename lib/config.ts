/**
 * <ai_context>
 * Centralized environment variable configuration.
 * All environment variables should be accessed through this module.
 * </ai_context>
 */

/**
 * Server-side environment variables (never exposed to client)
 */
interface ServerConfig {
    postgres: {
        url: string
    }
    clerk: {
        secretKey: string
    }
    stripe: {
        secretKey: string
        webhookSecret: string
    }
}

/**
 * Public environment variables (safe to expose to client)
 */
interface PublicEnv {
    clerk: {
        publishableKey: string
        signInUrl: string
        signUpUrl: string
    }
    stripe: {
        publishableKey: string
    }
    posthog: {
        key: string
        host: string
    }
}

export const serverConfig: ServerConfig = {
    postgres: {
        url: process.env.POSTGRES_URL ?? ""
    },
    clerk: {
        secretKey: process.env.CLERK_SECRET_KEY ?? ""
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY ?? "",
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? ""
    }
}

export const publicEnv: PublicEnv = {
    clerk: {
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
        signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in",
        signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"
    },
    stripe: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    },
    posthog: {
        key: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? ""
    }
}
