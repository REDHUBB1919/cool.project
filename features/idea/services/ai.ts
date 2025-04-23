"use client"

import { Idea } from "../types/idea"

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY!
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

interface Analysis {
  score: number
  details: string
}

interface SWOT {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export async function analyzeIdeas(ideas: Idea[]): Promise<Analysis> {
  const prompt = generateAnalysisPrompt(ideas)
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a startup idea analyzer. Analyze the given startup ideas and provide a score out of 100 and detailed analysis.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to analyze ideas")
  }

  const data = await response.json()
  const analysis = parseAnalysisResponse(data.choices[0].message.content)

  return analysis
}

export async function generateSWOT(ideas: Idea[]): Promise<SWOT> {
  const prompt = generateSWOTPrompt(ideas)
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a startup idea analyzer. Generate a SWOT analysis for the given startup ideas.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate SWOT analysis")
  }

  const data = await response.json()
  const swot = parseSWOTResponse(data.choices[0].message.content)

  return swot
}

function generateAnalysisPrompt(ideas: Idea[]): string {
  return `Please analyze the following startup ideas and provide a score out of 100 and detailed analysis:

${ideas
  .map(
    (idea, index) => `
Idea ${index + 1}:
Title: ${idea.title}
Description: ${idea.description}
`
  )
  .join("\n")}

Please provide your analysis in the following format:
Score: [number]
Details: [detailed analysis]`
}

function generateSWOTPrompt(ideas: Idea[]): string {
  return `Please generate a SWOT analysis for the following startup ideas:

${ideas
  .map(
    (idea, index) => `
Idea ${index + 1}:
Title: ${idea.title}
Description: ${idea.description}
`
  )
  .join("\n")}

Please provide your SWOT analysis in the following format:
Strengths:
- [strength 1]
- [strength 2]
...

Weaknesses:
- [weakness 1]
- [weakness 2]
...

Opportunities:
- [opportunity 1]
- [opportunity 2]
...

Threats:
- [threat 1]
- [threat 2]
...`
}

function parseAnalysisResponse(response: string): Analysis {
  const scoreMatch = response.match(/Score:\s*(\d+)/)
  const detailsMatch = response.match(/Details:\s*([\s\S]*?)(?=\n\n|$)/)

  if (!scoreMatch || !detailsMatch) {
    throw new Error("Failed to parse analysis response")
  }

  return {
    score: parseInt(scoreMatch[1]),
    details: detailsMatch[1].trim(),
  }
}

function parseSWOTResponse(response: string): SWOT {
  const strengthsMatch = response.match(/Strengths:\s*([\s\S]*?)(?=Weaknesses:|$)/)
  const weaknessesMatch = response.match(/Weaknesses:\s*([\s\S]*?)(?=Opportunities:|$)/)
  const opportunitiesMatch = response.match(/Opportunities:\s*([\s\S]*?)(?=Threats:|$)/)
  const threatsMatch = response.match(/Threats:\s*([\s\S]*?)(?=\n\n|$)/)

  if (!strengthsMatch || !weaknessesMatch || !opportunitiesMatch || !threatsMatch) {
    throw new Error("Failed to parse SWOT response")
  }

  return {
    strengths: parseListItems(strengthsMatch[1]),
    weaknesses: parseListItems(weaknessesMatch[1]),
    opportunities: parseListItems(opportunitiesMatch[1]),
    threats: parseListItems(threatsMatch[1]),
  }
}

function parseListItems(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.substring(1).trim())
} 