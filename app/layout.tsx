import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '../components/WalletProvider'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TickerBar from '../components/TickerBar'
import WalletSessionGate from '../components/WalletSessionGate'
import HeaderTimeBar from '../components/HeaderTimeBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Challenge.fun',
  description: 'Track your Solana portfolio with live balances, badges, and insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-kyoto`}>
        <WalletProvider>
          <WalletSessionGate />
          <div className="page-border">
            <div className="min-h-screen flex flex-col page-border-inner" style={{ borderRadius: 16, position: 'relative' }}>
              <div className="sticky top-0 z-50" id="sticky-headers">
                <TickerBar />
                <Header />
                <HeaderTimeBar />
              </div>
              <div style={{ borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <main className="w-full flex-1 min-h-0" style={{ paddingTop: 0 }}>
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </div>
        </WalletProvider>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var stick=document.getElementById('sticky-headers'); if(!stick) return;
            var el=stick.querySelector('[data-ticker]'); if(!el) return;
            function update(){
              var y=window.scrollY || window.pageYOffset || 0;
              if (y > 1) { el.classList.add('corners-square'); el.classList.remove('corners-rounded'); }
              else { el.classList.add('corners-rounded'); el.classList.remove('corners-square'); }
            }
            window.addEventListener('scroll', update, { passive: true });
            update();
          })();
        `}} />
      </body>
    </html>
  )
} 