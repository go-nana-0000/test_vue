<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

// import TheExperience from './components/TheExperience.vue'
import TheModel from './components/TheModel.vue'
</script>

<template>
  <div id="canvas-wrapper">

    <TresCanvas
      :window-size="false"
      :resize="false"

      style="width: 800px; height: 800px;">
      <Suspense>
        <TheModel />
      </Suspense>
    </TresCanvas>
  </div>
</template>
