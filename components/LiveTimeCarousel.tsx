'use client'

import React, { useState, useEffect } from 'react'

export default function LiveTimeCarousel() {
  const [currentTime, setCurrentTime] = useState('--:--:--')
  const [timeZone, setTimeZone] = useState('UK')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
      setCurrentTime(timeString)
    }

    // Update immediately
    updateTime()
    
    // Then set up interval
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timeZones = ['UK', 'USA', 'China']
    const interval = setInterval(() => {
      setTimeZone(prev => {
        const currentIndex = timeZones.indexOf(prev)
        const nextIndex = (currentIndex + 1) % timeZones.length
        return timeZones[nextIndex]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Ensure we always have a time to display
  const displayTime = currentTime || new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })

  return (
    <div className="w-full bg-slate-900 rounded-xl border-2 border-emerald-500 shadow-lg overflow-hidden" style={{ minHeight: '120px' }}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {timeZone}
            </div>
            <div className="text-sm text-slate-300">
              {timeZone === 'UK' ? 'London' : timeZone === 'USA' ? 'New York' : 'Beijing'}
            </div>
            <div className="text-3xl font-mono font-bold text-emerald-400 mt-2">
              {displayTime}
            </div>
          </div>
        </div>
        
        {/* Time zone indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {['UK', 'USA', 'China'].map((tz, index) => (
            <div
              key={tz}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                tz === timeZone 
                  ? 'bg-emerald-400 scale-125' 
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
