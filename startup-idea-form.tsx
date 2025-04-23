"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import "./styles/startup-form.css"

export default function StartupIdeaForm() {
  // State for tracking current step (1-10 for input steps, 11 for summary)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    document.documentElement.style.setProperty('--current-step', currentStep.toString());
  }, [currentStep]);

  // State for storing all 10 ideas
  const [ideas, setIdeas] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ])

  // Placeholders for each step
  const placeholders = [
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

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    // This would update the ideas array at the current step index
    console.log(`Update ${field} to ${value} at step ${currentStep}`)
  }

  // Navigate to next step
  const handleNext = () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Submit all ideas
  const handleSubmit = () => {
    console.log("Submitted ideas:", ideas)
  }

  // Render input step
  const renderStep = (stepIndex: number) => {
    const index = stepIndex - 1
    const idea = ideas[index]
    const placeholder = placeholders[index]

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Idea {stepIndex} of 10</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder={placeholder.title}
              value={idea.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder={placeholder.description}
              value={idea.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={stepIndex === 1}>
            Previous
          </Button>
          <Button onClick={handleNext}>{stepIndex === 10 ? "Review" : "Next"}</Button>
        </CardFooter>
      </Card>
    )
  }

  // Render summary page
  const renderSummary = () => {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Summary of Your Startup Ideas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {ideas.map((idea, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg">
                {index + 1}. {idea.title || `Idea ${index + 1}`}
              </h3>
              <p className="text-muted-foreground mt-1">{idea.description || "No description provided."}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            Back to Edit
          </Button>
          <Button onClick={handleSubmit}>Submit All Ideas</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Startup Idea Generator</h1>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-primary h-2.5 rounded-full progress-bar"></div>
        </div>
        <p className="text-center mt-2 text-sm text-muted-foreground">
          {currentStep <= 10 ? `Step ${currentStep} of 10` : "Review"}
        </p>
      </div>

      {currentStep <= 10 ? renderStep(currentStep) : renderSummary()}
    </div>
  )
}
