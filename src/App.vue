<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { ref } from 'vue'
import TheModel from './components/TheModel.vue'

const modelRef = ref<InstanceType<typeof TheModel> | null>(null)
const currentAction = ref(0)

function walk() {
  if (!modelRef.value || !modelRef.value.Anim) return
  currentAction.value = modelRef.value.Anim.Walk
}

function stop() {
  if (!modelRef.value || !modelRef.value.Anim) return
  currentAction.value = modelRef.value.Anim.Stand
}
</script>

<template>
  <div id="layout">
    <div id="canvas-wrapper">
      <TresCanvas
        :window-size="false"
        :resize="false"
        clear-color="#a9a9a9"
        style="width: 100%; height: 100vh;">
        class="canvas"

        <Suspense>
          <TheModel ref="modelRef" :action="currentAction" />
        </Suspense>
      </TresCanvas>
    </div>
    <div class="ui-area">
      <div class="center-box">
        <div class="ui-buttons">
          <button @click="walk">歩く</button>
          <button @click="stop">止まる</button>
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
