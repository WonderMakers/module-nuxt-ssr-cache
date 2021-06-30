<template>
  <div></div>
</template>

<script>
  export default {
    name: 'page',
    httpHeaders: () => ({
      'Cache-Control': `max-age=${10 * 60}`
    })
  }
</script>
