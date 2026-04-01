"use client";

import {
  Plane,
  Hotel,
  Settings,
  Car,
  Shield,
  FileText,
  Headphones,
} from "lucide-react";

export default function useStaticServices() {
  const services = [
    {
      icon: Plane,
      title: "Air Ticketing & Flight Reservations",
      description: "Local and international flight booking services",
      image: "/images/services/air-ticketing.webp",
      process: [
        "We search for the best routes and timings for your travel.",
        "We compare multiple airlines to get the most convenient and cost-effective flights.",
        "We handle all bookings and provide your itinerary with confirmation details.",
      ],
      options: [
        {
          name: "Flight Booking",
          features: [
            "Local & international flights",
            "Flexible travel options",
            "Best available routes",
          ],
        },
      ],
    },
    {
      icon: Hotel,
      title: "Hotel & Accommodation",
      description: "Lodges, resorts, camps, and apartments",
      image: "/images/services/hotel-accommodation.webp",
      process: [
        "We select hotels, lodges, and apartments that match your preferences.",
        "We ensure prime locations and comfort for your stay.",
        "We handle bookings and provide you with detailed accommodation info.",
      ],
      options: [
        {
          name: "Accommodation",
          features: [
            "Luxury & budget options",
            "Prime locations",
            "Flexible stays",
          ],
        },
      ],
    },
    {
      icon: Settings,
      title: "Custom Travel Itineraries",
      description: "Tailor-made travel planning",
      image: "/images/services/custom-itineraries.webp",
      process: [
        "We consult with you to understand your travel goals.",
        "We design personalized travel itineraries based on your preferences.",
        "We provide detailed plans including activities, timings, and recommendations.",
      ],
      options: [
        {
          name: "Custom Planning",
          features: [
            "Personalized trips",
            "Flexible scheduling",
            "Client-based planning",
          ],
        },
      ],
    },
    {
      icon: Car,
      title: "Transport & Transfers",
      description: "Reliable movement services",
      image: "/images/services/transport-transfers.webp",
      process: [
        "We arrange airport pickups, drop-offs, and local transportation.",
        "We ensure safe and timely transfers with professional drivers.",
        "We coordinate logistics to fit your travel schedule.",
      ],
      options: [
        {
          name: "Transport Services",
          features: [
            "Airport transfers",
            "Ground transportation",
            "Comfortable vehicles",
          ],
        },
      ],
    },
    {
      icon: Car,
      title: "Car Hire & Chauffeur",
      description: "Private and professional transport",
      image: "/images/services/car-hire.webp",
      process: [
        "We provide self-drive or chauffeur-driven vehicle options.",
        "We ensure vehicles are clean, safe, and reliable.",
        "We tailor rental plans to match your itinerary and requirements.",
      ],
      options: [
        {
          name: "Car Hire",
          features: [
            "Self-drive options",
            "Professional chauffeurs",
            "Flexible rental plans",
          ],
        },
      ],
    },
    {
      icon: Shield,
      title: "Travel Insurance",
      description: "Secure your journey",
      image: "/images/services/travel-insurance.webp",
      process: [
        "We recommend suitable travel insurance plans.",
        "We handle policy purchase and coverage details.",
        "We ensure your trip is protected against emergencies and unforeseen events.",
      ],
      options: [
        {
          name: "Insurance Services",
          features: [
            "Travel protection",
            "Emergency coverage",
            "Flexible plans",
          ],
        },
      ],
    },
    {
      icon: FileText,
      title: "Visa & Documentation",
      description: "Travel documentation support",
      image: "/images/services/visa-documentation.webp",
      process: [
        "We guide you through the visa application process.",
        "We prepare and review all required documents.",
        "We provide support until the visa and travel documents are approved.",
      ],
      options: [
        {
          name: "Visa Assistance",
          features: [
            "Visa processing guidance",
            "Document preparation",
            "Application support",
          ],
        },
      ],
    },
    {
      icon: Settings,
      title: "Tour Guiding",
      description: "Professional safari and travel guides",
      image: "/images/services/tour-guiding.webp",
      process: [
        "We provide experienced local guides for your tours.",
        "We ensure safe and informative experiences.",
        "We customize guiding services based on your itinerary and interests.",
      ],
      options: [
        {
          name: "Guiding Services",
          features: [
            "Experienced guides",
            "Local expertise",
            "Safe travel experience",
          ],
        },
      ],
    },
    {
      icon: Headphones,
      title: "24/7 Travel Support",
      description: "Always available assistance",
      image: "/images/services/24-7-support.webp",
      process: [
        "We offer round-the-clock support for emergencies or changes.",
        "We answer inquiries and provide real-time assistance.",
        "We ensure smooth travel experiences for all our clients.",
      ],
      options: [
        {
          name: "Customer Support",
          features: [
            "24/7 availability",
            "Emergency response",
            "Travel assistance",
          ],
        },
      ],
    },
  ];

  return { services };
}
