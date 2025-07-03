import { Zap, ShieldCheck, Globe, Clock } from "lucide-react"

const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Express Delivery",
    description: "Get your parcels delivered at lightning speed with our premium express service.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Secure & Reliable",
    description: "Your packages are safe with us, with real-time tracking and full insurance coverage.",
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Nationwide Coverage",
    description: "We deliver to every corner of India, from metropolitan hubs to remote villages.",
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "24/7 Support",
    description: "Our dedicated customer support team is available round the clock to assist you.",
  },
]

export default function FeatureGrid() {
  return (
    <>
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="group flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-backwards transition-all hover:scale-105"
          style={{ animationDelay: `${200 + index * 150}ms` }}
        >
          <div className="bg-primary/10 p-4 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
            {feature.icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        </div>
      ))}
    </>
  )
}
