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
	{ label: 'Japan', city: 'Tokyo', timeZone: 'Asia/Tokyo' },
	{ label: 'Hong Kong', city: 'Hong Kong', timeZone: 'Asia/Hong_Kong' },
	{ label: 'Singapore', city: 'Singapore', timeZone: 'Asia/Singapore' },
	{ label: 'Switzerland', city: 'Zurich', timeZone: 'Europe/Zurich' },
	{ label: 'Germany', city: 'Frankfurt', timeZone: 'Europe/Berlin' },
	{ label: 'Australia', city: 'Sydney', timeZone: 'Australia/Sydney' },
]

export default function HeaderTimeBar() {
	const [times, setTimes] = useState<string[]>(ZONES.map(() => '--:--:--'))

	useEffect(() => {
		const update = () => {
			const now = new Date()
			setTimes(
				ZONES.map((z) => {
					try {
						// Use Intl.DateTimeFormat for proper timezone conversion
						const formatter = new Intl.DateTimeFormat('en-US', {
							hour12: false,
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							timeZone: z.timeZone
						})
						
						return formatter.format(now)
					} catch (error) {
						console.error(`Error getting time for ${z.city}:`, error)
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
		// Update every second for live times
		const id = setInterval(update, 1000)
		return () => clearInterval(id)
	}, [])

	// Create the carousel content
	const timeSegments = ZONES.map((z, idx) => `${z.city}: ${times[idx]}`).join('  •  ')

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
				<div className="marquee-wrapper">
					<div className="marquee-track">
						<span className="marquee-text text-ticker-color ticker-glow tracking-wide font-semibold text-sm">
							{timeSegments}  •  {timeSegments}  •  {timeSegments}  •  {timeSegments}  •  {timeSegments}  •  {timeSegments}  •  {timeSegments}  •  {timeSegments}  •  {timeSegments}  •  {timeSegments}
						</span>
					</div>
				</div>
			</div>

			{/* Custom CSS for gradient animation and marquee */}
			<style jsx>{`
				@keyframes gradientShift {
					0%, 100% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
				}
				
				.marquee-wrapper {
					overflow: hidden;
					white-space: nowrap;
					position: relative;
				}
				
				.marquee-track {
					display: inline-block;
					white-space: nowrap;
					animation: marquee-time 100s linear infinite;
					animation-timing-function: linear;
				}
				
				.marquee-text {
					display: inline-block;
					white-space: nowrap;
				}
				
				@keyframes marquee-time {
					0% { transform: translateX(-50%); }
					100% { transform: translateX(0); }
				}
			`}</style>
		</div>
	)
}


