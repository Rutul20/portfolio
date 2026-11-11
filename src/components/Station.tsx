import type React from 'react'

interface StationProps {
  label: string
  position: [number, number, number]
}

export const Station: React.FC<StationProps> = ({ label: _label, position }) => {
  return (
    <group position={position}>
      {/* Platform */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.5, 6]} />
        <meshStandardMaterial color="#222" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Station Sign */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Signaling Pillar */}
      <mesh position={[-1.5, 0.75, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[1.5, 0.75, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* The Label - Simplified for now */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}
