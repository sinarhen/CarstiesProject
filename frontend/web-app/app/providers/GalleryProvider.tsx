'use client'

import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';

const GalleryContext = React.createContext<{
    openGallery: boolean;
    setOpenGallery: React.Dispatch<any>;
    setGalleryImage: React.Dispatch<any>;
} | null | any>(null);

export default function GalleryProvider({children}: {children: React.ReactNode})
{
    const [openGallery, setOpenGallery] = React.useState<boolean>(false);
    const [galleryImage, setGalleryImage] = React.useState<React.ReactNode>(null);

    useEffect(() => {
        console.log("Open gallery changed ", openGallery)
    }, [openGallery])
    return (
        <>
        
            <GalleryContext.Provider value={
                {
                    openGallery,
                    setOpenGallery,
                    setGalleryImage

                }
            } >
                <div className={cn("fixed top-0 left-0 transition-colors duration-500 z-50 flex bg-transparent items-center justify-center", 
                    openGallery ? "h-full w-full backdrop-filter backdrop-blur-sm bg-black/50" : '')}
                    onClick={() => {
                        setOpenGallery(false);
                        setGalleryImage(null);    
                    }}>
                    <div className='relative rounded-lg overflow-hidden w-3/4 lg:w-1/2'>
                        {galleryImage}
                    </div>
                </div>
                {children}

            </GalleryContext.Provider>
        </>
    )
}


export function useGallery()
{
    const context = React.useContext(GalleryContext);
    if (context != null){
        return context;
    }
    return null;
}