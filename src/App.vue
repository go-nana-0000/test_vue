<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { ref } from 'vue'
import TheModel from './components/TheModel.vue'

const currentAction = ref("Stand")

function walk() {
  currentAction.value = "Walk"
}
function stop() {
  currentAction.value = "Stand"
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
          <TheModel :action="currentAction" />
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
<style>

/* Canvas の高さを固定（例：70vh） */
.canvas {
  width: 100%;
  height: 70vh;
}

#layout {
  display: flex;
  flex-direction: column;
}

.ui-area {
  padding: 10px;
  background: #f7f7f7;
}

.ui-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.center-box {
  max-width: 600px;
  margin: 0 auto; /* 中央寄せ */
  width: 100%;
}


</style>
