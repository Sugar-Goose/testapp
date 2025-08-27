# Настройка Spline в Vue.js

## Проблема
Spline не загружается в Vue.js приложении.

## Решение

### 1. Установка пакета
```bash
npm install @splinetool/runtime
```

### 2. Правильный код компонента
```vue
<template>
  <div class="spline-container">
    <canvas ref="canvas3d" class="spline-canvas"></canvas>
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
        
        this.splineApp = new Application(this.$refs.canvas3d)
        await this.splineApp.load('https://prod.spline.design/ctDmDpG-ltaughfd/scene.splinecode')
        
        console.log('Spline scene loaded successfully!')
      } catch (error) {
        console.error('Failed to load Spline:', error)
      }
    }
  }
}
</script>
```

### 3. Ключевые моменты
- Используйте `<canvas>` элемент с `ref="canvas3d"`
- Создайте `Application` без параметров: `new Application(canvas)`
- Используйте метод `load()` для загрузки сцены
- Всегда вызывайте `dispose()` при размонтировании

### 4. Запуск проекта
```bash
# В Git Bash терминале:
cd "C:/Users/Sugar/Desktop/test app/sa-investor-cabinet"
npm install
npm run serve
```

### 5. Проверка
- Откройте консоль браузера (F12)
- Ищите сообщения "Spline scene loaded successfully!"
- Если есть ошибки, они будут в консоли

## Альтернативные URL для тестирования
- `https://prod.spline.design/ctDmDpG-ltaughfd/scene.splinecode`
- `https://my.spline.design/untitledcopy-ctDmDpG-ltaughfd/scene.splinecode`

## Полезные ссылки
- [Spline Documentation](https://docs.spline.design/)
- [Runtime API](https://docs.spline.design/developers/api/runtime)
