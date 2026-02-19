export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
  app: {
    head: {
      title: 'Wedding Planner',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plan your perfect wedding with our Trello-like organiser' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },
  nitro: {
    preset: 'aws-lambda',
    serveStatic: true,
  },
  compatibilityDate: '2025-01-01',
})
