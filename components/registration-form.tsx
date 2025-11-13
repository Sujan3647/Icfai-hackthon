"use client"

import React, { useState } from "react"
import { motion, AnimatePresence, type MotionProps } from "framer-motion"
import { Copy, CheckCircle2, Loader2, User, Users, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

type Person = {
  name: string
  id: string
  program: string
  year: string
  email: string
  phone: string
}

const emptyPerson = (): Person => ({
  name: "",
  id: "",
  program: "",
  year: "",
  email: "",
  phone: "",
})

type RegistrationFormProps = {
  onSuccess?: () => void
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<null | { regId: string }>(null)
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  
  const totalSteps = 7

  const [form, setForm] = useState({
    teamName: "",
    domain: "Blockchain",
    leader: emptyPerson(),
    members: [emptyPerson(), emptyPerson(), emptyPerson()],
    ideaDescription: "",
    terms: false,
  })

  const updateField = (path: string, value: string | boolean) => {
    setErrors([])
    const keys = path.split(".")
    setForm((prev) => {
      const updated = { ...prev }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = updated
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key.includes("[")) {
          const [arrKey, indexStr] = key.split("[")
          const index = parseInt(indexStr.replace("]", ""))
          current = current[arrKey][index] = { ...current[arrKey][index] }
        } else {
          current = current[key] = { ...current[key] }
        }
      }
      
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []
    
    // Stricter email validation - must have proper domain
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    // Phone validation - must be exactly 10 digits for Indian numbers
    const phoneRegex = /^[6-9][0-9]{9}$/
    
    if (!form.teamName.trim()) newErrors.push("Team name is required")
    if (!form.leader.name.trim()) newErrors.push("Leader name is required")
    if (!form.leader.id.trim()) newErrors.push("Leader student ID is required")
    if (!form.leader.program.trim()) newErrors.push("Leader program is required")
    if (!form.leader.year.trim()) newErrors.push("Leader year is required")
    if (!form.leader.email.trim()) newErrors.push("Leader email is required")
    else if (!emailRegex.test(form.leader.email)) newErrors.push("Please enter a valid email address (e.g., name@example.com)")
    if (!form.leader.phone.trim()) newErrors.push("Leader phone is required")
    else if (!phoneRegex.test(form.leader.phone.replace(/[\s\-()]/g, ""))) newErrors.push("Please enter a valid 10-digit Indian mobile number")
    if (!form.ideaDescription.trim()) newErrors.push("Idea description is required")
    if (!form.terms) newErrors.push("You must accept the terms & conditions")
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const validateStep = (step: number): boolean => {
    const newErrors: string[] = []
    
    // Stricter email validation - must have proper domain
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    // Phone validation - must be exactly 10 digits for Indian numbers
    const phoneRegex = /^[6-9][0-9]{9}$/
    
    switch (step) {
      case 1: // Team Details
        if (!form.teamName.trim()) newErrors.push("Team name is required")
        break
      case 2: // Leader Details
        if (!form.leader.name.trim()) newErrors.push("Leader name is required")
        if (!form.leader.id.trim()) newErrors.push("Leader student ID is required")
        if (!form.leader.program.trim()) newErrors.push("Leader program is required")
        if (!form.leader.year.trim()) newErrors.push("Leader year is required")
        if (!form.leader.email.trim()) newErrors.push("Leader email is required")
        else if (!emailRegex.test(form.leader.email)) 
          newErrors.push("Please enter a valid email address (e.g., name@example.com)")
        if (!form.leader.phone.trim()) newErrors.push("Leader phone is required")
        else if (!phoneRegex.test(form.leader.phone.replace(/[\s\-()]/g, ""))) 
          newErrors.push("Please enter a valid 10-digit Indian mobile number")
        break
      case 3: // Member 1
      case 4: // Member 2
      case 5: // Member 3
        const memberIndex = step - 3
        const member = form.members[memberIndex]
        if (member.name.trim()) {
          // If name is filled, all fields are required
          if (!member.id.trim()) newErrors.push(`Member ${memberIndex + 1} Student ID is required`)
          if (!member.program.trim()) newErrors.push(`Member ${memberIndex + 1} Program is required`)
          if (!member.year.trim()) newErrors.push(`Member ${memberIndex + 1} Year is required`)
          if (!member.email.trim()) newErrors.push(`Member ${memberIndex + 1} Email is required`)
          else if (!emailRegex.test(member.email)) 
            newErrors.push(`Member ${memberIndex + 1}: Please enter a valid email address`)
          if (!member.phone.trim()) newErrors.push(`Member ${memberIndex + 1} Phone is required`)
          else if (!phoneRegex.test(member.phone.replace(/[\s\-()]/g, ""))) 
            newErrors.push(`Member ${memberIndex + 1}: Please enter a valid 10-digit mobile number`)
        }
        break
      case 6: // Idea Description
        if (!form.ideaDescription.trim()) newErrors.push("Idea description is required")
        break
      case 7: // Terms
        if (!form.terms) newErrors.push("You must accept the terms & conditions")
        break
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setErrors([])
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      
      if (data.success) {
        setSuccess({ regId: data.regId })
        setForm({
          teamName: "",
          domain: "Blockchain",
          leader: emptyPerson(),
          members: [emptyPerson(), emptyPerson(), emptyPerson()],
          ideaDescription: "",
          terms: false,
        })
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000)
        }
      } else {
        setErrors([data.message || "Registration failed"])
      }
    } catch (err) {
      console.error(err)
      setErrors(["Network error. Please try again."])
    } finally {
      setLoading(false)
    }
  }

  const copyRegId = () => {
    if (success) {
      navigator.clipboard.writeText(success.regId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <div className="w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-[#0b2b54]">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        <form onSubmit={submit} className="space-y-6">
          <AnimatePresence mode="wait">
            {errors.length > 0 && (
              <motion.div
                key="errors"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Step 1: Team Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team Details
                    </CardTitle>
                    <CardDescription>Basic information about your team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name <span className="text-red-500">*</span></Label>
                        <Input id="teamName" placeholder="Enter your team name" value={form.teamName} onChange={(e) => updateField("teamName", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="domain">Domain <span className="text-red-500">*</span></Label>
                        <Select value={form.domain} onValueChange={(value) => updateField("domain", value)}>
                          <SelectTrigger id="domain">
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Blockchain">🔗 Blockchain</SelectItem>
                            <SelectItem value="AIML">🤖 AIML</SelectItem>
                            <SelectItem value="Open Innovation">💡 Open Innovation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Leader Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Team Leader Details
                    </CardTitle>
                    <CardDescription>Information about the team leader</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="leaderName">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="leaderName" placeholder="Full Name" value={form.leader.name} onChange={(e) => updateField("leader.name", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaderId">Student ID <span className="text-red-500">*</span></Label>
                        <Input id="leaderId" placeholder="Student ID" value={form.leader.id} onChange={(e) => updateField("leader.id", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaderProgram">Program <span className="text-red-500">*</span></Label>
                        <Input id="leaderProgram" placeholder="e.g., B.Tech CSE" value={form.leader.program} onChange={(e) => updateField("leader.program", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaderYear">Year <span className="text-red-500">*</span></Label>
                        <Input id="leaderYear" placeholder="e.g., 3rd" value={form.leader.year} onChange={(e) => updateField("leader.year", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaderEmail">Email <span className="text-red-500">*</span></Label>
                        <Input id="leaderEmail" type="email" placeholder="email@example.com" value={form.leader.email} onChange={(e) => updateField("leader.email", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaderPhone">Phone <span className="text-red-500">*</span></Label>
                        <Input 
                          id="leaderPhone" 
                          type="tel" 
                          placeholder="10-digit mobile (e.g., 9876543210)" 
                          value={form.leader.phone} 
                          onChange={(e) => updateField("leader.phone", e.target.value.replace(/[^0-9]/g, ''))}
                          pattern="[6-9][0-9]{9}"
                          maxLength={10}
                          required 
                        />
                        <p className="text-xs text-gray-500">Enter 10-digit Indian mobile number</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Steps 3-5: Member Details */}
            {[0, 1, 2].map((idx) => (
              currentStep === idx + 3 && (
                <motion.div
                  key={`step${idx + 3}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Member {idx + 1} <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>
                      </CardTitle>
                      {form.members[idx].name.trim() && (
                        <CardDescription className="text-amber-600 font-medium">
                          ⚠️ All fields are required when name is filled
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`member${idx}Name`}>Full Name</Label>
                          <Input id={`member${idx}Name`} placeholder="Full Name" value={form.members[idx].name} onChange={(e) => updateField(`members[${idx}].name`, e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member${idx}Id`}>
                            Student ID {form.members[idx].name.trim() && <span className="text-red-500">*</span>}
                          </Label>
                          <Input id={`member${idx}Id`} placeholder="Student ID" value={form.members[idx].id} onChange={(e) => updateField(`members[${idx}].id`, e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member${idx}Program`}>
                            Program {form.members[idx].name.trim() && <span className="text-red-500">*</span>}
                          </Label>
                          <Input id={`member${idx}Program`} placeholder="Program" value={form.members[idx].program} onChange={(e) => updateField(`members[${idx}].program`, e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member${idx}Year`}>
                            Year {form.members[idx].name.trim() && <span className="text-red-500">*</span>}
                          </Label>
                          <Input id={`member${idx}Year`} placeholder="Year" value={form.members[idx].year} onChange={(e) => updateField(`members[${idx}].year`, e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member${idx}Email`}>
                            Email {form.members[idx].name.trim() && <span className="text-red-500">*</span>}
                          </Label>
                          <Input 
                            id={`member${idx}Email`} 
                            type="email" 
                            placeholder="email@example.com" 
                            value={form.members[idx].email} 
                            onChange={(e) => updateField(`members[${idx}].email`, e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member${idx}Phone`}>
                            Phone {form.members[idx].name.trim() && <span className="text-red-500">*</span>}
                          </Label>
                          <Input 
                            id={`member${idx}Phone`} 
                            type="tel" 
                            placeholder="10-digit mobile" 
                            value={form.members[idx].phone} 
                            onChange={(e) => updateField(`members[${idx}].phone`, e.target.value.replace(/[^0-9]/g, ''))}
                            pattern="[6-9][0-9]{9}"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            ))}

            {/* Step 6: Idea Description */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      💡 Brief Explanation of your Idea
                    </CardTitle>
                    <CardDescription>Tell us about your hackathon idea</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ideaDescription">
                        Brief Explanation of your Idea <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="ideaDescription"
                        placeholder="Briefly describe your team's idea for the hackathon. What problem are you solving? What's your solution?"
                        value={form.ideaDescription}
                        onChange={(e) => updateField("ideaDescription", e.target.value)}
                        className="min-h-[200px]"
                        maxLength={500}
                        required
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Share your innovative idea with us
                        </p>
                        <p className="text-sm font-medium text-[#0b2b54]">
                          {form.ideaDescription.length}/500 characters
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 7: Terms & Submit */}
            {currentStep === 7 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-amber-200 bg-amber-50/30">
                  <CardHeader>
                    <CardTitle>Terms & Conditions</CardTitle>
                    <CardDescription>Please review and accept the terms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms" checked={form.terms} onCheckedChange={(checked) => updateField("terms", checked)} className="mt-1" />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="terms" className="text-sm font-medium leading-relaxed cursor-pointer">
                          I accept the rules and regulations of <span className="font-bold text-[#0b2b54]">HACK-TO-HIRE Ideathon 2025</span> and consent to be contacted by the organizing team. <span className="text-red-500">*</span>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-[#0b2b54] mb-3">Registration Summary</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Team Name:</dt>
                          <dd className="font-medium">{form.teamName || "—"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Domain:</dt>
                          <dd className="font-medium">{form.domain}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Team Leader:</dt>
                          <dd className="font-medium">{form.leader.name || "—"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Leader Email:</dt>
                          <dd className="font-medium">{form.leader.email || "—"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Total Members:</dt>
                          <dd className="font-medium">
                            {1 + form.members.filter(m => m.name.trim()).length}
                          </dd>
                        </div>
                        {form.ideaDescription && (
                          <div className="pt-2 border-t border-blue-300">
                            <dt className="text-gray-600 mb-1">Idea Description:</dt>
                            <dd className="font-medium text-gray-700 whitespace-pre-wrap">{form.ideaDescription}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 h-12"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 h-12 bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] hover:from-[#1e5a9e] hover:to-[#0b2b54]"
              >
                Next
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] hover:from-[#1e5a9e] hover:to-[#0b2b54]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    🚀 Register Team Now
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {success && (
          <motion.div 
            key="success-modal"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            onClick={() => setSuccess(null)}
            style={{}}
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.5, opacity: 0, y: 50 }} 
              transition={{ type: "spring", duration: 0.6, bounce: 0.4 }} 
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{}}
            >
              <Card className="w-full max-w-md shadow-2xl border-2 border-green-200">
                <CardHeader className="text-center pb-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    style={{}}
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Registration Successful! 🎉
                    </CardTitle>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <CardDescription className="text-base mt-2">
                      Your team has been registered successfully for HACK-TO-HIRE Ideathon 2025
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5 text-center"
                    style={{}}
                  >
                    <p className="text-sm text-gray-600 mb-2 font-medium">Your Registration ID</p>
                    <motion.p 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.1, 1] }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="text-3xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-all"
                      style={{}}
                    >
                      {success.regId}
                    </motion.p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                    style={{}}
                  >
                    <p className="text-sm text-amber-800">
                      📧 <span className="font-medium">Important:</span> Save this Registration ID! Check your email for confirmation details.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3"
                    style={{}}
                  >
                    <Button 
                      onClick={copyRegId} 
                      variant="outline" 
                      className="flex-1 h-12 border-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "✓ Copied!" : "Copy ID"}
                    </Button>
                    <Button 
                      onClick={() => setSuccess(null)} 
                      className="flex-1 h-12 bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] hover:from-[#1e5a9e] hover:to-[#0b2b54] shadow-lg"
                    >
                      Close
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Confetti Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 pointer-events-none"
              style={{}}
            >
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -20, 
                    x: Math.random() * window.innerWidth,
                    opacity: 1 
                  }}
                  animate={{ 
                    y: window.innerHeight + 20,
                    rotate: Math.random() * 360,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 2,
                    delay: Math.random() * 0.5,
                    ease: "linear"
                  }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
