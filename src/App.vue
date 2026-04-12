<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import TheModel from './components/TheModel.vue'
</script>

<template>
  <div id="canvas-wrapper">

    <TresCanvas
      :window-size="false"
      :resize="false"
      clear-color="#d2cbcb"

      style="width: 800px; height: 800px;">
      <Suspense>
        <TheModel />
      </Suspense>
    </TresCanvas>
  </div>
</template>
