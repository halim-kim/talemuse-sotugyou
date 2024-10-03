"use client"

import React, { useState, useEffect, useRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import Image from 'next/image'

interface Chapter {
  title: string;
  content: string;
}

interface AutobiographyProps {
  chapters: string[];
  coverImage: string | null;
}

const Page = React.forwardRef<HTMLDivElement, { content: React.ReactNode }>((props, ref) => {
    return (
      <div ref={ref} className="page bg-[#f5e8d3] shadow-md overflow-hidden border-r border-[#d3c7a6] w-full h-full">
        <div className="h-full overflow-auto">
          <div className="h-full flex flex-col justify-center p-8 md:p-12">
            {props.content}
          </div>
        </div>
      </div>
    )
  })

Page.displayName = 'Page'

export default function Autobiography({ chapters: rawChapters, coverImage }: AutobiographyProps) {
  const chapters: Chapter[] = rawChapters.map((content, index) => ({
    title: `第${index + 1}章: ${content.split(':')[0]}`,
    content: content.split(':')[1].trim()
  }))

  const [currentPage, setCurrentPage] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const bookRef = useRef<any>(null)

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const onFlip = (e: any) => {
    setCurrentPage(e.data)
  }

  const handlePrevPage = () => {
    bookRef.current?.pageFlip().flipPrev()
  }

  const handleNextPage = () => {
    bookRef.current?.pageFlip().flipNext()
  }

  const isPortrait = dimensions.height > dimensions.width

  return (
    <div className="w-screen h-screen bg-[#e8e0cc] flex items-center justify-center overflow-hidden font-serif">
      <div className="relative w-full h-full shadow-2xl">
        <HTMLFlipBook
          width={isPortrait ? dimensions.width : dimensions.width / 2}
          height={dimensions.height}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="book-container"
          style={{ margin: '0 auto' }}
          ref={bookRef}
          flippingTime={1000}
          usePortrait={true}
          // Add the missing properties
          startPage={0}
          drawShadow={true}
          startZIndex={0}
          autoSize={true}
          // Add any other required properties here
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={0}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Cover */}
          <div className="page relative w-full h-full overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt="自叙伝の表紙"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/images/image_fx_.jpg"
                alt="自叙伝の表紙"
                layout="fill"
                objectFit="cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 shadow-text">私の人生の軌跡</h1>
              <p className="text-xl md:text-2xl text-white italic shadow-text">自叙伝</p>
            </div>
          </div>

          {/* Table of Contents */}
          <Page content={
            <div className="prose prose-stone mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-[#8b4513] border-b-2 border-[#8b4513] pb-2">目次</h2>
              <ul className="space-y-4 list-none pl-0">
                {chapters.map((chapter, index) => (
                  <li key={index} className="text-[#5c3317] hover:text-[#8b4513] transition-colors">
                    <span className="font-bold mr-2">{index + 1}.</span>
                    {chapter.title}
                  </li>
                ))}
              </ul>
            </div>
          } />

          {/* Chapters */}
          {chapters.map((chapter, index) => (
            <Page key={index} content={
              <div className="prose prose-stone mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-[#8b4513] border-b-2 border-[#8b4513] pb-2">{chapter.title}</h2>
                <div className="text-[#5c3317] leading-relaxed">
                  {chapter.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className={i === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            } />
          ))}
        </HTMLFlipBook>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            aria-label="前のページ"
            className="bg-[#8b4513] hover:bg-[#5c3317] text-[#f8f5e6] px-4 py-2 rounded"
          >
            ←
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === chapters.length + 1}
            aria-label="次のページ"
            className="bg-[#8b4513] hover:bg-[#5c3317] text-[#f8f5e6] px-4 py-2 rounded"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}