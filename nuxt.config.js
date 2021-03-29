export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'notes_app',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' }
		],
		link: [ { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' } ]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [ 'quill/dist/quill.snow.css', 'quill/dist/quill.bubble.css', 'quill/dist/quill.core.css' ],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{
			src: '~/plugins/vue-quill-editor',
			mode: 'client'
		},
		{
			src: '~/plugins/infiniteloading',
			ssr: false
		}
		// {
		// 	src: '~/plugins/vee-validate'
		// }
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		[
			'@nuxtjs/eslint-module',
			{
				fix: true
			}
		],
		// https://go.nuxtjs.dev/tailwindcss
		'@nuxtjs/tailwindcss'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		// https://go.nuxtjs.dev/pwa
		'@nuxtjs/pwa',
		'@nuxtjs/strapi',
		'@nuxtjs/auth-next',
		'cookie-universal-nuxt',
		'@nuxtjs/svg',
		[
			'nuxt-fontawesome',
			{
				imports: [
					{
						set: '@fortawesome/free-solid-svg-icons',
						icons: [ 'fas' ]
					},
					{
						set: '@fortawesome/free-brands-svg-icons',
						icons: [ 'fab' ]
					}
				]
			}
		],
		'nuxt-clipboard'
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		baseURL: 'https://strapi-notesapp.herokuapp.com'
	},

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		manifest: {
			lang: 'en'
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {},

	strapi: {
		entities: [ 'notes', 'users' ],
		url: 'https://strapi-notesapp.herokuapp.com'
	}
};
