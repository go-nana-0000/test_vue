import { ref } from 'vue'

/* カメラ設定 */
export function useCameraSettings() {
    // 平行カメラ設定
    const aspect = window.innerWidth / window.innerHeight
    const size = 5
    const left = ref(-size * aspect)
    const right = ref(size * aspect)
    const top = ref(size)
    const bottom = ref(-size)

    // カメラのズーム設定
    const baseZoom = 150; // PCのときのzoom
    const baseWidth = 600; // PCの描画幅
    const factor = 0.7; // 影響度
    const scale = 1 + (window.innerWidth / baseWidth - 1) * factor;
    const cameraZoom = baseZoom * scale;

  return {
    left,
    right,
    top,
    bottom,
    cameraZoom,
  }
}
