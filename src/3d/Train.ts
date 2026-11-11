import * as THREE from 'three'
import { TRAIN_SPECS } from './constants'

interface CarInstance {
  group: THREE.Group
  offsetLength: number // Distance behind the lead car nose tip
  wheels: THREE.Group[]
  bodyMeshGroup: THREE.Group // Active dynamic banking on curves
}

interface TgvCarConfig {
  type: 'power-lead' | 'duplex-coach' | 'power-tail'
  length: number
  height: number
  coachName?: string
}

export class Train {
  public group: THREE.Group
  private cars: CarInstance[] = []
  private pantographSpark: THREE.PointLight | null = null
  private wheelRotation: number = 0
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = []

  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'SncfTgvDuplexBulletTrain'

    this.buildTgvDuplexTrain()
  }

  // --- 1. PROCEDURAL TEXTURES & BADGES ---
  private createTgvBadgeTexture(): THREE.CanvasTexture {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

    if (ctx) {
      ctx.clearRect(0, 0, 256, 128)

      // Carmine Red rounded rectangular plaque (SNCF Carmillon)
      ctx.fillStyle = '#d91b42'
      ctx.beginPath()
      ctx.roundRect(14, 18, 114, 92, 16)
      ctx.fill()

      // Bold white SNCF branding
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px Archivo, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('SNCF', 71, 64)

      // Dynamic script/italic TGV logo
      ctx.fillStyle = '#ffffff'
      ctx.font = 'italic 900 52px Archivo, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('tgv', 138, 68)
    }

    const tex: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
    this.disposables.push(tex)
    return tex
  }

  private createFleetNumberTexture(): THREE.CanvasTexture {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 64
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

    if (ctx) {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, 128, 64)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 4
      ctx.strokeRect(2, 2, 124, 60)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 34px "Geist Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('802', 64, 32)
    }

    const tex: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
    this.disposables.push(tex)
    return tex
  }

  private createLouverTexture(): THREE.CanvasTexture {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 32
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

    if (ctx) {
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(0, 0, 128, 32)

      ctx.fillStyle = '#1e293b'
      for (let y: number = 3; y < 30; y += 4) {
        ctx.fillRect(2, y, 124, 2)
      }
    }

    const tex: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
    this.disposables.push(tex)
    return tex
  }

  // --- 2. SMOOTH AERODYNAMIC 2D FUSELAGE PROFILES ---
  // A. Power Car Body Cross-Section (Tumblehome, barrel waist, arched crown)
  private createPowerCarFuselageShape(w: number, h: number): THREE.Shape {
    const shape: THREE.Shape = new THREE.Shape()
    const halfW: number = w * 0.5
    const underY: number = 0.36
    const skirtY: number = 0.54
    const waistY: number = 1.18
    const shoulderY: number = 1.76
    const roofY: number = h + 0.14

    shape.moveTo(0, underY)
    shape.quadraticCurveTo(halfW * 0.72, underY, halfW * 0.93, skirtY)
    shape.quadraticCurveTo(halfW * 1.02, (skirtY + waistY) * 0.5, halfW, waistY)
    shape.quadraticCurveTo(halfW * 0.96, (waistY + shoulderY) * 0.5, halfW * 0.88, shoulderY)
    shape.bezierCurveTo(halfW * 0.74, roofY, -halfW * 0.74, roofY, -halfW * 0.88, shoulderY)
    shape.quadraticCurveTo(-halfW * 0.96, (waistY + shoulderY) * 0.5, -halfW, waistY)
    shape.quadraticCurveTo(-halfW * 1.02, (skirtY + waistY) * 0.5, -halfW * 0.93, skirtY)
    shape.quadraticCurveTo(-halfW * 0.72, underY, 0, underY)

    return shape
  }

  // B. Duplex Double-Decker Coach Cross-Section (Taller, dual-deck bulge & tumblehome)
  private createDuplexCoachFuselageShape(w: number, h: number): THREE.Shape {
    const shape: THREE.Shape = new THREE.Shape()
    const halfW: number = w * 0.5
    const underY: number = 0.36
    const skirtY: number = 0.54
    const lowerDeckY: number = 1.12
    const waistBeltY: number = 1.58
    const upperDeckY: number = 2.18
    const roofY: number = h + 0.12

    shape.moveTo(0, underY)
    shape.quadraticCurveTo(halfW * 0.72, underY, halfW * 0.93, skirtY)
    shape.quadraticCurveTo(halfW * 1.02, (skirtY + lowerDeckY) * 0.5, halfW * 1.01, lowerDeckY)
    shape.quadraticCurveTo(halfW * 0.99, (lowerDeckY + waistBeltY) * 0.5, halfW * 0.98, waistBeltY)
    shape.quadraticCurveTo(halfW * 0.94, (waistBeltY + upperDeckY) * 0.5, halfW * 0.86, upperDeckY)
    shape.bezierCurveTo(halfW * 0.70, roofY, -halfW * 0.70, roofY, -halfW * 0.86, upperDeckY)
    shape.quadraticCurveTo(-halfW * 0.94, (waistBeltY + upperDeckY) * 0.5, -halfW * 0.98, waistBeltY)
    shape.quadraticCurveTo(-halfW * 0.99, (lowerDeckY + waistBeltY) * 0.5, -halfW * 1.01, lowerDeckY)
    shape.quadraticCurveTo(-halfW * 1.02, (skirtY + lowerDeckY) * 0.5, -halfW * 0.93, skirtY)
    shape.quadraticCurveTo(-halfW * 0.72, underY, 0, underY)

    return shape
  }

  // --- 3. WATERTIGHT COMPOUND-CURVED AERODYNAMIC TGV NOSE MESH GENERATOR ---
  // Generates smooth, watertight CAD-grade curved nose geometries for silver hood, blue apron, and front snowplow
  private createTgvSculptedNoseSurfaces(dir: number): {
    upperSilverGeo: THREE.BufferGeometry
    lowerBlueGeo: THREE.BufferGeometry
    skirtPilotGeo: THREE.BufferGeometry
    pinstripeGeo: THREE.BufferGeometry
  } {
    const noseLength: number = 4.2
    const stationRings: number = 22
    const radialSegs: number = 16

    interface NoseStationData {
      z: number
      halfW: number
      yRoof: number
      yBelt: number
      ySkirt: number
      yPlow: number
    }

    const stations: NoseStationData[] = []

    for (let i: number = 0; i <= stationRings; i++) {
      const u: number = i / stationRings // 0.0 (cab bulkhead) -> 1.0 (snout tip)
      const zVal: number = u * noseLength

      // Aerodynamic lateral taper
      const halfWVal: number = 1.25 * (1.0 - 0.78 * Math.pow(u, 1.35))

      // Roof profile: cab windshield slope then hood cone
      let yRoofVal: number
      if (u <= 0.30) {
        const wt: number = u / 0.30
        yRoofVal = 2.22 - 0.62 * Math.pow(wt, 1.25) // Windshield rake
      } else {
        const wt: number = (u - 0.30) / 0.70
        yRoofVal = 1.60 - 0.88 * Math.pow(wt, 0.95) // Hood slope
      }

      // Beltline dividing silver upper hood and royal blue lower skirt
      const yBeltVal: number = 1.18 - 0.60 * Math.pow(u, 1.15)

      // Skirt line (bottom of blue apron above the plow)
      const ySkirtVal: number = 0.54 - 0.14 * u

      // Underbody snowplow deflector
      const yPlowVal: number = 0.28 + 0.10 * Math.pow(u, 2.0)

      stations.push({
        z: zVal,
        halfW: halfWVal,
        yRoof: yRoofVal,
        yBelt: yBeltVal,
        ySkirt: ySkirtVal,
        yPlow: yPlowVal,
      })
    }

    // Helper to generate an indexed lofted buffer geometry
    const loftSurface = (
      sampleVertex: (st: NoseStationData, rIdx: number) => { x: number; y: number },
      addCapTip: boolean,
      capTipPoint?: { y: number; zOffset: number }
    ): THREE.BufferGeometry => {
      const verts: number[] = []
      const indices: number[] = []

      for (let s: number = 0; s <= stationRings; s++) {
        const st: NoseStationData = stations[s]
        const zPos: number = dir * st.z

        for (let r: number = 0; r <= radialSegs; r++) {
          const pt = sampleVertex(st, r)
          verts.push(pt.x, pt.y, zPos)
        }
      }

      // Quad strip grid
      for (let s: number = 0; s < stationRings; s++) {
        for (let r: number = 0; r < radialSegs; r++) {
          const i0: number = s * (radialSegs + 1) + r
          const i1: number = i0 + 1
          const i2: number = (s + 1) * (radialSegs + 1) + r
          const i3: number = i2 + 1

          if (dir > 0) {
            indices.push(i0, i2, i1)
            indices.push(i1, i2, i3)
          } else {
            indices.push(i0, i1, i2)
            indices.push(i1, i3, i2)
          }
        }
      }

      // Watertight front end cap sealing the snout tip
      if (addCapTip && capTipPoint) {
        const tipIdx: number = verts.length / 3
        verts.push(0, capTipPoint.y, dir * (noseLength + capTipPoint.zOffset))

        const lastRingStart: number = stationRings * (radialSegs + 1)
        for (let r: number = 0; r < radialSegs; r++) {
          const iCurr: number = lastRingStart + r
          const iNext: number = iCurr + 1
          if (dir > 0) {
            indices.push(iCurr, tipIdx, iNext)
          } else {
            indices.push(iCurr, iNext, tipIdx)
          }
        }
      }

      const geo: THREE.BufferGeometry = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
      geo.setIndex(indices)
      geo.computeVertexNormals()
      this.disposables.push(geo)
      return geo
    }

    // 1. Upper Metallic Silver Hood & Roof Crown
    const upperSilverGeo: THREE.BufferGeometry = loftSurface(
      (st: NoseStationData, rIdx: number): { x: number; y: number } => {
        const t: number = rIdx / radialSegs // 0 (left beltline) -> 0.5 (roof peak) -> 1 (right beltline)
        const angle: number = t * Math.PI
        const x: number = -Math.cos(angle) * st.halfW
        const arch: number = Math.sin(angle)
        const y: number = st.yBelt + (st.yRoof - st.yBelt) * arch
        return { x, y }
      },
      true,
      { y: 0.70, zOffset: 0.08 }
    )

    // 2. Lower TGV Royal Blue Apron & Chin
    const lowerBlueGeo: THREE.BufferGeometry = loftSurface(
      (st: NoseStationData, rIdx: number): { x: number; y: number } => {
        const t: number = rIdx / radialSegs // 0 (left skirt) -> 0.5 (chin bottom) -> 1 (right skirt)
        const angle: number = t * Math.PI
        const x: number = -Math.cos(angle) * (st.halfW * 0.98)
        const arch: number = Math.sin(angle)
        // Transitions smoothly from skirt line to beltline
        const y: number = st.ySkirt + (st.yBelt - st.ySkirt) * (1.0 - arch * 0.45)
        return { x, y }
      },
      true,
      { y: 0.56, zOffset: 0.08 }
    )

    // 3. Dark Slate Snowplow / Cowcatcher Deflector
    const skirtPilotGeo: THREE.BufferGeometry = loftSurface(
      (st: NoseStationData, rIdx: number): { x: number; y: number } => {
        const t: number = rIdx / radialSegs
        const angle: number = t * Math.PI
        const x: number = -Math.cos(angle) * (st.halfW * 0.92)
        const arch: number = Math.sin(angle)
        const y: number = st.yPlow + (st.ySkirt - st.yPlow) * arch
        return { x, y }
      },
      true,
      { y: 0.36, zOffset: 0.12 }
    )

    // 4. Fine White Dividing Pinstripe Ribbon along Nose Beltline
    const pinstripeVerts: number[] = []
    const pinstripeIndices: number[] = []
    for (let s: number = 0; s <= stationRings; s++) {
      const st: NoseStationData = stations[s]
      const zPos: number = dir * st.z
      pinstripeVerts.push(-st.halfW * 1.005, st.yBelt + 0.02, zPos)
      pinstripeVerts.push(-st.halfW * 1.005, st.yBelt - 0.02, zPos)
      pinstripeVerts.push(st.halfW * 1.005, st.yBelt + 0.02, zPos)
      pinstripeVerts.push(st.halfW * 1.005, st.yBelt - 0.02, zPos)
    }

    for (let s: number = 0; s < stationRings; s++) {
      const b: number = s * 4
      // Left side quad
      pinstripeIndices.push(b, b + 4, b + 1, b + 1, b + 4, b + 5)
      // Right side quad
      pinstripeIndices.push(b + 2, b + 3, b + 6, b + 3, b + 7, b + 6)
    }

    const pinstripeGeo: THREE.BufferGeometry = new THREE.BufferGeometry()
    pinstripeGeo.setAttribute('position', new THREE.Float32BufferAttribute(pinstripeVerts, 3))
    pinstripeGeo.setIndex(pinstripeIndices)
    pinstripeGeo.computeVertexNormals()
    this.disposables.push(pinstripeGeo)

    return { upperSilverGeo, lowerBlueGeo, skirtPilotGeo, pinstripeGeo }
  }

  // --- 4. ASSEMBLE COMPLETE TGV DUPLEX CONSIST ---
  private buildTgvDuplexTrain(): void {
    // A. Metallic Silver / High-Speed Aluminium Paint (Upper Carbody & Roof)
    const tgvSilverMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8d4e2,
      metalness: 0.88,
      roughness: 0.16,
    })

    // B. Iconic French TGV Royal Blue Clearcoat (Lower Carbody & Nose Swoop)
    const tgvRoyalBlueMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x0052a5,
      metalness: 0.65,
      roughness: 0.20,
    })

    // C. Signature Carmine Red / Fuchsia Passenger Entry Doors
    const tgvCarmineRedMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xd91b42,
      metalness: 0.35,
      roughness: 0.28,
    })

    // D. Crisp White Separating Pinstripe Livery Ribbon
    const whitePinstripeMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.40,
      roughness: 0.25,
    })

    // E. Dark Slate Underframe Skirting, Snowplow & Gangway Bellows
    const darkSkirtingMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.70,
      roughness: 0.35,
    })

    // F. Flush Tinted Automotive Train Glass
    const windowGlassMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x080d1a,
      metalness: 0.98,
      roughness: 0.04,
    })

    // G. Warm Interior Cabin Illumination Glow
    const cabinGlowMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    })

    // H. Running Gear Materials
    const steelWheelMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.10,
    })

    const bogieFrameMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.82,
      roughness: 0.30,
    })

    const bellowMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.96,
      metalness: 0.08,
    })

    const redTailLedMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xef4444,
    })

    this.disposables.push(
      tgvSilverMaterial,
      tgvRoyalBlueMaterial,
      tgvCarmineRedMaterial,
      whitePinstripeMaterial,
      darkSkirtingMaterial,
      windowGlassMaterial,
      cabinGlowMaterial,
      steelWheelMaterial,
      bogieFrameMaterial,
      bellowMaterial,
      redTailLedMaterial
    )

    // Complete 5-Car Majestic Consist matching uploaded photograph:
    // [Lead Locomotive 11.8m] + [Duplex Coach 1] + [Duplex Coach 2] + [Duplex Coach 3] + [Tail Locomotive 11.8m]
    const carConfigs: TgvCarConfig[] = [
      { type: 'power-lead', length: 11.8, height: 2.22 },
      { type: 'duplex-coach', length: 9.6, height: 2.64, coachName: 'First Class / Club' },
      { type: 'duplex-coach', length: 9.6, height: 2.64, coachName: 'TGV Bistro Bar' },
      { type: 'duplex-coach', length: 9.6, height: 2.64, coachName: 'Standard Class' },
      { type: 'power-tail', length: 11.8, height: 2.22 },
    ]

    let currentOffset: number = 0

    carConfigs.forEach((cfg: TgvCarConfig, carIndex: number) => {
      const carGroup: THREE.Group = new THREE.Group()
      const bodyMeshGroup: THREE.Group = new THREE.Group()
      const wheels: THREE.Group[] = []
      const len: number = cfg.length
      const w: number = TRAIN_SPECS.width
      const h: number = cfg.height

      if (cfg.type === 'power-lead' || cfg.type === 'power-tail') {
        const isLead: boolean = cfg.type === 'power-lead'
        this.buildTgvPowerCar(
          bodyMeshGroup,
          isLead,
          len,
          w,
          h,
          tgvSilverMaterial,
          tgvRoyalBlueMaterial,
          tgvCarmineRedMaterial,
          whitePinstripeMaterial,
          darkSkirtingMaterial,
          windowGlassMaterial,
          redTailLedMaterial,
          bogieFrameMaterial
        )
      } else {
        this.buildTgvDuplexCoach(
          bodyMeshGroup,
          len,
          w,
          h,
          tgvSilverMaterial,
          tgvRoyalBlueMaterial,
          tgvCarmineRedMaterial,
          whitePinstripeMaterial,
          darkSkirtingMaterial,
          windowGlassMaterial,
          cabinGlowMaterial
        )
      }

      carGroup.add(bodyMeshGroup)

      // Bogies & Running Wheelsets
      const isPower: boolean = cfg.type.startsWith('power')
      const bodyZCenter: number = cfg.type === 'power-lead' ? -2.1 : cfg.type === 'power-tail' ? 2.1 : 0
      const bogieSpan: number = isPower ? 7.2 : 6.8
      const bogieZPositions: number[] = [-bogieSpan * 0.5, bogieSpan * 0.5]

      bogieZPositions.forEach((bogieZ: number) => {
        this.buildBogie(
          carGroup,
          wheels,
          bogieZ + bodyZCenter,
          bogieFrameMaterial,
          steelWheelMaterial
        )
      })

      // Heavy-Duty Articulated Rubber Gangway Bellows between Cars
      if (carIndex < carConfigs.length - 1) {
        const bellowGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(
          w * 0.45,
          w * 0.45,
          0.58,
          20
        )
        this.disposables.push(bellowGeo)
        const bellowMesh: THREE.Mesh = new THREE.Mesh(bellowGeo, bellowMaterial)
        bellowMesh.rotation.x = Math.PI / 2
        bellowMesh.position.set(0, 1.45, -len * 0.5 - 0.29 + bodyZCenter)
        carGroup.add(bellowMesh)
      }

      this.cars.push({
        group: carGroup,
        offsetLength: currentOffset,
        wheels,
        bodyMeshGroup,
      })

      this.group.add(carGroup)
      currentOffset += len + 0.60
    })
  }

  // --- 5. BUILD POWER CAR (HIGH-SPEED TGV LOCOMOTIVE) ---
  private buildTgvPowerCar(
    bodyMeshGroup: THREE.Group,
    isLead: boolean,
    len: number,
    w: number,
    h: number,
    silverMat: THREE.Material,
    blueMat: THREE.Material,
    carmineMat: THREE.Material,
    whiteMat: THREE.Material,
    skirtMat: THREE.Material,
    glassMat: THREE.Material,
    redLedMat: THREE.Material,
    frameMat: THREE.Material
  ): void {
    const dir: number = isLead ? 1 : -1
    const noseLen: number = 4.2
    const bodyLen: number = len - noseLen // 7.6m straight carbody
    const bodyZCenter: number = isLead ? -2.1 : 2.1
    const noseAttachZ: number = isLead ? bodyZCenter + bodyLen * 0.5 : bodyZCenter - bodyLen * 0.5

    // 1. Aerodynamic Curved Carbody (Extruded Profile with Bevels)
    const fuselageShape: THREE.Shape = this.createPowerCarFuselageShape(w, h)
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: bodyLen,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }
    const fuselageGeo: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry(fuselageShape, extrudeSettings)
    this.disposables.push(fuselageGeo)

    // Upper Metallic Silver Fuselage Shell
    const fuselageMesh: THREE.Mesh = new THREE.Mesh(fuselageGeo, silverMat)
    fuselageMesh.position.set(0, 0, bodyZCenter - bodyLen * 0.5)
    bodyMeshGroup.add(fuselageMesh)

    // Lower Royal Blue Body Band (Plates following the waist profile)
    for (const sideX of [-w * 0.5 - 0.015, w * 0.5 + 0.015]) {
      const bluePlateGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.03, 0.74, bodyLen)
      this.disposables.push(bluePlateGeo)
      const bluePlate: THREE.Mesh = new THREE.Mesh(bluePlateGeo, blueMat)
      bluePlate.position.set(sideX, 0.96, bodyZCenter)
      bodyMeshGroup.add(bluePlate)

      // Fine White Accent Pinstripe along bottom of blue band
      const pinstripeGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.04, 0.05, bodyLen)
      this.disposables.push(pinstripeGeo)
      const pinstripe: THREE.Mesh = new THREE.Mesh(pinstripeGeo, whiteMat)
      pinstripe.position.set(sideX, 0.58, bodyZCenter)
      bodyMeshGroup.add(pinstripe)

      // Dark Slate Skirt Plate
      const skirtGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.035, 0.36, bodyLen - 0.3)
      this.disposables.push(skirtGeo)
      const skirtMesh: THREE.Mesh = new THREE.Mesh(skirtGeo, skirtMat)
      skirtMesh.position.set(sideX, 0.36, bodyZCenter)
      bodyMeshGroup.add(skirtMesh)
    }

    // Roof Ventilation Louvers along upper flanks
    const louverTex: THREE.CanvasTexture = this.createLouverTexture()
    louverTex.repeat.set(8, 1)
    const louverMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: louverTex })
    this.disposables.push(louverMat)

    for (const sideX of [-w * 0.5 * 0.88, w * 0.5 * 0.88]) {
      const louverGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(bodyLen - 1.4, 0.34)
      this.disposables.push(louverGeo)
      const louverMesh: THREE.Mesh = new THREE.Mesh(louverGeo, louverMat)
      louverMesh.position.set(sideX, h - 0.14, bodyZCenter)
      louverMesh.rotation.y = sideX > 0 ? Math.PI / 2 : -Math.PI / 2
      bodyMeshGroup.add(louverMesh)
    }

    // SNCF Carmillon Carmine Red Badge & TGV Logo on Locomotive Flank
    const badgeTex: THREE.CanvasTexture = this.createTgvBadgeTexture()
    const badgeMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      map: badgeTex,
      transparent: true,
      side: THREE.DoubleSide,
    })
    this.disposables.push(badgeMat)

    for (const sideX of [-w * 0.5 - 0.02, w * 0.5 + 0.02]) {
      const badgeGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(1.6, 0.8)
      this.disposables.push(badgeGeo)
      const badgeMesh: THREE.Mesh = new THREE.Mesh(badgeGeo, badgeMat)
      const badgeZ: number = isLead
        ? bodyZCenter + bodyLen * 0.5 - 1.4
        : bodyZCenter - bodyLen * 0.5 + 1.4
      badgeMesh.position.set(sideX, 0.96, badgeZ)
      badgeMesh.rotation.y = sideX > 0 ? Math.PI / 2 : -Math.PI / 2
      bodyMeshGroup.add(badgeMesh)
    }

    // 2. WATERTIGHT SCULPTED AERODYNAMIC TGV NOSE
    const noseSurfaces = this.createTgvSculptedNoseSurfaces(dir)

    // Upper Metallic Silver Hood & Roof Crown
    const hoodMesh: THREE.Mesh = new THREE.Mesh(noseSurfaces.upperSilverGeo, silverMat)
    hoodMesh.position.set(0, 0, noseAttachZ)
    bodyMeshGroup.add(hoodMesh)

    // Middle Royal Blue Apron & Chin
    const blueBandMesh: THREE.Mesh = new THREE.Mesh(noseSurfaces.lowerBlueGeo, blueMat)
    blueBandMesh.position.set(0, 0, noseAttachZ)
    bodyMeshGroup.add(blueBandMesh)

    // Lower Dark Charcoal Pilot Cowcatcher & Snowplow
    const chinPilotMesh: THREE.Mesh = new THREE.Mesh(noseSurfaces.skirtPilotGeo, skirtMat)
    chinPilotMesh.position.set(0, 0, noseAttachZ)
    bodyMeshGroup.add(chinPilotMesh)

    // Fine White Dividing Pinstripe wrapping around the nose
    const nosePinstripeMesh: THREE.Mesh = new THREE.Mesh(noseSurfaces.pinstripeGeo, whiteMat)
    nosePinstripeMesh.position.set(0, 0, noseAttachZ)
    bodyMeshGroup.add(nosePinstripeMesh)

    // Front Coupler Hatch Cover Panel Lines
    const hatchGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.36, 0.42, 0.14, 18)
    this.disposables.push(hatchGeo)
    const hatchMesh: THREE.Mesh = new THREE.Mesh(hatchGeo, silverMat)
    hatchMesh.rotation.x = Math.PI / 2
    hatchMesh.position.set(0, 0.70, noseAttachZ + dir * 4.18)
    bodyMeshGroup.add(hatchMesh)

    // Fleet Number Badge ("802" in center below windshield)
    const fleetTex: THREE.CanvasTexture = this.createFleetNumberTexture()
    const fleetMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: fleetTex })
    this.disposables.push(fleetMat)
    const fleetBadgeGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.52, 0.26)
    this.disposables.push(fleetBadgeGeo)
    const fleetBadge: THREE.Mesh = new THREE.Mesh(fleetBadgeGeo, fleetMat)
    fleetBadge.position.set(0, 1.15, noseAttachZ + dir * 2.7)
    fleetBadge.rotation.x = dir * (-Math.PI / 2 + 0.60)
    bodyMeshGroup.add(fleetBadge)

    // 3. FLUSH SWEPT-BACK PANORAMIC TGV COCKPIT WINDSHIELD
    const windshieldGroup: THREE.Group = new THREE.Group()
    windshieldGroup.position.set(0, 1.64, noseAttachZ + dir * 0.95)

    // Outer Dark Ceramic Frits / Rubber Frame
    const frameGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      w * 0.44,
      w * 0.50,
      1.25,
      20,
      1,
      false,
      Math.PI * 0.08,
      Math.PI * 0.84
    )
    this.disposables.push(frameGeo)
    const frameMesh: THREE.Mesh = new THREE.Mesh(frameGeo, skirtMat)
    frameMesh.rotation.z = Math.PI / 2
    frameMesh.rotation.x = dir * 0.56
    windshieldGroup.add(frameMesh)

    // Tinted Panoramic Glass Window
    const glassGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      w * 0.43,
      w * 0.49,
      1.16,
      20,
      1,
      false,
      Math.PI * 0.10,
      Math.PI * 0.80
    )
    this.disposables.push(glassGeo)
    const glassMesh: THREE.Mesh = new THREE.Mesh(glassGeo, glassMat)
    glassMesh.rotation.z = Math.PI / 2
    glassMesh.rotation.x = dir * 0.56
    windshieldGroup.add(glassMesh)

    // Realistic Twin Windshield Wiper Blades
    for (const wx of [-0.35, 0.35]) {
      const wiperGroup: THREE.Group = new THREE.Group()
      wiperGroup.position.set(wx, -0.42, dir * 0.28)
      wiperGroup.rotation.x = dir * 0.56
      wiperGroup.rotation.z = wx > 0 ? 0.35 : -0.35

      const armGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.025, 0.62, 0.02)
      this.disposables.push(armGeo)
      const armMesh: THREE.Mesh = new THREE.Mesh(armGeo, skirtMat)
      armMesh.position.set(0, 0.31, 0)
      wiperGroup.add(armMesh)

      const bladeGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.015, 0.58, 0.025)
      this.disposables.push(bladeGeo)
      const bladeMesh: THREE.Mesh = new THREE.Mesh(bladeGeo, skirtMat)
      bladeMesh.position.set(0, 0.31, 0.015)
      wiperGroup.add(bladeMesh)

      windshieldGroup.add(wiperGroup)
    }

    bodyMeshGroup.add(windshieldGroup)

    // Side Crew Windows & Aerodynamic Teardrop Rearview Camera Pods
    for (const sideX of [-w * 0.5 * 0.94, w * 0.5 * 0.94]) {
      const cabWinGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.72, 0.38)
      this.disposables.push(cabWinGeo)
      const cabWin: THREE.Mesh = new THREE.Mesh(cabWinGeo, glassMat)
      cabWin.position.set(sideX, 1.58, noseAttachZ + dir * 0.15)
      cabWin.rotation.y = sideX > 0 ? Math.PI / 2 : -Math.PI / 2
      bodyMeshGroup.add(cabWin)

      const cameraGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.12, 0.16, 0.24)
      this.disposables.push(cameraGeo)
      const cameraMesh: THREE.Mesh = new THREE.Mesh(cameraGeo, silverMat)
      cameraMesh.position.set(sideX > 0 ? sideX + 0.12 : sideX - 0.12, 1.60, noseAttachZ + dir * 0.52)
      bodyMeshGroup.add(cameraMesh)
    }

    // Cab Door Seam
    for (const sideX of [-w * 0.5 - 0.015, w * 0.5 + 0.015]) {
      const doorLineGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.015, 1.35, 0.03)
      this.disposables.push(doorLineGeo)
      const doorLine: THREE.Mesh = new THREE.Mesh(doorLineGeo, carmineMat)
      doorLine.position.set(sideX, 1.15, noseAttachZ - dir * 0.75)
      bodyMeshGroup.add(doorLine)
    }

    // Tail Marker Red LED Lights (Zero front headlights, rear markers only)
    if (!isLead) {
      const tailRibbonGeo: THREE.BoxGeometry = new THREE.BoxGeometry(w * 0.65, 0.08, 0.05)
      this.disposables.push(tailRibbonGeo)
      const tailRibbon: THREE.Mesh = new THREE.Mesh(tailRibbonGeo, redLedMat)
      tailRibbon.position.set(0, 0.90, noseAttachZ - 3.8)
      bodyMeshGroup.add(tailRibbon)
    }

    // 4. ROOF PANTOGRAPH WELL & AERODYNAMIC SPOILER FAIRING
    // Aerodynamic curved transition ramp linking the power car to the taller duplex passenger coach
    const transitionGeo: THREE.ConeGeometry = new THREE.ConeGeometry(w * 0.52, 1.6, 18)
    this.disposables.push(transitionGeo)
    const transitionMesh: THREE.Mesh = new THREE.Mesh(transitionGeo, silverMat)
    const transitionZ: number = isLead ? bodyZCenter - bodyLen * 0.5 + 0.8 : bodyZCenter + bodyLen * 0.5 - 0.8
    transitionMesh.rotation.x = isLead ? -Math.PI / 2 + 0.25 : Math.PI / 2 - 0.25
    transitionMesh.position.set(0, h + 0.24, transitionZ)
    transitionMesh.scale.set(0.95, 1.0, 0.35)
    bodyMeshGroup.add(transitionMesh)

    if (isLead) {
      const pantograph: THREE.Group = this.createTgvPantograph(frameMat)
      pantograph.position.set(0, h + 0.05, bodyZCenter - bodyLen * 0.25)
      bodyMeshGroup.add(pantograph)

      for (const iz of [-0.65, 0.15, 0.75]) {
        const insGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.18, 8)
        this.disposables.push(insGeo)
        const insMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xd97706 })
        this.disposables.push(insMat)
        const ins: THREE.Mesh = new THREE.Mesh(insGeo, insMat)
        ins.position.set(0.45, h + 0.14, bodyZCenter - bodyLen * 0.25 + iz)
        bodyMeshGroup.add(ins)
      }

      this.pantographSpark = new THREE.PointLight(0x7dd3fc, 0, 10)
      this.pantographSpark.position.set(0, h + 1.85, bodyZCenter - bodyLen * 0.25 - 0.35)
      bodyMeshGroup.add(this.pantographSpark)
    }
  }

  // --- 6. BUILD TGV DUPLEX DOUBLE-DECKER PASSENGER COACH ---
  private buildTgvDuplexCoach(
    bodyMeshGroup: THREE.Group,
    len: number,
    w: number,
    h: number,
    silverMat: THREE.Material,
    blueMat: THREE.Material,
    carmineMat: THREE.Material,
    whiteMat: THREE.Material,
    skirtMat: THREE.Material,
    glassMat: THREE.Material,
    glowMat: THREE.Material
  ): void {
    const coachBodyLen: number = len - 0.25

    // 1. Aerodynamic Curved Double-Decker Fuselage (Extruded Profile)
    const coachShape: THREE.Shape = this.createDuplexCoachFuselageShape(w, h)
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: coachBodyLen,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }
    const coachGeo: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry(coachShape, extrudeSettings)
    this.disposables.push(coachGeo)

    // Upper Metallic Silver Fuselage Shell
    const coachMesh: THREE.Mesh = new THREE.Mesh(coachGeo, silverMat)
    coachMesh.position.set(0, 0, -coachBodyLen * 0.5)
    bodyMeshGroup.add(coachMesh)

    // Lower Level Royal Blue Side Band
    for (const sideX of [-w * 0.5 - 0.015, w * 0.5 + 0.015]) {
      const bluePlateGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.03, 1.08, coachBodyLen)
      this.disposables.push(bluePlateGeo)
      const bluePlate: THREE.Mesh = new THREE.Mesh(bluePlateGeo, blueMat)
      bluePlate.position.set(sideX, 1.08, 0)
      bodyMeshGroup.add(bluePlate)

      // Fine White Accent Pinstripe separating decks
      const pinstripeGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.04, 0.05, coachBodyLen)
      this.disposables.push(pinstripeGeo)
      const pinstripe: THREE.Mesh = new THREE.Mesh(pinstripeGeo, whiteMat)
      pinstripe.position.set(sideX, 0.56, 0)
      bodyMeshGroup.add(pinstripe)

      // Dark Skirt Plate
      const skirtGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.04, 0.40, coachBodyLen - 0.2)
      this.disposables.push(skirtGeo)
      const skirtMesh: THREE.Mesh = new THREE.Mesh(skirtGeo, skirtMat)
      skirtMesh.position.set(sideX, 0.35, 0)
      bodyMeshGroup.add(skirtMesh)
    }

    // 2. SIGNATURE CARMINE RED PASSENGER ENTRY DOORS (Matching user photo)
    const doorZOffsets: number[] = [-coachBodyLen * 0.5 + 0.95, coachBodyLen * 0.5 - 0.95]
    doorZOffsets.forEach((doorZ: number) => {
      for (const sideX of [-w * 0.5 - 0.02, w * 0.5 + 0.02]) {
        // Red door panel
        const doorGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.038, 1.95, 0.96)
        this.disposables.push(doorGeo)
        const doorMesh: THREE.Mesh = new THREE.Mesh(doorGeo, carmineMat)
        doorMesh.position.set(sideX, 1.38, doorZ)
        bodyMeshGroup.add(doorMesh)

        // Door vertical tinted window
        const doorWinGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.38, 0.65)
        this.disposables.push(doorWinGeo)
        const doorWin: THREE.Mesh = new THREE.Mesh(doorWinGeo, glassMat)
        doorWin.position.set(sideX > 0 ? sideX + 0.022 : sideX - 0.022, 1.60, doorZ)
        doorWin.rotation.y = sideX > 0 ? Math.PI / 2 : -Math.PI / 2
        bodyMeshGroup.add(doorWin)

        // Polished vertical door grab handle
        const handleGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8)
        this.disposables.push(handleGeo)
        const handleMesh: THREE.Mesh = new THREE.Mesh(handleGeo, silverMat)
        handleMesh.position.set(sideX > 0 ? sideX + 0.03 : sideX - 0.03, 1.30, doorZ - 0.35)
        bodyMeshGroup.add(handleMesh)
      }
    })

    // 3. DUAL-DECK ROWS OF TINTED PASSENGER WINDOWS
    const winSpanLen: number = coachBodyLen - 3.2
    const windowCols: number = 8
    const windowSpacing: number = winSpanLen / windowCols

    for (let c: number = 0; c < windowCols; c++) {
      const winZ: number = -winSpanLen * 0.5 + (c + 0.5) * windowSpacing

      // Upper Deck Windows: Tumblehome slant in silver section
      const upperSideX: number = (w * 0.5) * 0.94
      for (const sign of [-1, 1]) {
        const xPos: number = sign * (upperSideX + 0.015)
        const rotY: number = sign > 0 ? Math.PI / 2 : -Math.PI / 2

        const upperWinGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.82, 0.46)
        this.disposables.push(upperWinGeo)
        const upperWin: THREE.Mesh = new THREE.Mesh(upperWinGeo, glassMat)
        upperWin.position.set(xPos, 2.12, winZ)
        upperWin.rotation.y = rotY
        bodyMeshGroup.add(upperWin)
      }

      // Lower Deck Windows: In Royal Blue section
      const lowerSideX: number = (w * 0.5) * 1.01
      for (const sign of [-1, 1]) {
        const xPos: number = sign * (lowerSideX + 0.015)
        const rotY: number = sign > 0 ? Math.PI / 2 : -Math.PI / 2

        const lowerWinGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.82, 0.46)
        this.disposables.push(lowerWinGeo)
        const lowerWin: THREE.Mesh = new THREE.Mesh(lowerWinGeo, glassMat)
        lowerWin.position.set(xPos, 1.05, winZ)
        lowerWin.rotation.y = rotY
        bodyMeshGroup.add(lowerWin)
      }
    }

    // Warm Interior Ambient Glow
    for (const sideX of [-w * 0.5 + 0.04, w * 0.5 - 0.04]) {
      const upperGlowGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.02, 0.28, winSpanLen)
      this.disposables.push(upperGlowGeo)
      const upperGlow: THREE.Mesh = new THREE.Mesh(upperGlowGeo, glowMat)
      upperGlow.position.set(sideX, 2.12, 0)
      bodyMeshGroup.add(upperGlow)

      const lowerGlowGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.02, 0.28, winSpanLen)
      this.disposables.push(lowerGlowGeo)
      const lowerGlow: THREE.Mesh = new THREE.Mesh(lowerGlowGeo, glowMat)
      lowerGlow.position.set(sideX, 1.05, 0)
      bodyMeshGroup.add(lowerGlow)
    }

    // 4. Roof Corrugated Stiffener Ribs (Fluting along the roof crown)
    for (const rx of [-0.65, -0.22, 0.22, 0.65]) {
      const ribGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.04, 0.04, coachBodyLen - 0.4)
      this.disposables.push(ribGeo)
      const ribMesh: THREE.Mesh = new THREE.Mesh(ribGeo, silverMat)
      ribMesh.position.set(rx, h + 0.12, 0)
      bodyMeshGroup.add(ribMesh)
    }

    // Streamlined Aerodynamic Roof HVAC Fairings
    for (const zOffset of [-coachBodyLen * 0.28, coachBodyLen * 0.28]) {
      const hvacGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.68, 0.68, 1.8, 18)
      this.disposables.push(hvacGeo)
      const hvacMesh: THREE.Mesh = new THREE.Mesh(hvacGeo, silverMat)
      hvacMesh.rotation.x = Math.PI / 2
      hvacMesh.scale.set(1.0, 0.26, 1.0)
      hvacMesh.position.set(0, h + 0.14, zOffset)
      bodyMeshGroup.add(hvacMesh)
    }
  }

  // --- 7. STEEL BOGIE TRUCK WITH 4 WHEELS ---
  private buildBogie(
    carGroup: THREE.Group,
    wheels: THREE.Group[],
    bogieZ: number,
    frameMat: THREE.Material,
    wheelMat: THREE.Material
  ): void {
    const bogieGroup: THREE.Group = new THREE.Group()
    bogieGroup.position.set(0, 0.38, bogieZ)

    // Steel H-Frame
    const frameCenterGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.85, 0.12, 0.35)
    const frameSideGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.16, 0.20, 2.3)
    this.disposables.push(frameCenterGeo, frameSideGeo)

    const centerFrame: THREE.Mesh = new THREE.Mesh(frameCenterGeo, frameMat)
    bogieGroup.add(centerFrame)

    for (const sideX of [-0.92, 0.92]) {
      const sideFrame: THREE.Mesh = new THREE.Mesh(frameSideGeo, frameMat)
      sideFrame.position.set(sideX, 0, 0)
      bogieGroup.add(sideFrame)
    }

    // Suspension Springs
    for (const sideX of [-0.92, 0.92]) {
      const springGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 8)
      this.disposables.push(springGeo)
      const spring: THREE.Mesh = new THREE.Mesh(springGeo, wheelMat)
      spring.position.set(sideX, 0.18, 0)
      bogieGroup.add(spring)
    }

    // 2 Axles per Bogie
    const axleZPositions: number[] = [-0.85, 0.85]
    axleZPositions.forEach((axleZ: number) => {
      const axleGroup: THREE.Group = new THREE.Group()
      axleGroup.position.set(0, 0, axleZ)

      const axleBarGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.055, 0.055, 2.05, 8)
      this.disposables.push(axleBarGeo)
      const axleBar: THREE.Mesh = new THREE.Mesh(axleBarGeo, frameMat)
      axleBar.rotation.z = Math.PI / 2
      axleGroup.add(axleBar)

      // Polished Steel Wheels on left & right
      for (const wheelX of [-1.0, 1.0]) {
        const wheelMeshGroup: THREE.Group = new THREE.Group()
        wheelMeshGroup.position.set(wheelX, 0, 0)

        const wheelTreadGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(
          TRAIN_SPECS.wheelRadius,
          TRAIN_SPECS.wheelRadius,
          0.13,
          20
        )
        this.disposables.push(wheelTreadGeo)
        const wheelTread: THREE.Mesh = new THREE.Mesh(wheelTreadGeo, wheelMat)
        wheelTread.rotation.z = Math.PI / 2
        wheelMeshGroup.add(wheelTread)

        const hubGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.15, 12)
        this.disposables.push(hubGeo)
        const hub: THREE.Mesh = new THREE.Mesh(hubGeo, frameMat)
        hub.rotation.z = Math.PI / 2
        wheelMeshGroup.add(hub)

        axleGroup.add(wheelMeshGroup)
      }

      wheels.push(axleGroup)
      bogieGroup.add(axleGroup)
    })

    carGroup.add(bogieGroup)
  }

  // --- 8. TGV SINGLE-ARM HIGH-SPEED PANTOGRAPH ---
  private createTgvPantograph(material: THREE.Material): THREE.Group {
    const group: THREE.Group = new THREE.Group()

    const baseGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.5, 0.06, 1.1)
    this.disposables.push(baseGeo)
    const baseMesh: THREE.Mesh = new THREE.Mesh(baseGeo, material)
    baseMesh.position.set(0, 0.04, 0)
    group.add(baseMesh)

    const lowerArmGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.35, 8)
    this.disposables.push(lowerArmGeo)
    const lowerArm: THREE.Mesh = new THREE.Mesh(lowerArmGeo, material)
    lowerArm.rotation.x = 0.52
    lowerArm.position.set(0, 0.58, 0.32)
    group.add(lowerArm)

    const upperArmGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.035, 0.035, 1.3, 8)
    this.disposables.push(upperArmGeo)
    const upperArm: THREE.Mesh = new THREE.Mesh(upperArmGeo, material)
    upperArm.rotation.x = -0.52
    upperArm.position.set(0, 1.22, -0.3)
    group.add(upperArm)

    const hornGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.95, 0.05, 0.12)
    this.disposables.push(hornGeo)
    const hornMesh: THREE.Mesh = new THREE.Mesh(hornGeo, material)
    hornMesh.position.set(0, 1.62, -0.35)
    group.add(hornMesh)

    return group
  }

  public update(curve: THREE.CatmullRomCurve3, leadT: number, speed: number = 0.001): void {
    const totalCurveLength: number = curve.getLength()
    this.wheelRotation += speed * 55

    if (this.pantographSpark) {
      if (speed > 0.002 && Math.random() > 0.95) {
        this.pantographSpark.intensity = 3.5 + Math.random() * 2.5
      } else {
        this.pantographSpark.intensity = Math.max(0, this.pantographSpark.intensity * 0.7)
      }
    }

    this.cars.forEach((car: CarInstance) => {
      const carT: number = Math.max(
        0.001,
        Math.min(0.999, leadT - car.offsetLength / totalCurveLength)
      )
      const pos: THREE.Vector3 = curve.getPointAt(carT)
      const tangent: THREE.Vector3 = curve.getTangentAt(carT).normalize()

      // Active dynamic aerodynamic banking into curves
      const forwardT: number = Math.min(0.999, carT + 0.008)
      const forwardTangent: THREE.Vector3 = curve.getTangentAt(forwardT).normalize()
      const curvature: number = tangent.x * forwardTangent.z - tangent.z * forwardTangent.x
      const targetBankAngle: number = Math.max(-0.08, Math.min(0.08, curvature * 2.8))

      car.group.position.copy(pos)

      // Look along track tangent direction
      const lookTarget: THREE.Vector3 = pos.clone().add(tangent)
      car.group.lookAt(lookTarget)

      // Apply dynamic banking to carriage body
      car.bodyMeshGroup.rotation.z = THREE.MathUtils.lerp(
        car.bodyMeshGroup.rotation.z,
        targetBankAngle,
        0.12
      )

      // Spin wheelsets smoothly
      car.wheels.forEach((wheel: THREE.Group) => {
        wheel.rotation.x = this.wheelRotation
      })
    })
  }

  public getLeadPosition(): THREE.Vector3 {
    return this.cars[0]?.group.position.clone() || new THREE.Vector3()
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose()
    }
    this.group.clear()
  }
}
