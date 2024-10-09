'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Share2, FileText } from 'lucide-react'
import Image from 'next/image'
import Oheader from '@/components/OHeader'
import Footer from '@/components/Footer'

const NewsletterCard = ({ semester, imageUrl, pdfUrl }) => {
  const [showReadNow, setShowReadNow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowReadNow(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleShare = async () => {
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const file = new File([blob], `${semester}_Newsletter_2023-24.pdf`, { type: 'application/pdf' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${semester} Newsletter 2023-24`,
        })
      } else {
        // Fallback for browsers that don't support file sharing
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = `${semester}_Newsletter_2023-24.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error sharing file:', error)
      alert('Unable to share the file. You can download it directly from the "Read Now" link.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full aspect-[3/4] mx-auto overflow-hidden rounded-xl shadow-2xl"
    >
      <Image
        src={imageUrl}
        alt={`${semester} Semester Newsletter`}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
        <h3 className="text-2xl font-semibold text-white mb-4">
          {semester} Semester
        </h3>

        <motion.div
          initial={{ opacity: 0 }}
          animate={showReadNow ? { opacity: 1 } : { opacity: 0 }}
          className="flex justify-between items-center"
        >
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm"
          >
            <FileText className="mr-2" size={16} />
            Read Now
          </a>
          <button
            onClick={handleShare}
            className="p-2 text-white hover:text-red-200 transition"
          >
            <Share2 size={20} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function NewsletterPage() {
  const newsletters = [
    {
      semester: "First",
      imageUrl: "/images/n1.jpg",
      pdfUrl: "/pdfs/3 (1).pdf"
    },
    {
      semester: "Second",
      imageUrl: "/images/coll2.png",
      pdfUrl: "/pdfs/second-semester-2023-24.pdf"
    }
  ]

  const pageRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  })

  const headerY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-100%"])

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col bg-red-50">
      <Oheader />

      <motion.div
        style={{ y: headerY }}
        className="fixed top-20 left-0 right-0 z-10 bg-red-50 py-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-red-800 mb-4">
            NEWSLETTER
          </h1>
          <h2 className="text-4xl font-semibold text-red-700 mb-6">
            2023-24
          </h2>
          <p className="text-xl text-red-600">
            Stay updated with our bi-annual newsletters covering all the important events
            and achievements throughout the academic year.
          </p>

          <p className="text-lg mt-10 text-gray-700">
            CONVENTUS brings together passionate individuals from around the globe to engage in meaningful discussions on pressing international issues. Our committees provide a platform for delegates to hone their diplomacy skills, broaden their understanding of global affairs, and work collaboratively towards innovative solutions.
            CONVENTUS brings together passionate individuals from around the globe to engage in meaningful discussions on pressing international issues. 
          </p>
        </div>
      </motion.div>

      <main className="flex-grow container mx-auto px-4 py-8 mt-[calc(100vh-25vh)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsletters.map((newsletter, index) => (
            <NewsletterCard
              key={index}
              semester={newsletter.semester}
              imageUrl={newsletter.imageUrl}
              pdfUrl={newsletter.pdfUrl}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}