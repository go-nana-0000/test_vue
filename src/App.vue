<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { ref, watchEffect, watch } from 'vue'
import TheModel from './components/TheModel.vue'
import * as THREE from 'three'

const modelRef = ref<InstanceType<typeof TheModel> | null>(null)
const currentAction = ref(0)
const selectedAnimation = ref('')
const selectedMorph = ref('')
const morphValue = ref(0)
const availableActions = ref<string[]>([])
const actionMap = ref<Record<string, number>>({})
const morphNames = ref<string[]>([])

const modelReady = ref(false)

function onModelReady(payload: { actionMap: Record<string, number>; morphNames: string[] }) {
  actionMap.value = payload.actionMap
  availableActions.value = Object.keys(payload.actionMap)
  morphNames.value = [...new Set(payload.morphNames)]

  if (!selectedAnimation.value && availableActions.value.length) {
    selectedAnimation.value = availableActions.value[0]
  }
  modelReady.value = true
}

watchEffect(() => {
  if (selectedAnimation.value && selectedAnimation.value in actionMap.value) {
    currentAction.value = actionMap.value[selectedAnimation.value]
  }
})

watchEffect(() => {
  if (morphNames.value.length && !selectedMorph.value) {
    selectedMorph.value = morphNames.value[0]
  }
})

// モーフの変更を監視してモデルに反映
watch(
  [selectedMorph, morphValue, modelReady, () => modelRef.value],
  () => {
    const model = modelRef.value

    if (
      !modelReady.value ||
      !model ||
      typeof model.setMorph !== 'function'
    ) {
      return
    }

    requestAnimationFrame(() => {
      model.setMorph(selectedMorph.value, morphValue.value)
    })
  },
  { immediate: false }
)
</script>

<template>
  <div id="layout">
    <div id="canvas-wrapper">
      <TresCanvas
        class="canvas"
        shadows
        :window-size="false"
        :resize="false"
        :tone-mapping="THREE.NoToneMapping"
        :output-color-space="THREE.SRGBColorSpace"
        clear-color="#a9a9a9"
        style="width: 100%; height: 100vh;">

        <Suspense>
          <TheModel ref="modelRef" :action="currentAction" @model-ready="onModelReady" />
        </Suspense>
      </TresCanvas>
    </div>
    <div class="ui-area">
      <div class="center-box">
        <div class="ui-controls">
          <label for="animation-select">アニメーション:
          </label>
          <select id="animation-select" v-model="selectedAnimation" :disabled="availableActions.length === 0">
            <option value="" disabled>{{ availableActions.length ? '選択してください' : '読み込み中...' }}</option>
            <option v-for="name in availableActions" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <div class="ui-controls">
          <label for="morph-select">モーフ:
          </label>
          <select id="morph-select" v-model="selectedMorph" :disabled="morphNames.length === 0">
            <option value="" disabled>{{ morphNames.length ? '選択してください' : 'モーフなし' }}</option>
            <option v-for="name in morphNames" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <div class="ui-controls">
          <label for="morph-range">強さ: {{ morphValue.toFixed(2) }}
          </label>
          <input
            id="morph-range"
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="morphValue"
            :disabled="!selectedMorph"
          />
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
