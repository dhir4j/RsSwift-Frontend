"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "RS SWIFT COURIERS has been a game-changer for our business. Their express delivery is incredibly fast and reliable. We can always count on them.",
    author: "Rohan Sharma",
    company: "E-commerce Seller",
    avatar: "RS",
    stars: 5,
  },
  {
    quote: "The best courier service I've used in India. The tracking is accurate, the customer support is responsive, and my packages always arrive on time.",
    author: "Priya Patel",
    company: "Small Business Owner",
    avatar: "PP",
    stars: 5,
  },
  {
    quote: "As a frequent shipper, I appreciate the professionalism and efficiency of RS SWIFT COURIERS. Their nationwide coverage is a huge plus.",
    author: "Amit Singh",
    company: "Tech Startup",
    avatar: "AS",
    stars: 5,
  },
    {
    quote: "Fantastic service! The quote widget is easy to use and gives a fair estimate. The delivery was smooth and hassle-free.",
    author: "Sunita Rao",
    company: "Freelancer",
    avatar: "SR",
    stars: 4,
  },
]

export default function Testimonials() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="h-full">
                <CardContent className="flex flex-col justify-between h-full p-6 text-left">
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.stars ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
                        />
                      ))}
                    </div>
                    <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <Avatar>
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${testimonial.avatar}`} />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
