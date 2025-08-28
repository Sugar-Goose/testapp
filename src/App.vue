<template>
  <div id="app">
    <AppPreloader v-if="showPreloader" @preloader-complete="hidePreloader" />
    <AuthPage v-show="!showPreloader && !isAuthenticated" @auth-success="handleAuthSuccess" />
    <MainApp v-show="!showPreloader && isAuthenticated" @logout="handleLogout" />
  </div>
</template>

<script>
import AuthPage from './components/AuthPage.vue'
import AppPreloader from './components/Preloader.vue'
import MainApp from './components/MainApp.vue'
import { getAuthToken } from './services/api.js'

export default {
  name: 'App',
  components: {
    AuthPage,
    AppPreloader,
    MainApp
  },
  data() {
    return {
      showPreloader: true,
      isAuthenticated: false
    }
  },
      async mounted() {
      await this.checkAuthentication()
    },
  methods: {
    hidePreloader() {
      this.showPreloader = false
    },
    async checkAuthentication() {
      const token = getAuthToken()
      this.isAuthenticated = !!token
      console.log(this.isAuthenticated ? 'Авторизован' : 'Не авторизован')
    },
    handleLogout() {
      this.isAuthenticated = false
      console.log('Выход')
    },
    handleAuthSuccess() {
      this.isAuthenticated = true
    }
  }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0f0f23;
  color: #ffffff;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

html {
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.auth-page {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
}

::-webkit-scrollbar-thumb {
  background: #2d2d44;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3d3d54;
}

*:focus {
  outline: 2px solid #6E5CF7;
  outline-offset: 2px;
}

::selection {
  background: rgba(110, 92, 247, 0.3);
  color: #ffffff;
}
</style>
