"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Eye, Edit, Trash2, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Registration = {
  id: string
  regId: string
  teamName: string
  domain: string
  leader: {
    name: string
    id: string
    program: string
    year: string
    email: string
    phone: string
  }
  members: Array<{
    name: string
    id: string
    program: string
    year: string
    email: string
    phone: string
  }>
  ideaDescription: string
  status: string
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchRegistrations()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem("adminAuth", "true")
        fetchRegistrations()
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("adminAuth")
    setRegistrations([])
  }

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/registrations")
      const data = await res.json()
      if (data.success) {
        setRegistrations(data.registrations)
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return
    
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        fetchRegistrations()
      }
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

  const handleUpdate = async () => {
    if (!selectedReg) return
    
    try {
      const res = await fetch(`/api/admin/registrations/${selectedReg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedReg),
      })
      const data = await res.json()
      if (data.success) {
        fetchRegistrations()
        setIsEditMode(false)
        setSelectedReg(null)
      }
    } catch (err) {
      console.error("Failed to update:", err)
    }
  }

  const filteredRegistrations = registrations.filter(reg => 
    reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.regId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.leader.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>HACK-TO-HIRE Ideathon 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e]">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">HACK-TO-HIRE Ideathon 2025</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full sm:w-auto">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0b2b54]">{registrations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Blockchain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {registrations.filter(r => r.domain === "Blockchain").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">AIML</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {registrations.filter(r => r.domain === "AIML").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Open Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {registrations.filter(r => r.domain === "Open Innovation").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4 sm:mb-6">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={fetchRegistrations} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No registrations found</div>
              ) : (
                filteredRegistrations.map((reg) => (
                  <Card key={reg.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-mono text-xs text-gray-500">{reg.regId}</p>
                          <h3 className="font-bold text-lg">{reg.teamName}</h3>
                        </div>
                        <Badge>{reg.domain}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-3">
                        <div>
                          <p className="text-gray-500 text-xs">Leader</p>
                          <p className="font-medium">{reg.leader.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Email</p>
                          <p className="truncate">{reg.leader.email}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-gray-500 text-xs">Members</p>
                            <p className="font-medium">{reg.members.filter(m => m.name).length}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-xs">Date</p>
                            <p className="font-medium text-xs">
                              {new Date(reg.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(reg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedReg(reg)
                                setIsEditMode(false)
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {isEditMode ? "Edit" : "View"} Registration
                              </DialogTitle>
                              <DialogDescription>{selectedReg?.regId}</DialogDescription>
                            </DialogHeader>
                            {selectedReg && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Team Name</Label>
                                    {isEditMode ? (
                                      <Input
                                        value={selectedReg.teamName}
                                        onChange={(e) => setSelectedReg({...selectedReg, teamName: e.target.value})}
                                      />
                                    ) : (
                                      <p className="font-medium">{selectedReg.teamName}</p>
                                    )}
                                  </div>
                                  <div>
                                    <Label>Domain</Label>
                                    <p className="font-medium">{selectedReg.domain}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Leader</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div><strong>Name:</strong> {selectedReg.leader.name}</div>
                                    <div><strong>ID:</strong> {selectedReg.leader.id}</div>
                                    <div><strong>Program:</strong> {selectedReg.leader.program}</div>
                                    <div><strong>Year:</strong> {selectedReg.leader.year}</div>
                                    <div className="sm:col-span-2"><strong>Email:</strong> <span className="break-all">{selectedReg.leader.email}</span></div>
                                    <div><strong>Phone:</strong> {selectedReg.leader.phone}</div>
                                  </div>
                                </div>

                                {selectedReg.members.filter(m => m.name).length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Members</h3>
                                    {selectedReg.members.filter(m => m.name).map((member, idx) => (
                                      <div key={idx} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                                        <p className="font-medium">{idx + 1}. {member.name}</p>
                                        <p className="break-all">{member.email} | {member.phone}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div>
                                  <Label>Idea</Label>
                                  {isEditMode ? (
                                    <Textarea
                                      value={selectedReg.ideaDescription}
                                      onChange={(e) => setSelectedReg({...selectedReg, ideaDescription: e.target.value})}
                                      rows={3}
                                    />
                                  ) : (
                                    <p className="text-sm">{selectedReg.ideaDescription}</p>
                                  )}
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                  {isEditMode ? (
                                    <>
                                      <Button onClick={handleUpdate} size="sm">Save</Button>
                                      <Button variant="outline" size="sm" onClick={() => setIsEditMode(false)}>Cancel</Button>
                                    </>
                                  ) : (
                                    <Button onClick={() => setIsEditMode(true)} size="sm">
                                      <Edit className="w-4 h-4 mr-2" />Edit
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(reg.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg ID</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No registrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-mono text-sm">{reg.regId}</TableCell>
                        <TableCell className="font-medium">{reg.teamName}</TableCell>
                        <TableCell>
                          <Badge>{reg.domain}</Badge>
                        </TableCell>
                        <TableCell>{reg.leader.name}</TableCell>
                        <TableCell className="text-sm">{reg.leader.email}</TableCell>
                        <TableCell>{reg.members.filter(m => m.name).length}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {new Date(reg.createdAt).toLocaleDateString()}<br/>
                          <span className="text-xs text-gray-500">
                            {new Date(reg.createdAt).toLocaleTimeString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedReg(reg)
                                    setIsEditMode(false)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    {isEditMode ? "Edit" : "View"} Registration
                                  </DialogTitle>
                                  <DialogDescription>{selectedReg?.regId}</DialogDescription>
                                </DialogHeader>
                                {selectedReg && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Team Name</Label>
                                        {isEditMode ? (
                                          <Input
                                            value={selectedReg.teamName}
                                            onChange={(e) => setSelectedReg({...selectedReg, teamName: e.target.value})}
                                          />
                                        ) : (
                                          <p className="font-medium">{selectedReg.teamName}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>Domain</Label>
                                        <p className="font-medium">{selectedReg.domain}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="font-semibold mb-2">Leader</h3>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><strong>Name:</strong> {selectedReg.leader.name}</div>
                                        <div><strong>ID:</strong> {selectedReg.leader.id}</div>
                                        <div><strong>Program:</strong> {selectedReg.leader.program}</div>
                                        <div><strong>Year:</strong> {selectedReg.leader.year}</div>
                                        <div><strong>Email:</strong> {selectedReg.leader.email}</div>
                                        <div><strong>Phone:</strong> {selectedReg.leader.phone}</div>
                                      </div>
                                    </div>

                                    {selectedReg.members.filter(m => m.name).length > 0 && (
                                      <div>
                                        <h3 className="font-semibold mb-2">Members</h3>
                                        {selectedReg.members.filter(m => m.name).map((member, idx) => (
                                          <div key={idx} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                                            <p className="font-medium">{idx + 1}. {member.name}</p>
                                            <p>{member.email} | {member.phone}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    <div>
                                      <Label>Idea</Label>
                                      {isEditMode ? (
                                        <Textarea
                                          value={selectedReg.ideaDescription}
                                          onChange={(e) => setSelectedReg({...selectedReg, ideaDescription: e.target.value})}
                                          rows={3}
                                        />
                                      ) : (
                                        <p className="text-sm">{selectedReg.ideaDescription}</p>
                                      )}
                                    </div>

                                    <div className="flex gap-2">
                                      {isEditMode ? (
                                        <>
                                          <Button onClick={handleUpdate} size="sm">Save</Button>
                                          <Button variant="outline" size="sm" onClick={() => setIsEditMode(false)}>Cancel</Button>
                                        </>
                                      ) : (
                                        <Button onClick={() => setIsEditMode(true)} size="sm">
                                          <Edit className="w-4 h-4 mr-2" />Edit
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(reg.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
