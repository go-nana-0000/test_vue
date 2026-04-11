<script setup lang="ts">
import type { TresObject } from '@tresjs/core'
import { useGLTF } from '@tresjs/cientos'
import { ref, watch } from 'vue'
import { OrbitControls } from '@tresjs/cientos'



const aspect = window.innerWidth / window.innerHeight
const size = 5

const offsetX = 200000
const offsetY = -1000

const left = ref(-size * aspect + offsetX)
const right = ref(size * aspect + offsetX)
const top = ref(size + offsetY)
const bottom = ref(-size + offsetY)

// クラッシュのアクアクのモデル
const { scene: model } = await useGLTF(
  // 'https://raw.githubusercontent.com/Tresjs/assets/main/models/gltf/aku-aku/AkuAku.gltf',
  // 'public/test_monkey.glb',
  'public/test_shark_captain.glb',
  {
    draco: true,
  },
)

const akuAkuRef = ref(null)

watch(akuAkuRef, (model) => {
  // eslint-disable-next-line no-console
  console.log('akuAkuRef', model)
})

</script>

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

  <!-- パースカメラの設定 -->
  <!-- <TresPerspectiveCamera :position="[5, 5, 5]" /> -->

  <!-- 視点操作の設定 -->
  <!-- <OrbitControls /> -->
  <!-- <OrbitControls :enablePan="false" /> -->
  <!-- <OrbitControls :enableRotate="false" :enablePan="false" /> -->
  <!-- <OrbitControls :target="[0.2, 1.4, 0]" /> -->
  <OrbitControls ref="controls" />


  <!-- ライト設定 -->
  <TresAmbientLight :intensity="1.0" />
  <TresDirectionalLight :position="[2, 2, 2]" />

  <primitive
   :object="model"
   :position="[0, -1.5, 0]" />

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

