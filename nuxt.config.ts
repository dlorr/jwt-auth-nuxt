export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@pinia/nuxt"],

  css: ["~/assets/scss/main.scss"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:8005",
    },
  },

  devServer: {
    port: parseInt(process.env.NUXT_PORT ?? "3005"),
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  app: {
    head: {
      title: "jwt-auth-nuxt",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap",
        },
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/_variables.scss" as *;
            @use "~/assets/scss/_mixins.scss" as *;
          `,
        },
      },
    },
  },
  compatibilityDate: "2026-04-29",
});
