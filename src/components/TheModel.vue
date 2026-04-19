
<!-- スクリプト設定ここから -->
<script setup lang="ts">

// 各種インポート設定
import { ref, watch, onUnmounted} from 'vue'
import { OrbitControls} from '@tresjs/cientos'
import { useCameraSettings } from '@/composables/useCameraSettings'
import { useModelWithFeatures } from '@/composables/useModelWithFeatures'

// expose する入れ物を先に作る
const AnimRef = ref<Record<string, number> | null>(null)
const playFnRef = ref<((n: number) => void) | null>(null)

defineExpose({
  get Anim() {
    return AnimRef.value
  },
  play(action: number) {
    if (playFnRef.value) playFnRef.value(action)
  }
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
const { model, play, Anim: AnimRaw } = await useModelWithFeatures('./shark_captain.glb', {
  preset: 'character'
})

const { model: test_base_model } = await useModelWithFeatures('./test_base.glb', {
  preset: 'static'
})

AnimRef.value = AnimRaw ?? null
playFnRef.value = play ?? null

watch(() => props.action, (newAction) => {
  if (playFnRef.value) playFnRef.value(newAction)
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
  <TresAmbientLight :intensity="2.5" />

<TresDirectionalLight
  :position="[5, 10, 5]"
  :intensity="1.0"
  cast-shadow
  :shadow-mapSize-width="2048"
  :shadow-mapSize-height="2048"
  :shadow-bias="-0.0001"
  :shadow-camera-left="-5"
  :shadow-camera-right="5"
  :shadow-camera-top="5"
  :shadow-camera-bottom="-5"
/>
<TresGroup :position="[0, -1, 0]">
  <!-- モデル設定 -->
  <primitive
   :object="model"
   />

  <primitive
   :object="test_base_model"
   />

  <!-- 軸表示オブジェクト -->
  <TresAxesHelper
  />

  <!-- グリッドオブジェクト -->
  <TresGridHelper
   :args="[10, 10, 0x444444, 'teal']"
  />
</TresGroup>

</template>

