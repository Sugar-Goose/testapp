<template>
  <div ref="splineContainer" class="spline-container"></div>
</template>

<script>
export default {
  name: 'Spline',
  props: {
    scene: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      splineApp: null
    }
  },
  async mounted() {
    await this.loadSpline()
  },
  beforeUnmount() {
    if (this.splineApp) {
      this.splineApp.dispose()
    }
  },
  methods: {
    async loadSpline() {
      try {
        const { Application } = await import('@splinetool/runtime')
        
        this.splineApp = new Application(this.$refs.splineContainer, {
          url: this.scene
        })
      } catch (error) {
        console.error('Failed to load Spline:', error)
      }
    }
  }
}
</script>

<style scoped>
.spline-container {
  width: 100%;
  height: 100%;
}
</style>
