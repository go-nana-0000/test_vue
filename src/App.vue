<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { computed, ref, watchEffect } from 'vue'
import TheModel from './components/TheModel.vue'
import * as THREE from 'three'

const modelRef = ref<InstanceType<typeof TheModel> | null>(null)
const currentAction = ref(0)
const selectedAnimation = ref('Idle')

const availableActions = computed(() => {
  const anim = modelRef.value?.Anim as Record<string, number> | undefined
  return anim ? Object.keys(anim) : []
})

watchEffect(() => {
  const anim = modelRef.value?.Anim as Record<string, number> | undefined
  if (!anim || !selectedAnimation.value) return

  if (!(selectedAnimation.value in anim)) {
    selectedAnimation.value = availableActions.value[0] ?? ''
    return
  }

  currentAction.value = anim[selectedAnimation.value]
})

</script>

<template>
  <div id="layout">
    <div id="canvas-wrapper">
      <TresCanvas
        class="canvas"
        shadows
        :window-size="false"
        :resize="false"
        :tone-mapping="THREE.NoToneMapping"
        :output-color-space="THREE.SRGBColorSpace"
        clear-color="#a9a9a9"
        style="width: 100%; height: 100vh;">

        <Suspense>
          <TheModel ref="modelRef" :action="currentAction" />
        </Suspense>
      </TresCanvas>
    </div>
    <div class="ui-area">
      <div class="center-box">
        <div class="ui-controls">
          <label for="animation-select">アニメーション:
          </label>
          <select id="animation-select" v-model="selectedAnimation" :disabled="availableActions.length === 0">
            <option value="" disabled>{{ availableActions.length ? '選択してください' : '読み込み中...' }}</option>
            <option v-for="name in availableActions" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <div id="howto">
          <h3>操作方法</h3>
          <ul>
            <li>左クリック+ドラッグ：視点回転</li>
            <li>右クリック+ドラッグ：視点移動</li>
            <li>マウスホイール：視点拡大/縮小</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
