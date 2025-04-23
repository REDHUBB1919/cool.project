"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { saveIdeas } from "../services/ideaService"
import { analyzeIdeas, generateSWOT } from "../services/ai"

interface Idea {
  title: string
  description: string
}

interface IdeaStep {
  title: string
  description: string
}

const ideaSteps: IdeaStep[] = [
  {
    title: "Market opportunity",
    description: "What market problem or opportunity are you addressing?",
  },
  {
    title: "Solution overview",
    description: "What product or service will you provide to solve this problem?",
  },
  {
    title: "Target customers",
    description: "Who are your primary target customers?",
  },
  {
    title: "Revenue model",
    description: "How will you generate revenue?",
  },
  {
    title: "Competitive advantage",
    description: "What makes your solution better than existing alternatives?",
  },
  {
    title: "Initial investment",
    description: "How much funding do you need to get started?",
  },
  {
    title: "Team composition",
    description: "What key team members and roles do you need?",
  },
  {
    title: "Growth strategy",
    description: "How do you plan to scale your business?",
  },
  {
    title: "Key risks",
    description: "What are the main challenges and risks you anticipate?",
  },
  {
    title: "Success metrics",
    description: "How will you measure success?",
  },
]

export function useIdeaForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [ideas, setIdeas] = useState<Idea[]>(
    Array(10).fill({ title: "", description: "" })
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update progress width when currentStep changes
  useEffect(() => {
    const progress = ((currentStep - 1) / 10) * 100
    document.documentElement.style.setProperty('--progress-width', `${progress}%`)
  }, [currentStep])

  // Handle input changes
  const handleChange = (index: number, field: keyof Idea, value: string) => {
    const newIdeas = [...ideas]
    newIdeas[index] = { ...newIdeas[index], [field]: value }
    setIdeas(newIdeas)
    // Clear error when user makes changes
    if (error) setError(null)
  }

  // Handle next step
  const handleNext = () => {
    // Validate current step before proceeding
    const currentIdea = ideas[currentStep - 1]
    if (!currentIdea.title.trim() || !currentIdea.description.trim()) {
      setError("Please fill in both title and description before proceeding.")
      return
    }
    
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Validate all ideas
      const emptyIdeas = ideas.filter(
        idea => !idea.title.trim() || !idea.description.trim()
      )
      
      if (emptyIdeas.length > 0) {
        setError("Please fill in all fields before submitting.")
        setLoading(false)
        return
      }
      
      // Save ideas to localStorage
      localStorage.setItem("startupIdeas", JSON.stringify(ideas))
      
      // Save ideas to database
      await saveIdeas(ideas)
      
      // Generate analysis
      const analysis = await analyzeIdeas(ideas)
      localStorage.setItem("startupAnalysis", JSON.stringify(analysis))
      
      // Generate SWOT
      const swot = await generateSWOT(ideas)
      localStorage.setItem("startupSwot", JSON.stringify(swot))
      
      // Navigate to analysis page
      router.push("/analysis")
    } catch (err) {
      console.error("Error submitting ideas:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "An unexpected error occurred. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    currentStep,
    ideas,
    ideaSteps,
    loading,
    error,
    handleChange,
    handleNext,
    handlePrevious,
    handleSubmit,
  }
} 