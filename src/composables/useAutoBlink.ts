/* 自動まばたきを管理するComposable */
import * as THREE from 'three'

export function useAutoBlink(
  scene: THREE.Object3D,
  setMorph: (name: string, value: number) => void
) {
  let timer = 0

  // 状態管理
  let state: 'OPEN' | 'CLOSING' | 'CLOSED' | 'OPENING' = 'OPEN'

  let blinkTime = 0
  let closedHoldTime = 0.2

  const closeSpeed = 32
  const openSpeed = 30

  function update(delta: number) {
    timer += delta

    // 2〜5秒でまばたき開始
    if (state === 'OPEN' && timer > 4 + Math.random() * 7) {
      state = 'CLOSING'
      timer = 0
      blinkTime = 0
    }

    // 閉じる動作
    if (state === 'CLOSING') {
      blinkTime += delta * closeSpeed

      const value = Math.min(blinkTime, 1)
      setMorph('Blink', value)

      if (value >= 1) {
        state = 'CLOSED'
        closedHoldTime = 0
      }
    }

    // 目を閉じている時間（ここが重要）
    if (state === 'CLOSED') {
      closedHoldTime += delta

      setMorph('Blink', 1)

      // ★ここで「閉じている時間」を調整
      if (closedHoldTime > 0.08 + Math.random() * 0.12) {
        state = 'OPENING'
        blinkTime = 0
      }
    }

    // 開く動作
    if (state === 'OPENING') {
      blinkTime += delta * openSpeed

      const value = Math.max(1 - blinkTime, 0)
      setMorph('Blink', value)

      if (value <= 0) {
        state = 'OPEN'
        setMorph('Blink', 0)
      }
    }
  }

  return { update }
}
