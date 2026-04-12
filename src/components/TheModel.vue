
<!-- スクリプト設定ここから -->
<script setup lang="ts">

// 各種インポート設定
import { ref, watch, onMounted, onUnmounted, shallowRef} from 'vue'
import * as THREE from 'three'
import { useGLTF, OrbitControls} from '@tresjs/cientos'
import { useRenderLoop } from '@tresjs/core'

// 描画前のエラー処理
onUnmounted(() => {
  console.log('destroy')
})

// サメ船長のモデル
const model = shallowRef<THREE.Object3D | null>(null)
const gltf = await useGLTF('./test_shark_captain.glb', { draco: true })
model.value = gltf.scene

// アニメーションミキサー設定
let mixer: THREE.AnimationMixer | null = null
onMounted(() => {
  if (!gltf.scene) {
    console.error('GLTF scene is undefined')
    return
  }

  mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[1])
  action.play()

  // キー入力で速度変更
  window.addEventListener('keydown', (e) => {
    if (!mixer) return

    if (e.key === 'ArrowUp') {
      mixer.timeScale += 0.1
    }
    if (e.key === 'ArrowDown') {
      mixer.timeScale = Math.max(0, mixer.timeScale - 0.1)
    }
  })
})

// ループ設定
const { onLoop } = useRenderLoop()
onLoop(({ delta }) => {
  if (mixer) mixer.update(delta)
})

// 平行カメラ設定
const aspect = window.innerWidth / window.innerHeight
const size = 5
const left = ref(-size * aspect)
const right = ref(size * aspect)
const top = ref(size)
const bottom = ref(-size)
</script>
<!-- スクリプト設定ここまで -->

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

