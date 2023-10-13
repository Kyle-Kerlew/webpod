# WebPod

WebPod is a web app designed to resemble the design and functionality of an Apple iPod. To use the app, user must have Spotify Premium and login with their Spotify account. 
## Deployment

This project is live at https://webpod.kylekerlew.com. The subdomain is hosted on Google Cloud Platform using App Engine. The app will automatically scale up and down as needed, based on usage. Custom DNS records configured through Google Domains.

## Major Technologies used 🛠️

- [Spotify API](https://developer.spotify.com/documentation/web-api/) - Spotify API used to retrieve user data
- [Vue v3](https://v3.vuejs.org/) - Frontend framework used to build the app (using the Options API)
- [Vite v3](https://vitejs.dev/) - Build tool used to bundle the app
- [Pinia v2](https://pinia.esm.dev/) - State management library
- [vue-cookies v1.8](https://www.npmjs.com/package/vue-cookies) - Cookie management library

