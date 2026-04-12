<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import TheModel from './components/TheModel.vue'
</script>

<template>
  <div id="canvas-wrapper">
    <TresCanvas
      :window-size="false"
      :resize="false"
      clear-color="#a9a9a9"
      style="width: 100%; height: 100vh;">
      <Suspense>
        <TheModel />
      </Suspense>
    </TresCanvas>
  </div>
    <div id="ui-area">
    <h3>操作方法</h3>
    <ul>
      <li>Wキー：歩く</li>
      <li> Sキー：止まる</li>
      <li>左クリック+ドラッグ：視点回転</li>
      <li>右クリック+ドラッグ：視点移動</li>
      <li>マウスホイール：視点拡大/縮小</li>
    </ul>
  </div>
</template>
