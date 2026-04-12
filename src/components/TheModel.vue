
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

// アニメーション管理番号
enum Anim {
  Stand = 0,
  Walk = 1,
}

// サメ船長のモデル
const model = shallowRef<THREE.Object3D | null>(null)
const gltf = await useGLTF('./shark_captain.glb', { draco: true })
model.value = gltf.scene
const actions: Record<string, THREE.AnimationAction> = {}

// ログ表示系処理
const logTimeScale = () => {
  if (!mixer) return
  console.log(`timeScale: ${mixer.timeScale.toFixed(2)}`)
}

const logAnimationName = (num: number) => {
  if (!gltf) return
  console.log(`animations name: ${gltf.animations[num].name}`)
}


// アニメーション切り替え
function playAction(name: string) {
  if (!mixer) return

  // すべてのアクションをフェードアウト
  Object.values(actions).forEach(a => a.fadeOut(0.2))

  // 指定アクションをフェードイン
  const action = actions[name]
  if (action) {
    action.reset().fadeIn(0.2).play()
  }
}

// アニメーションミキサー設定
let mixer: THREE.AnimationMixer | null = null
onMounted(() => {
  if (!gltf.scene) {
    console.error('GLTF scene is undefined')
    return
  }

  // 初期アニメ設定
  var currentAnimNum = Anim.Stand

  //アニメーションを再生するための AnimationMixer を作成
  mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[currentAnimNum])
  action.play()
  logAnimationName(currentAnimNum)
  console.log(`animations name: ${gltf.animations[currentAnimNum].name}`)

  // GLB 内のすべてのアニメーションを AnimationAction に変換し、
  // 名前でアクセスできるように登録する処理
  gltf.animations.forEach((clip) => {
    actions[clip.name] = mixer!.clipAction(clip)
  })

  // キー入力系処理
  window.addEventListener('keydown', (e) => {
    if (!mixer) return

    switch (e.key) {
      case "ArrowUp":
        mixer.timeScale += 0.1
        logTimeScale()
        break
      case "ArrowDown":
        mixer.timeScale = Math.max(0, mixer.timeScale - 0.1)
        logTimeScale()
        break
      case "w":
        if (currentAnimNum != Anim.Walk) {
          playAction("Walk")
          currentAnimNum = Anim.Walk
          console.log(`animations name: Walk`)
        }
        break
      case "s":
        if (currentAnimNum != Anim.Stand) {
          playAction("Stand")
          currentAnimNum = Anim.Stand
          console.log(`animations name: Stand`)
        }
        break
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

