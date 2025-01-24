"use client"

import Navbar from "@/components/Navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from '@/messages.json'
import Autoplay from "embla-carousel-autoplay"

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
     {/* Main content */}
     <Navbar />
    <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-24 py-12 bg-gray-100">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Dive into the World of Anonymous Conversations</h1>
        <p className="mt-3 text-lg md:text-xl text-gray-700">
          Explore Mystery Message - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 2000 })]} // 📌 It is necessary for autoplay
        className="w-full max-w-2xl shadow-lg rounded-xl ">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
                  <CardHeader className="text-xl rounded-xl items-center justify-center font-semibold text-gray-800 border-b pb-3">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex flex-col rounded-xl items-center justify-center p-6 bg-white">
                    <span className="text-lg font-medium text-gray-700 mb-4">
                      {message.content}
                    </span>
                    <span className="text-sm text-gray-500 mt-2">
                      {message.received}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6">
          ©️ 2025 Mystry Message. All rights reserved.
    </footer>
    </div>
  )
}

export default Home