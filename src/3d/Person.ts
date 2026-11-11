import * as THREE from 'three'

export type PersonPose =
  | 'standing-casual'
  | 'standing-phone'
  | 'walking-stride'
  | 'sitting-bench'
  | 'holding-coffee'
  | 'rolling-luggage'
  | 'hands-in-pocket'

export type HairStyle =
  | 'short-crop'
  | 'side-part'
  | 'ponytail'
  | 'baseball-cap'
  | 'beanie'

export interface PersonConfig {
  pose?: PersonPose
  skinTone?: number
  hairColor?: number
  hairStyle?: HairStyle
  shirtColor?: number
  jacketColor?: number
  pantsColor?: number
  shoeColor?: number
  soleColor?: number
  hasSunglasses?: boolean
  hasHeadphones?: boolean
  hasBackpack?: boolean
  hasMessengerBag?: boolean
  hasLuggage?: boolean
  hasCoffee?: boolean
  hasPhone?: boolean
}

// Diverse palette of authentic human skin tones
export const SKIN_TONES: number[] = [
  0xfde2d1, // Fair porcelain
  0xf6c8a5, // Warm peach
  0xdfa075, // Golden olive
  0xc78252, // Warm caramel
  0x945428, // Rich bronze
  0x5c3214, // Deep espresso
]

// Modern wardrobe palette
export const HAIR_COLORS: number[] = [
  0x171717, // Jet black
  0x291d18, // Dark espresso brown
  0x4a2c11, // Chestnut brown
  0x78350f, // Warm amber brown
  0xd97706, // Honey blonde
  0x94a3b8, // Silver platinum
]

export const SHIRT_COLORS: number[] = [
  0xffffff, // Crisp white oxford
  0x0284c7, // Sky azure shirt
  0x0ea5e9, // Ocean cyan
  0x10b981, // Emerald green
  0xf59e0b, // Amber gold sweater
  0xef4444, // Crimson red polo
  0x6366f1, // Indigo knit
  0xec4899, // Rose pink
  0x475569, // Slate grey tee
  0x1e293b, // Dark charcoal
]

export const JACKET_COLORS: number[] = [
  0x0f172a, // Midnight navy blazer
  0x334155, // Charcoal trench coat
  0x78350f, // Tan camel jacket
  0x1e3a8a, // Deep royal blazer
  0x14532d, // Forest green parka
]

export const PANTS_COLORS: number[] = [
  0x1e3a8a, // Dark indigo denim jeans
  0x2563eb, // Classic blue jeans
  0x1e293b, // Formal black slacks
  0x334155, // Charcoal chinos
  0xd4b996, // Khaki beige trousers
  0x475569, // Slate trousers
]

export function createRealisticPerson(
  config: PersonConfig,
  disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[]
): THREE.Group {
  const rootGroup: THREE.Group = new THREE.Group()

  const pose: PersonPose = config.pose ?? 'standing-casual'
  const skinColor: number = config.skinTone ?? SKIN_TONES[1]
  const hairColor: number = config.hairColor ?? HAIR_COLORS[1]
  const hairStyle: HairStyle = config.hairStyle ?? 'short-crop'
  const shirtColor: number = config.shirtColor ?? SHIRT_COLORS[0]
  const pantsColor: number = config.pantsColor ?? PANTS_COLORS[0]
  const shoeColor: number = config.shoeColor ?? 0x1e293b
  const soleColor: number = config.soleColor ?? 0xf8fafc
  const hasJacket: boolean = config.jacketColor !== undefined

  // PBR Materials
  const skinMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.65,
    metalness: 0.05,
  })
  const hairMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.85,
    metalness: 0.05,
  })
  const shirtMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: shirtColor,
    roughness: 0.75,
    metalness: 0.02,
  })
  const pantsMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: pantsColor,
    roughness: 0.80,
    metalness: 0.02,
  })
  const shoeUpperMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: shoeColor,
    roughness: 0.60,
    metalness: 0.10,
  })
  const soleMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: soleColor,
    roughness: 0.50,
  })
  const darkDetailMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.40,
    metalness: 0.30,
  })
  const metallicMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.20,
    metalness: 0.90,
  })

  disposables.push(
    skinMat,
    hairMat,
    shirtMat,
    pantsMat,
    shoeUpperMat,
    soleMat,
    darkDetailMat,
    metallicMat
  )

  let jacketMat: THREE.MeshStandardMaterial | null = null
  if (hasJacket && config.jacketColor !== undefined) {
    jacketMat = new THREE.MeshStandardMaterial({
      color: config.jacketColor,
      roughness: 0.70,
      metalness: 0.05,
    })
    disposables.push(jacketMat)
  }

  // --- 1. PELVIS & LOWER BODY ---
  const isSitting: boolean = pose === 'sitting-bench'
  const isWalking: boolean = pose === 'walking-stride'

  // Height adjustment: sitting drops body down to bench top
  const pelvisY: number = isSitting ? 0.48 : 0.80
  const pelvisZ: number = isSitting ? 0.08 : 0.0

  const pelvisGroup: THREE.Group = new THREE.Group()
  pelvisGroup.position.set(0, pelvisY, pelvisZ)
  rootGroup.add(pelvisGroup)

  // Belt / Waistband
  const beltGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.31, 0.05, 0.20)
  disposables.push(beltGeo)
  const beltMesh: THREE.Mesh = new THREE.Mesh(beltGeo, darkDetailMat)
  beltMesh.position.set(0, 0.03, 0)
  pelvisGroup.add(beltMesh)

  const buckleGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.06, 0.045, 0.015)
  disposables.push(buckleGeo)
  const buckleMesh: THREE.Mesh = new THREE.Mesh(buckleGeo, metallicMat)
  buckleMesh.position.set(0, 0.03, 0.108)
  pelvisGroup.add(buckleMesh)

  // Pelvis Core Block
  const pelvisGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.30, 0.14, 0.19)
  disposables.push(pelvisGeo)
  const pelvisMesh: THREE.Mesh = new THREE.Mesh(pelvisGeo, pantsMat)
  pelvisMesh.position.set(0, -0.06, 0)
  pelvisGroup.add(pelvisMesh)

  // Legs (Thigh + Knee + Calf + Shoe)
  const legSpacingX: number = 0.095

  for (const side of [-1, 1]) {
    const legRoot: THREE.Group = new THREE.Group()
    legRoot.position.set(side * legSpacingX, -0.10, 0)

    if (isSitting) {
      // Sitting Pose: Thigh horizontal forward, calf vertical downward
      legRoot.rotation.x = Math.PI * 0.48

      // Thigh
      const thighGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.062, 0.052, 0.38, 10)
      disposables.push(thighGeo)
      const thigh: THREE.Mesh = new THREE.Mesh(thighGeo, pantsMat)
      thigh.position.set(0, -0.19, 0)
      legRoot.add(thigh)

      // Knee Joint & Calf
      const calfGroup: THREE.Group = new THREE.Group()
      calfGroup.position.set(0, -0.38, 0)
      calfGroup.rotation.x = -Math.PI * 0.48

      const calfGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.052, 0.044, 0.38, 10)
      disposables.push(calfGeo)
      const calf: THREE.Mesh = new THREE.Mesh(calfGeo, pantsMat)
      calf.position.set(0, -0.19, 0)
      calfGroup.add(calf)

      // Shoe at foot base
      const shoeGroup: THREE.Group = createShoe(shoeUpperMat, soleMat, disposables)
      shoeGroup.position.set(0, -0.40, 0.03)
      calfGroup.add(shoeGroup)

      legRoot.add(calfGroup)
    } else if (isWalking) {
      // Walking Stride: Left leg forward, right leg backward
      const strideAngle: number = side > 0 ? 0.38 : -0.36
      legRoot.rotation.x = strideAngle

      const thighGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.062, 0.052, 0.38, 10)
      disposables.push(thighGeo)
      const thigh: THREE.Mesh = new THREE.Mesh(thighGeo, pantsMat)
      thigh.position.set(0, -0.19, 0)
      legRoot.add(thigh)

      const calfGroup: THREE.Group = new THREE.Group()
      calfGroup.position.set(0, -0.38, 0)
      calfGroup.rotation.x = side > 0 ? -0.18 : 0.22

      const calfGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.052, 0.044, 0.38, 10)
      disposables.push(calfGeo)
      const calf: THREE.Mesh = new THREE.Mesh(calfGeo, pantsMat)
      calf.position.set(0, -0.19, 0)
      calfGroup.add(calf)

      const shoeGroup: THREE.Group = createShoe(shoeUpperMat, soleMat, disposables)
      shoeGroup.position.set(0, -0.40, 0.03)
      calfGroup.add(shoeGroup)

      legRoot.add(calfGroup)
    } else {
      // Standing Natural Contrapposto Stance
      const relaxAngle: number = side > 0 ? 0.04 : -0.02
      legRoot.rotation.z = relaxAngle * 0.6
      legRoot.rotation.x = side > 0 ? 0.03 : -0.02

      const thighGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.062, 0.052, 0.38, 10)
      disposables.push(thighGeo)
      const thigh: THREE.Mesh = new THREE.Mesh(thighGeo, pantsMat)
      thigh.position.set(0, -0.19, 0)
      legRoot.add(thigh)

      const calfGroup: THREE.Group = new THREE.Group()
      calfGroup.position.set(0, -0.38, 0)

      const calfGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.052, 0.044, 0.38, 10)
      disposables.push(calfGeo)
      const calf: THREE.Mesh = new THREE.Mesh(calfGeo, pantsMat)
      calf.position.set(0, -0.19, 0)
      calfGroup.add(calf)

      const shoeGroup: THREE.Group = createShoe(shoeUpperMat, soleMat, disposables)
      shoeGroup.position.set(0, -0.40, 0.03)
      calfGroup.add(shoeGroup)

      legRoot.add(calfGroup)
    }

    pelvisGroup.add(legRoot)
  }

  // --- 2. TORSO & UPPER BODY ---
  const upperBodyMat: THREE.MeshStandardMaterial = jacketMat ?? shirtMat
  const torsoGroup: THREE.Group = new THREE.Group()
  torsoGroup.position.set(0, 0.05, 0)
  pelvisGroup.add(torsoGroup)

  // Lower Torso / Abdomen
  const lowerTorsoGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.31, 0.20, 0.19)
  disposables.push(lowerTorsoGeo)
  const lowerTorso: THREE.Mesh = new THREE.Mesh(lowerTorsoGeo, shirtMat)
  lowerTorso.position.set(0, 0.10, 0)
  torsoGroup.add(lowerTorso)

  // Upper Torso / Chest & Shoulders (Tapered trapezoid)
  const chestGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.36, 0.30, 0.22)
  disposables.push(chestGeo)
  const chest: THREE.Mesh = new THREE.Mesh(chestGeo, upperBodyMat)
  chest.position.set(0, 0.34, 0)
  torsoGroup.add(chest)

  // Jacket Lapels / Shirt Center Placket
  if (hasJacket && jacketMat) {
    const shirtCenterGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.12, 0.28, 0.02)
    disposables.push(shirtCenterGeo)
    const shirtCenter: THREE.Mesh = new THREE.Mesh(shirtCenterGeo, shirtMat)
    shirtCenter.position.set(0, 0.34, 0.111)
    torsoGroup.add(shirtCenter)
  }

  // Neck
  const neckGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.048, 0.054, 0.11, 10)
  disposables.push(neckGeo)
  const neck: THREE.Mesh = new THREE.Mesh(neckGeo, skinMat)
  neck.position.set(0, 0.52, 0)
  torsoGroup.add(neck)

  // Shirt Collar Band
  const collarGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.18, 0.04, 0.16)
  disposables.push(collarGeo)
  const collar: THREE.Mesh = new THREE.Mesh(collarGeo, shirtMat)
  collar.position.set(0, 0.49, 0)
  torsoGroup.add(collar)

  // --- 3. HEAD, HAIR & FACIAL ACCESSORIES ---
  const headGroup: THREE.Group = new THREE.Group()
  const headTilt: number = pose === 'standing-phone' ? 0.24 : 0.0
  headGroup.position.set(0, 0.65, 0)
  headGroup.rotation.x = headTilt
  torsoGroup.add(headGroup)

  // Anatomical Head
  const headGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.108, 14, 14)
  disposables.push(headGeo)
  const head: THREE.Mesh = new THREE.Mesh(headGeo, skinMat)
  head.scale.set(1.0, 1.14, 1.05)
  headGroup.add(head)

  // Nose Bridge Contour
  const noseGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.024, 0.045, 0.035)
  disposables.push(noseGeo)
  const noseMesh: THREE.Mesh = new THREE.Mesh(noseGeo, skinMat)
  noseMesh.position.set(0, 0.01, 0.112)
  headGroup.add(noseMesh)

  // Eyewear: Modern Sunglasses
  if (config.hasSunglasses) {
    const glassesGroup: THREE.Group = new THREE.Group()
    glassesGroup.position.set(0, 0.04, 0.105)

    const frameGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.19, 0.038, 0.03)
    disposables.push(frameGeo)
    const frame: THREE.Mesh = new THREE.Mesh(frameGeo, darkDetailMat)
    glassesGroup.add(frame)

    for (const sx of [-0.05, 0.05]) {
      const lensGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.055, 0.035, 0.015)
      disposables.push(lensGeo)
      const lens: THREE.Mesh = new THREE.Mesh(lensGeo, darkDetailMat)
      lens.position.set(sx, 0, 0.01)
      glassesGroup.add(lens)
    }

    headGroup.add(glassesGroup)
  }

  // Hairstyle / Headwear
  buildHairstyle(headGroup, hairStyle, hairMat, upperBodyMat, disposables)

  // Headphones / AirPods
  if (config.hasHeadphones) {
    const phoneBandGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.118, 0.118, 0.03, 14, 1, true, 0, Math.PI)
    disposables.push(phoneBandGeo)
    const band: THREE.Mesh = new THREE.Mesh(phoneBandGeo, darkDetailMat)
    band.rotation.z = Math.PI / 2
    band.position.set(0, 0.08, 0)
    headGroup.add(band)

    for (const sx of [-0.115, 0.115]) {
      const cupGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.038, 0.038, 0.035, 10)
      disposables.push(cupGeo)
      const cup: THREE.Mesh = new THREE.Mesh(cupGeo, darkDetailMat)
      cup.rotation.z = Math.PI / 2
      cup.position.set(sx, 0, 0)
      headGroup.add(cup)
    }
  }

  // --- 4. ARTICULATED ARMS & HANDHELD ACCESSORIES ---
  const armSpacingX: number = 0.22
  const shoulderY: number = 0.44

  // Left Arm
  const leftArmGroup: THREE.Group = new THREE.Group()
  leftArmGroup.position.set(-armSpacingX, shoulderY, 0)

  // Right Arm
  const rightArmGroup: THREE.Group = new THREE.Group()
  rightArmGroup.position.set(armSpacingX, shoulderY, 0)

  if (pose === 'standing-phone' || config.hasPhone) {
    // Right arm holds smartphone up to chest level
    rightArmGroup.rotation.x = -0.75
    rightArmGroup.rotation.y = -0.32
    rightArmGroup.rotation.z = -0.22

    buildArm(rightArmGroup, upperBodyMat, skinMat, disposables)

    // Glowing Smartphone in Hand
    const phoneGroup: THREE.Group = new THREE.Group()
    phoneGroup.position.set(0, -0.46, 0.10)
    phoneGroup.rotation.x = -0.65

    const phoneBodyGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.075, 0.14, 0.012)
    disposables.push(phoneBodyGeo)
    const phoneBody: THREE.Mesh = new THREE.Mesh(phoneBodyGeo, darkDetailMat)
    phoneGroup.add(phoneBody)

    const screenGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.065, 0.125)
    const screenMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    disposables.push(screenGeo, screenMat)
    const screen: THREE.Mesh = new THREE.Mesh(screenGeo, screenMat)
    screen.position.set(0, 0, 0.007)
    phoneGroup.add(screen)

    rightArmGroup.add(phoneGroup)

    // Left arm relaxed at side
    leftArmGroup.rotation.x = 0.05
    buildArm(leftArmGroup, upperBodyMat, skinMat, disposables)
  } else if (pose === 'holding-coffee' || config.hasCoffee) {
    // Right arm holds takeaway coffee cup
    rightArmGroup.rotation.x = -0.72
    rightArmGroup.rotation.y = -0.25
    buildArm(rightArmGroup, upperBodyMat, skinMat, disposables)

    // Coffee Cup
    const cupGroup: THREE.Group = new THREE.Group()
    cupGroup.position.set(0, -0.46, 0.06)

    const cupGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.038, 0.028, 0.11, 10)
    const cupMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 })
    disposables.push(cupGeo, cupMat)
    const cupMesh: THREE.Mesh = new THREE.Mesh(cupGeo, cupMat)
    cupGroup.add(cupMesh)

    // Brown kraft sleeve
    const sleeveGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.035, 0.031, 0.05, 10)
    const sleeveMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 })
    disposables.push(sleeveGeo, sleeveMat)
    const sleeveMesh: THREE.Mesh = new THREE.Mesh(sleeveGeo, sleeveMat)
    cupGroup.add(sleeveMesh)

    rightArmGroup.add(cupGroup)

    // Left arm relaxed
    leftArmGroup.rotation.x = -0.04
    buildArm(leftArmGroup, upperBodyMat, skinMat, disposables)
  } else if (pose === 'rolling-luggage' || config.hasLuggage) {
    // Right arm pulls rolling suitcase behind
    rightArmGroup.rotation.x = 0.38
    rightArmGroup.rotation.y = 0.15
    buildArm(rightArmGroup, upperBodyMat, skinMat, disposables)

    // Modern Rolling Hard-Shell Suitcase
    const luggageGroup: THREE.Group = new THREE.Group()
    luggageGroup.position.set(0.32, -0.38, -0.32)
    luggageGroup.rotation.x = -0.18

    // Suitcase Shell with Ribbing
    const suitcaseGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.24, 0.52, 0.36)
    const suitcaseMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xbe123c, // Ruby red hard-shell
      metalness: 0.40,
      roughness: 0.35,
    })
    disposables.push(suitcaseGeo, suitcaseMat)
    const suitcase: THREE.Mesh = new THREE.Mesh(suitcaseGeo, suitcaseMat)
    luggageGroup.add(suitcase)

    // Chrome Telescoping Handle to Hand
    const handleBarGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.48, 8)
    disposables.push(handleBarGeo)
    const handleBar: THREE.Mesh = new THREE.Mesh(handleBarGeo, metallicMat)
    handleBar.position.set(0, 0.45, -0.08)
    luggageGroup.add(handleBar)

    // 4 Caster Wheels
    for (const wx of [-0.09, 0.09]) {
      for (const wz of [-0.14, 0.14]) {
        const wheelGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.024, 8, 8)
        disposables.push(wheelGeo)
        const wheel: THREE.Mesh = new THREE.Mesh(wheelGeo, darkDetailMat)
        wheel.position.set(wx, -0.28, wz)
        luggageGroup.add(wheel)
      }
    }

    rootGroup.add(luggageGroup)

    // Left arm swings slightly
    leftArmGroup.rotation.x = -0.15
    buildArm(leftArmGroup, upperBodyMat, skinMat, disposables)
  } else if (pose === 'walking-stride') {
    // Left arm swings forward, right arm swings backward
    leftArmGroup.rotation.x = -0.38
    rightArmGroup.rotation.x = 0.35
    buildArm(leftArmGroup, upperBodyMat, skinMat, disposables)
    buildArm(rightArmGroup, upperBodyMat, skinMat, disposables)
  } else if (pose === 'sitting-bench') {
    // Both arms rest comfortably on thighs
    leftArmGroup.rotation.x = -0.72
    leftArmGroup.rotation.z = -0.10
    rightArmGroup.rotation.x = -0.72
    rightArmGroup.rotation.z = 0.10
    buildArm(leftArmGroup, upperBodyMat, skinMat, disposables)
    buildArm(rightArmGroup, upperBodyMat, skinMat, disposables)
  } else if (pose === 'hands-in-pocket') {
    // Both arms angled forward towards trouser pockets
    leftArmGroup.rotation.x = -0.32
    leftArmGroup.rotation.z = 0.22
    rightArmGroup.rotation.x = -0.32
    rightArmGroup.rotation.z = -0.22
    buildArm(leftArmGroup, upperBodyMat, skinMat, disposables)
    buildArm(rightArmGroup, upperBodyMat, skinMat, disposables)
  } else {
    // Casual Standing
    leftArmGroup.rotation.x = 0.05
    leftArmGroup.rotation.z = -0.05
    rightArmGroup.rotation.x = -0.05
    rightArmGroup.rotation.z = 0.05
    buildArm(leftArmGroup, upperBodyMat, skinMat, disposables)
    buildArm(rightArmGroup, upperBodyMat, skinMat, disposables)
  }

  torsoGroup.add(leftArmGroup)
  torsoGroup.add(rightArmGroup)

  // --- 5. BODY ACCESSORIES: BACKPACK & MESSENGER BAG ---
  if (config.hasBackpack) {
    const packGroup: THREE.Group = new THREE.Group()
    packGroup.position.set(0, 0.30, -0.18)

    const packGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.26, 0.36, 0.14)
    const packMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85,
    })
    disposables.push(packGeo, packMat)
    const pack: THREE.Mesh = new THREE.Mesh(packGeo, packMat)
    packGroup.add(pack)

    // Front pocket pouch
    const pouchGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.20, 0.18, 0.06)
    disposables.push(pouchGeo)
    const pouch: THREE.Mesh = new THREE.Mesh(pouchGeo, packMat)
    pouch.position.set(0, -0.06, -0.09)
    packGroup.add(pouch)

    // Straps over shoulders
    for (const sx of [-0.09, 0.09]) {
      const strapGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.04, 0.30, 0.02)
      disposables.push(strapGeo)
      const strap: THREE.Mesh = new THREE.Mesh(strapGeo, darkDetailMat)
      strap.position.set(sx, 0.04, 0.11)
      torsoGroup.add(strap)
    }

    torsoGroup.add(packGroup)
  }

  if (config.hasMessengerBag) {
    const satchelGroup: THREE.Group = new THREE.Group()
    satchelGroup.position.set(0.20, 0.05, 0.02)

    const satchelGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.08, 0.22, 0.28)
    const satchelMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Tan leather
      roughness: 0.70,
    })
    disposables.push(satchelGeo, satchelMat)
    const satchel: THREE.Mesh = new THREE.Mesh(satchelGeo, satchelMat)
    satchelGroup.add(satchel)

    // Diagonal Crossbody Strap
    const strapGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.03, 0.60, 0.015)
    disposables.push(strapGeo)
    const strap: THREE.Mesh = new THREE.Mesh(strapGeo, satchelMat)
    strap.position.set(0.05, 0.28, 0.10)
    strap.rotation.z = 0.55
    torsoGroup.add(strap)

    torsoGroup.add(satchelGroup)
  }

  return rootGroup
}

// Helper: Builds an articulated arm (Upper arm + Elbow + Forearm + Hand)
function buildArm(
  armRoot: THREE.Group,
  sleeveMat: THREE.Material,
  skinMat: THREE.Material,
  disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[]
): void {
  // Upper Arm
  const upperArmGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.042, 0.038, 0.22, 10)
  disposables.push(upperArmGeo)
  const upperArm: THREE.Mesh = new THREE.Mesh(upperArmGeo, sleeveMat)
  upperArm.position.set(0, -0.11, 0)
  armRoot.add(upperArm)

  // Forearm
  const forearmGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.038, 0.032, 0.22, 10)
  disposables.push(forearmGeo)
  const forearm: THREE.Mesh = new THREE.Mesh(forearmGeo, sleeveMat)
  forearm.position.set(0, -0.31, 0)
  armRoot.add(forearm)

  // Hand
  const handGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.036, 8, 8)
  disposables.push(handGeo)
  const hand: THREE.Mesh = new THREE.Mesh(handGeo, skinMat)
  hand.position.set(0, -0.44, 0)
  armRoot.add(hand)
}

// Helper: Builds a detailed modern shoe (Sole + Leather/Canvas Upper)
function createShoe(
  upperMat: THREE.Material,
  soleMat: THREE.Material,
  disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[]
): THREE.Group {
  const shoe: THREE.Group = new THREE.Group()

  // Rubber White Sole
  const soleGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.105, 0.035, 0.23)
  disposables.push(soleGeo)
  const soleMesh: THREE.Mesh = new THREE.Mesh(soleGeo, soleMat)
  soleMesh.position.set(0, 0.018, 0.02)
  shoe.add(soleMesh)

  // Shoe Upper
  const upperGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.098, 0.07, 0.21)
  disposables.push(upperGeo)
  const upperMesh: THREE.Mesh = new THREE.Mesh(upperGeo, upperMat)
  upperMesh.position.set(0, 0.065, 0.015)
  shoe.add(upperMesh)

  return shoe
}

// Helper: Builds distinct 3D hairstyles and headwear
function buildHairstyle(
  headGroup: THREE.Group,
  style: HairStyle,
  hairMat: THREE.Material,
  clothMat: THREE.Material,
  disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[]
): void {
  if (style === 'baseball-cap') {
    // Cap Dome
    const capGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.114, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55)
    disposables.push(capGeo)
    const capMesh: THREE.Mesh = new THREE.Mesh(capGeo, clothMat)
    capMesh.position.set(0, 0.04, 0)
    headGroup.add(capMesh)

    // Cap Visor Bill
    const visorGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.14, 0.018, 0.09)
    disposables.push(visorGeo)
    const visor: THREE.Mesh = new THREE.Mesh(visorGeo, clothMat)
    visor.position.set(0, 0.04, 0.13)
    visor.rotation.x = 0.12
    headGroup.add(visor)
  } else if (style === 'beanie') {
    const beanieGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.105, 0.115, 0.14, 12)
    disposables.push(beanieGeo)
    const beanie: THREE.Mesh = new THREE.Mesh(beanieGeo, clothMat)
    beanie.position.set(0, 0.08, 0)
    headGroup.add(beanie)
  } else if (style === 'ponytail') {
    // Hair Base Cap
    const hairGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.112, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.60)
    disposables.push(hairGeo)
    const hairMesh: THREE.Mesh = new THREE.Mesh(hairGeo, hairMat)
    hairMesh.position.set(0, 0.03, 0)
    headGroup.add(hairMesh)

    // Ponytail Knot & Tail
    const tailGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.045, 8, 8)
    disposables.push(tailGeo)
    const tail: THREE.Mesh = new THREE.Mesh(tailGeo, hairMat)
    tail.position.set(0, 0.04, -0.12)
    headGroup.add(tail)
  } else if (style === 'side-part') {
    const hairGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.115, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.52)
    disposables.push(hairGeo)
    const hairMesh: THREE.Mesh = new THREE.Mesh(hairGeo, hairMat)
    hairMesh.position.set(0, 0.035, 0)
    hairMesh.rotation.z = 0.15
    headGroup.add(hairMesh)
  } else {
    // Short Crop Fade
    const hairGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.112, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.52)
    disposables.push(hairGeo)
    const hairMesh: THREE.Mesh = new THREE.Mesh(hairGeo, hairMat)
    hairMesh.position.set(0, 0.03, 0)
    headGroup.add(hairMesh)
  }
}

// Procedural crowd generator producing diverse, natural commuters
export function createRandomCrowdPerson(
  seed: number,
  disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[],
  forcePose?: PersonPose
): THREE.Group {
  const hash = (n: number): number => {
    const s: number = Math.sin(n * 9999.123) * 10000
    return s - Math.floor(s)
  }

  const poses: PersonPose[] = [
    'standing-casual',
    'standing-phone',
    'walking-stride',
    'holding-coffee',
    'rolling-luggage',
    'hands-in-pocket',
  ]

  const hairStyles: HairStyle[] = [
    'short-crop',
    'side-part',
    'ponytail',
    'baseball-cap',
    'beanie',
  ]

  const chosenPose: PersonPose =
    forcePose ?? poses[Math.floor(hash(seed * 1.1) * poses.length)]
  const skinTone: number =
    SKIN_TONES[Math.floor(hash(seed * 2.3) * SKIN_TONES.length)]
  const hairColor: number =
    HAIR_COLORS[Math.floor(hash(seed * 3.7) * HAIR_COLORS.length)]
  const hairStyle: HairStyle =
    hairStyles[Math.floor(hash(seed * 4.9) * hairStyles.length)]
  const shirtColor: number =
    SHIRT_COLORS[Math.floor(hash(seed * 5.5) * SHIRT_COLORS.length)]
  const pantsColor: number =
    PANTS_COLORS[Math.floor(hash(seed * 6.8) * PANTS_COLORS.length)]

  const hasJacket: boolean = hash(seed * 7.4) > 0.45
  const jacketColor: number | undefined = hasJacket
    ? JACKET_COLORS[Math.floor(hash(seed * 8.1) * JACKET_COLORS.length)]
    : undefined

  const hasSunglasses: boolean = hash(seed * 9.2) > 0.65
  const hasHeadphones: boolean = hash(seed * 10.3) > 0.75
  const hasBackpack: boolean =
    chosenPose !== 'rolling-luggage' && hash(seed * 11.4) > 0.60
  const hasMessengerBag: boolean =
    !hasBackpack && chosenPose !== 'rolling-luggage' && hash(seed * 12.5) > 0.70

  const config: PersonConfig = {
    pose: chosenPose,
    skinTone,
    hairColor,
    hairStyle,
    shirtColor,
    jacketColor,
    pantsColor,
    hasSunglasses,
    hasHeadphones,
    hasBackpack,
    hasMessengerBag,
    hasLuggage: chosenPose === 'rolling-luggage',
    hasCoffee: chosenPose === 'holding-coffee',
    hasPhone: chosenPose === 'standing-phone',
  }

  return createRealisticPerson(config, disposables)
}
