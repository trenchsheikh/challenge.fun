'use client'

import React, { useEffect, useState } from 'react'

interface Zone {
	label: string
	city: string
	timeZone: string
}

const ZONES: Zone[] = [
	{ label: 'UK', city: 'London', timeZone: 'Europe/London' },
	{ label: 'USA', city: 'New York', timeZone: 'America/New_York' },
	{ label: 'China', city: 'Beijing', timeZone: 'Asia/Shanghai' },
]

export default function HeaderTimeBar() {
	const [times, setTimes] = useState<string[]>(ZONES.map(() => '--:--:--'))

	useEffect(() => {
		const update = () => {
			const now = new Date()
			setTimes(
				ZONES.map((z) => {
					try {
						// Use proper timezone conversion
						const time = new Date(now.toLocaleString('en-US', { timeZone: z.timeZone }))
						return time.toLocaleTimeString('en-US', {
							hour12: false,
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							timeZone: z.timeZone
						})
					} catch (error) {
						// Fallback to local time if timezone fails
						return now.toLocaleTimeString('en-US', {
							hour12: false,
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						})
					}
				})
			)
		}

		update()
		const id = setInterval(update, 1000)
		return () => clearInterval(id)
	}, [])

	return (
		<div
			className="w-full border-b-2 border-green shadow-neon corners-square relative overflow-hidden"
			style={{ 
				margin: 0,
				background: 'linear-gradient(90deg, #000000, #064e3b, #000000, #065f46, #000000)',
				backgroundSize: '300% 100%',
				animation: 'gradientShift 8s ease-in-out infinite'
			}}
			data-timebar
		>
			{/* Content */}
			<div className="px-12 py-2 relative z-10">
				<div className="flex items-center justify-center">
					{ZONES.map((z, idx) => (
						<div key={z.label} className="flex items-center mx-8">
							<span className="text-sm font-semibold text-white mr-6 drop-shadow-lg">
								{z.city}:
							</span>
							<span 
								className="text-base font-mono font-bold tabular-nums tracking-wide drop-shadow-lg"
								style={{ color: '#00ff00', textShadow: '0 0 3px #00ff00' }}
							>
								{times[idx]}
							</span>
							{idx < 2 && (
								<span 
									className="text-lg font-bold ml-2 drop-shadow-lg"
									style={{ color: '#00ff00', textShadow: '0 0 3px #00ff00' }}
								>
									•
								</span>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Custom CSS for gradient animation */}
			<style jsx>{`
				@keyframes gradientShift {
					0%, 100% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
				}
			`}</style>
		</div>
	)
}


