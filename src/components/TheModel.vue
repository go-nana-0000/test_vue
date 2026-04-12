
<!-- スクリプト設定 -->
<script setup lang="ts">

import type { TresObject } from '@tresjs/core'
import { useGLTF, OrbitControls, useAnimations } from '@tresjs/cientos'
import { ref, watch, onMounted } from 'vue'

// サメ船長のモデル
const { scene: model, animations } = await useGLTF('./test_shark_captain.glb',{draco: true,})

// const { scene } = await useGLTF('/models/character.glb')
const { actions } = useAnimations(animations, model)

// カメラ設定の定数定義----------------------
const aspect = window.innerWidth / window.innerHeight
const size = 5
const left = ref(-size * aspect)
const right = ref(size * aspect)
const top = ref(size)
const bottom = ref(-size)

onMounted(() => {
  // "Walk" という名前のアニメーションを再生
  actions['Walk']?.play()
  // actions['Walk'].timeScale = 0.5
})

const sharkCaptainRef = ref(null)
watch(sharkCaptainRef, (model) => {
  // eslint-disable-next-line no-console
  console.log('sharkCaptainRef', model)
})
</script>

<!-- テンプレート設定 -->
<template>
  <!-- 平行カメラの設定 -->
  <TresOrthographicCamera
    :zoom="200"
    :left="left"
    :right="right"
    :top="top"
    :bottom="bottom"
    :near="0.1"
    :far="1000"
    :position="[5, 1.5, 10]"
  />

  <!-- 視点操作の設定 -->
  <OrbitControls />

  <!-- ライト設定 -->
  <TresAmbientLight :intensity="2" />
  <TresDirectionalLight :position="[2, 2, 2]" />

  <!-- モデル設定 -->
  <primitive
   :object="model"
   :position="[0, -1.5, 0]"
  />

  <!-- 軸表示オブジェクト -->
  <TresAxesHelper
   :position="[0, -1.5, 0]"
  />

  <!-- グリッドオブジェクト -->
  <TresGridHelper
   :args="[10, 10, 0x444444, 'teal']"
   :position="[0, -1.5, 0]"
  />
</template>

