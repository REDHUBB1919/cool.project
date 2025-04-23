"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Idea {
  title: string
  description: string
}

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

export async function saveIdeas(ideas: Idea[]) {
  const { data, error } = await supabase
    .from("ideas")
    .insert([{ ideas }])
    .select()

  if (error) {
    console.error("Error saving ideas:", error)
    throw error
  }

  return data
}

export async function saveAnalysis(analysis: Analysis) {
  const { data, error } = await supabase
    .from("analysis")
    .insert([analysis])
    .select()

  if (error) {
    console.error("Error saving analysis:", error)
    throw error
  }

  return data
}

export async function saveSWOT(swot: SWOT) {
  const { data, error } = await supabase
    .from("swot")
    .insert([swot])
    .select()

  if (error) {
    console.error("Error saving SWOT:", error)
    throw error
  }

  return data
}

export async function getIdeas() {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching ideas:", error)
    throw error
  }

  return data
}

export async function getAnalysis() {
  const { data, error } = await supabase
    .from("analysis")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    console.error("Error fetching analysis:", error)
    throw error
  }

  return data[0]
}

export async function getSWOT() {
  const { data, error } = await supabase
    .from("swot")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    console.error("Error fetching SWOT:", error)
    throw error
  }

  return data[0]
} 