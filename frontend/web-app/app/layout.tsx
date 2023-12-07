import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/navbar/Navbar'
import React from "react";
import StyledComponentsRegistry from "@/lib/AntdRegistry";


export const metadata: Metadata = {
  title: 'Carsties',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        
        <body>
          <StyledComponentsRegistry>
            <Navbar />
            <main className='container mx-auto px-5 pt-10'>

              {children}
            </main>

          </StyledComponentsRegistry>

        </body>
    </html>
  )
}
