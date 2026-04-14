
<!-- スクリプト設定ここから -->
<script setup lang="ts">

// 各種インポート設定
import { ref, watch, onUnmounted} from 'vue'
import { OrbitControls} from '@tresjs/cientos'
import { useCameraSettings } from '../composables/useCameraSettings'
import { useModelAnimation } from '../composables/useModelAnimation'

// expose する入れ物を先に作る
const Anim = ref<Record<string, number> | null>(null)
const playFn = ref<((n: number) => void) | null>(null)

defineExpose({
  Anim,
  play: playFn
})

// 描画前のエラー処理
onUnmounted(() => {
  console.log('destroy')
})

// アニメーション切り替えの監視
const props = defineProps<{
  action: number
}>()

// composable から取得
const { model, play, Anim: AnimRaw } = await useModelAnimation('./shark_captain.glb')

Anim.value = AnimRaw
playFn.value = play

watch(() => props.action, (newAction) => {
  if (playFn.value) playFn.value(newAction)
})

// カメラ設定読み込み
const { left, right, top, bottom, cameraZoom } = useCameraSettings()

</script>
<!-- スクリプト設定ここまで -->

<!-- テンプレート設定 -->
<template>
  <!-- 平行カメラの設定 -->
  <TresOrthographicCamera
    :zoom="cameraZoom"
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
  <TresAmbientLight :intensity="1.5" />
  <TresDirectionalLight :position="[2, 2, 2]" :intensity="1.5" />
  <TresHemisphereLight
    skyColor="#ffffff"
    groundColor="#444444"
    :intensity="0.8"
  />

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

