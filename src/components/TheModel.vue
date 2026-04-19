
<!-- スクリプト設定ここから -->
<script setup lang="ts">

// 各種インポート設定
import { shallowRef, watch, onUnmounted } from 'vue'
import { OrbitControls } from '@tresjs/cientos'
import { useCameraSettings } from '@/composables/useCameraSettings'
import { useModelWithFeatures } from '@/composables/useModelWithFeatures'

// expose する入れ物を先に作る
const AnimRef = shallowRef<Record<string, number>>({})
const playFnRef = shallowRef<((n: number) => void) | null>(null)
const model = shallowRef<any>(null)
const test_base_model = shallowRef<any>(null)
const morphNames = shallowRef<string[]>([])
const setMorphFn = shallowRef<((name: string, value: number) => void) | null>(null)
const getMorphListFn = shallowRef<(() => any) | null>(null)

const emit = defineEmits<{
  (e: 'model-ready', payload: {
    actionMap: Record<string, number>
    morphNames: string[]
  }): void
}>()

// 描画前のエラー処理
onUnmounted(() => {
  console.log('destroy')
})

// アニメーション切り替えの監視
const props = defineProps<{
  action: number
}>()

// Expose は先に登録しておく
defineExpose({
  play(action: number) {
    if (playFnRef.value) playFnRef.value(action)
  },
  setMorph(name: string, value: number) {
    if (setMorphFn.value) {
      setMorphFn.value(name, value)
    }
  },
  getMorphList() {
    return getMorphListFn.value?.()
  },
  get morphNames() {
    return morphNames.value
  }
})

const shark = await useModelWithFeatures('./shark_captain.glb', {
  preset: 'character'
})

const sharkStatic = await useModelWithFeatures('./test_base.glb', {
  preset: 'static'
})

model.value = shark.model.value ?? null
test_base_model.value = sharkStatic.model.value ?? null
AnimRef.value = shark.Anim ?? {}
playFnRef.value = shark.play ?? null
setMorphFn.value = shark.setMorph ?? null
getMorphListFn.value = shark.getMorphList ?? null

const names = getMorphListFn.value ? getMorphListFn.value().flatMap((item: any) => item.morphs) : []
morphNames.value = names

emit('model-ready', {
  actionMap: AnimRef.value,
  morphNames: names,
})

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
    v-if="model"
    :object="model"
  />
  <primitive
    v-if="test_base_model"
    :object="test_base_model"
  />

  <!-- 軸表示オブジェクト -->
  <TresAxesHelper />

  <!-- グリッドオブジェクト -->
  <TresGridHelper
    :args="[10, 10, 0x444444, 'teal']"
  />
</TresGroup>

</template>

