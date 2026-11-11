import * as THREE from 'three'
import { STATION_3D_CONFIGS, type Station3DConfig } from './constants'

export class CameraDirector {
  private camera: THREE.PerspectiveCamera
  private currentEye: THREE.Vector3 = new THREE.Vector3(0, 15, 35)
  private currentLook: THREE.Vector3 = new THREE.Vector3(0, 2, 10)
  private mouseOffset: THREE.Vector2 = new THREE.Vector2(0, 0)

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.currentEye.copy(camera.position)

    // Listen for mouse parallax
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.onMouseMove, { passive: true })
    }
  }

  private onMouseMove = (event: MouseEvent): void => {
    const x: number = (event.clientX / window.innerWidth) * 2 - 1
    const y: number = -(event.clientY / window.innerHeight) * 2 + 1
    this.mouseOffset.set(x * 2.5, y * 1.5)
  }

  public update(
    trackCurve: THREE.CatmullRomCurve3,
    trainPos: THREE.Vector3,
    trainTangent: THREE.Vector3,
    journey: number
  ): void {
    // Determine closest station shot or transit shot
    const targetEye: THREE.Vector3 = new THREE.Vector3()
    const targetLook: THREE.Vector3 = new THREE.Vector3()

    let minStationDist: number = Infinity
    let nearestStation: Station3DConfig = STATION_3D_CONFIGS[0]

    for (const st of STATION_3D_CONFIGS) {
      const dist: number = Math.abs(journey - st.t)
      if (dist < minStationDist) {
        minStationDist = dist
        nearestStation = st
      }
    }

    // Is the train arriving at/near a station? (within 0.04 curve threshold)
    const stationInfluence: number = Math.max(0, 1 - minStationDist / 0.06)

    // Transit Shot: Cinematic elevated chase camera
    const up: THREE.Vector3 = new THREE.Vector3(0, 1, 0)
    const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(trainTangent, up).normalize()

    const chaseEye: THREE.Vector3 = trainPos
      .clone()
      .addScaledVector(trainTangent, -22)
      .addScaledVector(normal, 11.5)
    chaseEye.y += 8.2

    const chaseLook: THREE.Vector3 = trainPos.clone().addScaledVector(trainTangent, 6)
    chaseLook.y += 1.8

    // Station Shot: Platform camera framing bullet train and station canopy
    const stationPt: THREE.Vector3 = trackCurve.getPointAt(nearestStation.t)
    const stationTangent: THREE.Vector3 = trackCurve.getTangentAt(nearestStation.t).normalize()
    const stationNormal: THREE.Vector3 = new THREE.Vector3()
      .crossVectors(stationTangent, up)
      .normalize()

    const eyeSideOffset: number =
      nearestStation.platformSide === 1 ? 13.5 : -16.5

    const platformEye: THREE.Vector3 = stationPt
      .clone()
      .addScaledVector(stationNormal, eyeSideOffset)
      .addScaledVector(stationTangent, -7.5)
    platformEye.y += 5.2

    const platformLook: THREE.Vector3 = stationPt
      .clone()
      .addScaledVector(stationNormal, nearestStation.platformSide === 1 ? 2.5 : -3.5)
    platformLook.y += 2.0

    // Blend between Chase and Station shots
    targetEye.lerpVectors(chaseEye, platformEye, stationInfluence)
    targetLook.lerpVectors(chaseLook, platformLook, stationInfluence)

    // Add gentle mouse parallax
    targetEye.x += this.mouseOffset.x
    targetEye.y += this.mouseOffset.y

    // Smoothly damp camera motion
    this.currentEye.lerp(targetEye, 0.065)
    this.currentLook.lerp(targetLook, 0.065)

    this.camera.position.copy(this.currentEye)
    this.camera.lookAt(this.currentLook)
  }

  public dispose(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.onMouseMove)
    }
  }
}
