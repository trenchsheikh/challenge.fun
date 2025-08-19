"use client"

import React from 'react'

// No-op session gate: we no longer force clearing storage or signing on connect.
// This component is kept to allow future policies without touching layout wiring.
export default function WalletSessionGate() {
  return null
}
