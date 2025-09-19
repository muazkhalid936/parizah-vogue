"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleWhatsAppClick = (messageType: string) => {
    const phoneNumber = "+1234567890"
    let message = ""

    switch (messageType) {
      case "general":
        message = "Hi! I have a question about your dresses."
        break
      case "order":
        message = "Hi! I need help with my order."
        break
      case "sizing":
        message = "Hi! I need help with sizing information."
        break
      case "shipping":
        message = "Hi! I have a question about shipping."
        break
      default:
        message = "Hi! I have a question about your dresses."
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setIsExpanded(false)
  }

  return (
    <>
      {isExpanded && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-xl z-50 animate-in slide-in-from-bottom-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Chat with us
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">How can we help you today?</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWhatsAppClick("general")}
                className="w-full justify-start text-left"
              >
                General Questions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWhatsAppClick("order")}
                className="w-full justify-start text-left"
              >
                Order Support
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWhatsAppClick("sizing")}
                className="w-full justify-start text-left"
              >
                Sizing Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWhatsAppClick("shipping")}
                className="w-full justify-start text-left"
              >
                Shipping Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-green-500 hover:bg-green-600 z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </>
  )
}
