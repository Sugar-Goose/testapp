<template>
  <div class="spline-container">
    <canvas ref="canvas3d" class="spline-canvas"></canvas>
    <div class="blackcube"></div>
  </div>
</template>

<script>
export default {
  name: 'SplineComp',
  data() {
    return {
      splineApp: null
    }
  },
  async mounted() {
    await this.loadSpline()
    this.setupMouseTracking()
  },
  beforeUnmount() {
    if (this.splineApp) {
      this.splineApp.dispose()
    }
    this.removeMouseTracking()
  },
  methods: {
    async loadSpline() {
      try {
        const { Application } = await import('@splinetool/runtime')
        this.splineApp = new Application(this.$refs.canvas3d)
        await this.splineApp.load('https://prod.spline.design/OatdoeXjoZYAXB3G/scene.splinecode')

        console.log('Spline scene loaded successfully!')
      } catch (error) {
        console.error('Failed to load Spline:', error)
      }
    },
    setupMouseTracking() {
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseenter', this.handleMouseEnter)
      document.addEventListener('mouseleave', this.handleMouseLeave)
    },
    removeMouseTracking() {
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseenter', this.handleMouseEnter)
      document.removeEventListener('mouseleave', this.handleMouseLeave)
    },
    handleMouseMove(event) {
      if (this.splineApp) {
        const rect = this.$refs.canvas3d.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const normalizedX = x / rect.width
        const normalizedY = y / rect.height

        try {
          if (this.splineApp.events && this.splineApp.events.emit) {
            this.splineApp.events.emit('mouseMove', { x: normalizedX, y: normalizedY })
          }
        } catch (error) {
          console.warn('Spline mouse move event failed:', error)
        }
      }
    },
    handleMouseEnter() {
      if (this.splineApp) {
        try {
          if (this.splineApp.events && this.splineApp.events.emit) {
            this.splineApp.events.emit('mouseEnter')
          }
        } catch (error) {
          console.warn('Spline mouse enter event failed:', error)
        }
      }
    },
    handleMouseLeave() {
      if (this.splineApp) {
        try {
          if (this.splineApp.events && this.splineApp.events.emit) {
            this.splineApp.events.emit('mouseLeave')
          }
        } catch (error) {
          console.warn('Spline mouse leave event failed:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.spline-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.spline-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.blackcube {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
  height: 100px;
  z-index: 100;
  pointer-events: none;
  background-color: #000;
}
</style>
