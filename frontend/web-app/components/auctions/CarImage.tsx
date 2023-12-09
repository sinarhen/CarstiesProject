'use client';

import type { FC } from 'react';
import Image from 'next/image';
import {useState} from "react";
import {AspectRatio} from "@/components/ui/aspect-ratio"
interface CarImageProps {
    imageUrl: string;
}

const CarImage: FC<CarImageProps> = ({imageUrl}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);


  return (
    <AspectRatio ratio={16/10}>
      <Image
        src={imageUrl}
        alt="image"
        fill
        priority
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
        className={`
                  object-cover
                  group-hover:opacity-75
                  duration-700
                  ease-in-out
                  ${isLoading ? 'grayscale blur-2xl scale-110' : "grayscale-0 blur-0 scale-100"}
                `}
        onLoad={() => setIsLoading(false)}
      />

    </AspectRatio>

        );
}
export default CarImage;