"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil, Trash2, Plus, LogOut, Eye, EyeOff, Upload, Save, RefreshCw } from "lucide-react"
import { siteConfig as defaultConfig } from "@/lib/config-data"

type SiteConfig = typeof defaultConfig

const ADMIN_PASSWORD = "dmt"
const AUTH_KEY = "lumenwave_auth"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Project editing state - controlled inputs
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [projectForm, setProjectForm] = useState({
    id: "",
    titlePt: "",
    titleEn: "",
    descriptionPt: "",
    descriptionEn: "",
    image: "",
    link: "",
    technologies: "",
    featured: false,
  })

  // FAQ editing state - controlled inputs
  const [isFAQDialogOpen, setIsFAQDialogOpen] = useState(false)
  const [faqForm, setFaqForm] = useState({
    id: 0,
    questionPt: "",
    questionEn: "",
    answerPt: "",
    answerEn: "",
  })

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY)
    if (auth === "true") {
      setIsAuthenticated(true)
      loadConfig()
    } else {
      setLoading(false)
    }
  }, [])

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 4000)
  }

  const loadConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/config', { cache: 'no-store' })
      const data = await response.json()
      if (data.success && data.config) {
        // Merge com defaultConfig para garantir todos os campos
        const mergedConfig = {
          ...defaultConfig,
          ...data.config,
          projects: data.config.projects || defaultConfig.projects,
          faq: data.config.faq || defaultConfig.faq,
          about: { ...defaultConfig.about, ...data.config.about },
          seo: { ...defaultConfig.seo, ...data.config.seo },
        }
        setConfig(mergedConfig)
      } else {
        setConfig(defaultConfig)
      }
    } catch (error) {
      console.error('[v0] Erro ao carregar config:', error)
      setConfig(defaultConfig)
    }
    setLoading(false)
  }

  const saveConfig = async (newConfig: SiteConfig) => {
    setSaving(true)
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      })
      const data = await response.json()
      if (data.success) {
        setConfig(newConfig)
        showMessage("success", "Configuracoes salvas com sucesso!")
        return true
      } else {
        showMessage("error", "Erro ao salvar configuracoes")
        return false
      }
    } catch (error) {
      console.error('[v0] Erro ao salvar config:', error)
      showMessage("error", "Erro ao salvar configuracoes")
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success && data.url) {
        showMessage("success", "Imagem carregada com sucesso!")
        return data.url
      } else {
        showMessage("error", "Erro ao carregar imagem")
        return null
      }
    } catch (error) {
      console.error('[v0] Erro ao fazer upload:', error)
      showMessage("error", "Erro ao carregar imagem")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true")
      setIsAuthenticated(true)
      loadConfig()
      setError("")
    } else {
      setError("Senha incorreta")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
    router.push("/")
  }

  // Profile image handler
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const url = await handleImageUpload(file)
    if (url) {
      const newConfig = { ...config, profileImage: url }
      await saveConfig(newConfig)
    }
  }

  // Project handlers
  const openAddProject = () => {
    setProjectForm({
      id: Date.now().toString(),
      titlePt: "",
      titleEn: "",
      descriptionPt: "",
      descriptionEn: "",
      image: "/project-1.png",
      link: "",
      technologies: "",
      featured: false,
    })
    setIsProjectDialogOpen(true)
  }

  const openEditProject = (project: SiteConfig["projects"][0]) => {
    setProjectForm({
      id: project.id,
      titlePt: project.title.pt,
      titleEn: project.title.en,
      descriptionPt: project.description.pt,
      descriptionEn: project.description.en,
      image: project.image,
      link: project.link,
      technologies: project.technologies.join(", "),
      featured: project.featured || false,
    })
    setIsProjectDialogOpen(true)
  }

  const handleProjectImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const url = await handleImageUpload(file)
    if (url) {
      setProjectForm(prev => ({ ...prev, image: url }))
    }
  }

  const handleSaveProject = async () => {
    const updatedProject = {
      id: projectForm.id,
      title: { pt: projectForm.titlePt, en: projectForm.titleEn },
      description: { pt: projectForm.descriptionPt, en: projectForm.descriptionEn },
      image: projectForm.image,
      link: projectForm.link,
      technologies: projectForm.technologies.split(",").map(t => t.trim()).filter(Boolean),
      featured: projectForm.featured,
    }

    const existingIndex = config.projects.findIndex(p => p.id === projectForm.id)
    const newProjects = [...config.projects]

    if (existingIndex >= 0) {
      newProjects[existingIndex] = updatedProject
    } else {
      newProjects.push(updatedProject)
    }

    const success = await saveConfig({ ...config, projects: newProjects })
    if (success) {
      setIsProjectDialogOpen(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return
    
    const newConfig = {
      ...config,
      projects: config.projects.filter(p => p.id !== id),
    }
    await saveConfig(newConfig)
  }

  // FAQ handlers
  const openAddFAQ = () => {
    setFaqForm({
      id: Date.now(),
      questionPt: "",
      questionEn: "",
      answerPt: "",
      answerEn: "",
    })
    setIsFAQDialogOpen(true)
  }

  const openEditFAQ = (faq: SiteConfig["faq"][0]) => {
    setFaqForm({
      id: faq.id,
      questionPt: faq.question.pt,
      questionEn: faq.question.en,
      answerPt: faq.answer.pt,
      answerEn: faq.answer.en,
    })
    setIsFAQDialogOpen(true)
  }

  const handleSaveFAQ = async () => {
    const updatedFAQ = {
      id: faqForm.id,
      question: { pt: faqForm.questionPt, en: faqForm.questionEn },
      answer: { pt: faqForm.answerPt, en: faqForm.answerEn },
    }

    const existingIndex = config.faq.findIndex(f => f.id === faqForm.id)
    const newFAQ = [...config.faq]

    if (existingIndex >= 0) {
      newFAQ[existingIndex] = updatedFAQ
    } else {
      newFAQ.push(updatedFAQ)
    }

    const success = await saveConfig({ ...config, faq: newFAQ })
    if (success) {
      setIsFAQDialogOpen(false)
    }
  }

  const handleDeleteFAQ = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta pergunta?")) return
    
    const newConfig = {
      ...config,
      faq: config.faq.filter(f => f.id !== id),
    }
    await saveConfig(newConfig)
  }

  // Spline handler
  const [splineUrl, setSplineUrl] = useState("")
  
  useEffect(() => {
    setSplineUrl(config.splineUrl || "")
  }, [config.splineUrl])

  const handleSaveSpline = async () => {
    await saveConfig({ ...config, splineUrl })
  }

  const handleResetToDefault = async () => {
    if (confirm("Tem certeza que deseja resetar todas as configuracoes para o padrao?")) {
      await saveConfig(defaultConfig)
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Digite a senha para acessar o painel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center text-white">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-gray-400">Gerencie projetos, FAQ, foto de perfil e Spline 3D</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetToDefault}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resetar
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {message.text}
          </div>
        )}

        {(saving || uploading) && (
          <div className="p-4 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {uploading ? "Enviando imagem..." : "Salvando..."}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="spline">Spline 3D</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>Altere sua foto de perfil que aparece no site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-primary/30">
                    <img
                      src={config.profileImage || "/profile.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/profile.png"
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <Upload size={18} />
                        {uploading ? "Enviando..." : "Carregar Nova Foto"}
                      </div>
                    </Label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                      disabled={uploading}
                    />
                    <p className="text-sm text-muted-foreground">Formatos: JPG, PNG. Max 5MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spline Tab */}
          <TabsContent value="spline">
            <Card>
              <CardHeader>
                <CardTitle>Modelo 3D Spline</CardTitle>
                <CardDescription>Configure o modelo 3D que aparece na secao hero do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spline-url">URL do Spline</Label>
                  <Input
                    id="spline-url"
                    value={splineUrl}
                    onChange={(e) => setSplineUrl(e.target.value)}
                    placeholder="https://my.spline.design/..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Cole a URL de compartilhamento do seu modelo Spline (spline.design)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Preview do Spline</Label>
                  <div className="w-full h-64 rounded-lg overflow-hidden border border-border bg-muted">
                    {splineUrl ? (
                      <iframe src={splineUrl} className="w-full h-full border-0" title="Spline Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Nenhum modelo configurado
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={handleSaveSpline} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar URL do Spline"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Projetos ({config.projects.length})</h2>
              <Button onClick={openAddProject}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {config.projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="p-4">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title.pt}
                      className="w-full h-32 object-cover rounded-md mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                    <CardTitle className="text-base line-clamp-1">{project.title.pt}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">{project.description.pt}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditProject(project)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">FAQ ({config.faq.length})</h2>
              <Button onClick={openAddFAQ}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>

            <div className="grid gap-4">
              {config.faq.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{faq.question.pt}</CardTitle>
                    <CardDescription className="line-clamp-2">{faq.answer.pt}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditFAQ(faq)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteFAQ(faq.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Project Dialog */}
        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{projectForm.titlePt ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
              <DialogDescription>Preencha os dados do projeto</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titulo (PT)</Label>
                  <Input
                    value={projectForm.titlePt}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, titlePt: e.target.value }))}
                    placeholder="Nome do projeto em portugues"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titulo (EN)</Label>
                  <Input
                    value={projectForm.titleEn}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, titleEn: e.target.value }))}
                    placeholder="Project name in English"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descricao (PT)</Label>
                <Textarea
                  value={projectForm.descriptionPt}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, descriptionPt: e.target.value }))}
                  placeholder="Descricao do projeto em portugues"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Descricao (EN)</Label>
                <Textarea
                  value={projectForm.descriptionEn}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  placeholder="Project description in English"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem do Projeto</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded overflow-hidden bg-muted border">
                    <img
                      src={projectForm.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-sm">
                        <Upload size={16} />
                        {uploading ? "Enviando..." : "Alterar Imagem"}
                      </div>
                    </Label>
                    <input
                      id="project-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProjectImageChange}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Link do Projeto</Label>
                <Input
                  value={projectForm.link}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label>Tecnologias (separadas por virgula)</Label>
                <Input
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, Next.js, TypeScript"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured">Projeto em Destaque</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveProject} disabled={saving || uploading}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* FAQ Dialog */}
        <Dialog open={isFAQDialogOpen} onOpenChange={setIsFAQDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{faqForm.questionPt ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle>
              <DialogDescription>Preencha a pergunta e resposta</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pergunta (PT)</Label>
                  <Input
                    value={faqForm.questionPt}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, questionPt: e.target.value }))}
                    placeholder="Pergunta em portugues"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pergunta (EN)</Label>
                  <Input
                    value={faqForm.questionEn}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, questionEn: e.target.value }))}
                    placeholder="Question in English"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resposta (PT)</Label>
                <Textarea
                  value={faqForm.answerPt}
                  onChange={(e) => setFaqForm(prev => ({ ...prev, answerPt: e.target.value }))}
                  placeholder="Resposta em portugues"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Resposta (EN)</Label>
                <Textarea
                  value={faqForm.answerEn}
                  onChange={(e) => setFaqForm(prev => ({ ...prev, answerEn: e.target.value }))}
                  placeholder="Answer in English"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsFAQDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveFAQ} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
