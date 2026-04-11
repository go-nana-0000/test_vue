<script setup lang="ts">
import type { TresObject } from '@tresjs/core'
import { useLoop } from '@tresjs/core'
import { shallowRef } from 'vue'
import { OrbitControls } from '@tresjs/cientos'

const { onBeforeRender } = useLoop()

// モデル定義
// ボックスモデル
const boxRef = shallowRef<TresObject | null>(null)

// アクアクのモデル
const { scene: model } =await useGLTF(
  // 'https://raw.githubusercontent.com/Tresjs/assets/main/models/gltf/aku-aku/AkuAku.gltf'
  'components/test_monkey.glb'
)

onBeforeRender(({ elapsed }) => {
  if (boxRef.value) {
    boxRef.value.rotation.y = elapsed
    boxRef.value.rotation.z = elapsed
  }
})
</script>

<template>
  <TresPerspectiveCamera :position="[5, 5, 5]" />
  <OrbitControls />
  <TresAmbientLight
    :intensity="0.5"
    color="red"
  />
  <!-- ボックスモデルを生成 -->
  <TresMesh ref="boxRef" :position="[0, 2, 0]">
    <TresBoxGeometry :args="[1, 1, 1]" />
    <TresMeshNormalMaterial />
  </TresMesh>
  <TresDirectionalLight
    :position="[0, 2, 4]"
    :intensity="1"
    cast-shadow
  />

  <!-- 軸表示オブジェクト -->
  <TresAxesHelper />

  <!-- グリッドオブジェクト -->
  <TresGridHelper :args="[10, 10, 0x444444, 'teal']" />
</template>
