import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Clock, 
  Bell, 
  Users, 
  Check, 
  Zap,
  Search,
  BarChart3,
  Mail,
  Settings,
  Home,
  ChevronRight,
  TrendingUp,
  Play,
  Send,
  RefreshCw,
  Target,
  Inbox,
  Sparkles,
  ArrowRight,
  CalendarClock
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

/**
 * Translations
 */
const translations = {
  en: {
    nav: { product: "Product", pricing: "Pricing", about: "About", signIn: "Get Started" },
    hero: {
      badge: "✨ AI-Powered Automation",
      headline1: "Automate your DMs",
      headline2: "Convert more",
      highlight: "Leads",
      subtitle: "Never lose a lead again. AI responds instantly to every DM on WhatsApp & Instagram, sends smart follow-ups, and alerts you only when action is needed.",
      cta1: "Start Free Trial",
      cta2: "Watch Demo"
    },
    stats: {
      stat1: "< 3s",
      stat1Label: "Response Time",
      stat2: "24/7",
      stat2Label: "Always On",
      stat3: "300%",
      stat3Label: "More Conversions"
    },
    features: {
      tag: "How it Works",
      title: "From first DM to closed deal",
      subtitle: "Capture, nurture, and convert leads on autopilot.",
      tabs: ["Auto-Reply", "Follow-ups", "Lead Scoring", "Alerts"],
      tabContent: {
        title: "Instant Auto-Reply",
        desc: "AI responds to every message in seconds. Personalized based on keywords, time, and customer intent."
      }
    },
    grid: {
      title1: "Unified Inbox",
      desc1: "WhatsApp, Instagram, Email — all messages in one place.",
      title2: "Smart Follow-ups",
      desc2: "Automated sequences that nurture until they convert.",
      title3: "Lead Scoring",
      desc3: "AI identifies your hottest prospects automatically.",
      title4: "Templates",
      desc4: "Pre-built responses for common questions.",
      title5: "Analytics",
      desc5: "Track conversions and team performance."
    },
    integrations: {
      tag: "Integrations",
      title: "All your channels. One inbox.",
      subtitle: "Connect WhatsApp, Instagram, and more in minutes.",
      cta: "See all integrations"
    },
    pricing: {
      title: "Simple pricing",
      subtitle: "One plan. Everything included. Cancel anytime.",
      badge: "Most Popular",
      planTitle: "Pro Plan",
      planSubtitle: "Everything to automate your leads",
      setup: "Setup",
      setupPrice: "€100",
      monthly: "€50",
      features: [
        "Unlimited auto-replies",
        "Smart follow-up sequences",
        "WhatsApp + Instagram",
        "Lead scoring",
        "Priority support"
      ],
      cta: "Start Free Trial"
    },
    contact: {
      tag: "Contact",
      title: "Ready to automate?",
      subtitle: "Get a demo in 24 hours.",
      email: "Email",
      message: "Message",
      send: "Send",
      or: "or",
      success: "Sent!",
      error: "Fill all fields."
    },
    footer: {
      copy: "© 2025 Zyllo",
      status: "All systems operational"
    }
  },
  pt: {
    nav: { product: "Produto", pricing: "Preços", about: "Sobre", signIn: "Começar" },
    hero: {
      badge: "✨ Automação com IA",
      headline1: "Automatize as suas DMs",
      headline2: "Converta mais",
      highlight: "Leads",
      subtitle: "Nunca perca um lead. A IA responde instantaneamente a cada DM no WhatsApp e Instagram, envia follow-ups inteligentes, e alerta-o apenas quando precisar agir.",
      cta1: "Começar Grátis",
      cta2: "Ver Demo"
    },
    stats: {
      stat1: "< 3s",
      stat1Label: "Tempo de Resposta",
      stat2: "24/7",
      stat2Label: "Sempre Ativo",
      stat3: "300%",
      stat3Label: "Mais Conversões"
    },
    features: {
      tag: "Como Funciona",
      title: "Da primeira DM ao negócio fechado",
      subtitle: "Capture, nutra e converta leads em piloto automático.",
      tabs: ["Auto-Resposta", "Follow-ups", "Pontuação", "Alertas"],
      tabContent: {
        title: "Auto-Resposta Instantânea",
        desc: "A IA responde a cada mensagem em segundos. Personalizado com base em palavras-chave, hora e intenção."
      }
    },
    grid: {
      title1: "Caixa Unificada",
      desc1: "WhatsApp, Instagram, Email — todas as mensagens num só lugar.",
      title2: "Follow-ups Inteligentes",
      desc2: "Sequências automáticas que nutrem até converterem.",
      title3: "Pontuação de Leads",
      desc3: "IA identifica os seus prospects mais quentes.",
      title4: "Templates",
      desc4: "Respostas pré-definidas para perguntas comuns.",
      title5: "Analytics",
      desc5: "Acompanhe conversões e performance."
    },
    integrations: {
      tag: "Integrações",
      title: "Todos os canais. Uma caixa.",
      subtitle: "Conecte WhatsApp, Instagram e mais em minutos.",
      cta: "Ver todas"
    },
    pricing: {
      title: "Preço simples",
      subtitle: "Um plano. Tudo incluído. Cancele quando quiser.",
      badge: "Mais Popular",
      planTitle: "Plano Pro",
      planSubtitle: "Tudo para automatizar os seus leads",
      setup: "Configuração",
      setupPrice: "100€",
      monthly: "50€",
      features: [
        "Auto-respostas ilimitadas",
        "Sequências de follow-up",
        "WhatsApp + Instagram",
        "Pontuação de leads",
        "Suporte prioritário"
      ],
      cta: "Começar Grátis"
    },
    contact: {
      tag: "Contacto",
      title: "Pronto para automatizar?",
      subtitle: "Receba uma demo em 24 horas.",
      email: "Email",
      message: "Mensagem",
      send: "Enviar",
      or: "ou",
      success: "Enviado!",
      error: "Preencha tudo."
    },
    footer: {
      copy: "© 2025 Zyllo",
      status: "Sistemas operacionais"
    }
  }
}

/* Icons */
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

/* Header */
function Header({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled 
        ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/5 py-4" 
        : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Zyllo</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['features', 'pricing'].map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {t.nav[item] || item}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white/10 rounded-lg p-0.5">
            <button onClick={() => setLang('en')} className={cn(
              "px-2.5 py-1 text-xs font-bold rounded-md transition-all",
              lang === 'en' ? "bg-white/20 text-white" : "text-white/50"
            )}>EN</button>
            <button onClick={() => setLang('pt')} className={cn(
              "px-2.5 py-1 text-xs font-bold rounded-md transition-all",
              lang === 'pt' ? "bg-white/20 text-white" : "text-white/50"
            )}>PT</button>
          </div>
          <a href="#pricing" className="btn-glossy h-10 px-6 text-sm text-white flex items-center gap-2">
            {t.nav.signIn}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  )
}

/* Hero */
function Hero({ t }) {
  return (
    <section className="bg-tech-grid min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 pt-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8 animate-slide-up">
              <span className="text-sm font-medium text-white/90">{t.hero.badge}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-gradient-white">{t.hero.headline1}</span><br />
              <span className="text-white/60">{t.hero.headline2} </span>
              <span className="text-gradient glow-text">{t.hero.highlight}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button className="btn-glossy h-14 px-8 text-white text-lg flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5" />
                {t.hero.cta1}
              </button>
              <button className="btn-glossy-secondary h-14 px-8 text-white text-lg flex items-center justify-center gap-3">
                <Play className="w-5 h-5" />
                {t.hero.cta2}
              </button>
            </div>
            
            <div className="flex justify-center gap-12 md:gap-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: t.stats.stat1, label: t.stats.stat1Label },
                { value: t.stats.stat2, label: t.stats.stat2Label },
                { value: t.stats.stat3, label: t.stats.stat3Label }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Mockup */}
          <div className="relative max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="hero-mockup backdrop-blur-xl">
              <div className="bg-gradient-to-r from-violet-600/80 to-purple-600/80 backdrop-blur-sm p-4 flex items-center gap-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <span className="text-white/60 text-sm font-medium ml-4">Zyllo Inbox</span>
                <div className="ml-auto flex items-center gap-2 text-white/60 text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online
                </div>
              </div>
              
              <div className="p-6 space-y-4 bg-slate-950/50">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex-shrink-0 shadow-lg shadow-pink-500/20" />
                  <div className="card-glass p-4 max-w-xs">
                    <p className="text-white/90 text-sm">Olá! Quanto custa o serviço de limpeza facial? 💆‍♀️</p>
                    <p className="text-white/40 text-xs mt-2">14:32</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl rounded-tr-sm p-4 max-w-sm shadow-lg shadow-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3 h-3 text-white/70" />
                      <span className="text-xs text-white/60">Auto-reply</span>
                    </div>
                    <p className="text-white text-sm">Olá! 😊 O nosso tratamento custa 45€. Quer agendar? Temos horários esta semana!</p>
                    <p className="text-white/50 text-xs mt-2">14:32 • Enviado automaticamente</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 flex items-center gap-2 text-sm backdrop-blur-sm">
                    <CalendarClock className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300">Follow-up agendado para amanhã</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-violet-500/30 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* Features - Dark Tech Style */
function Features({ t }) {
  const [activeTab, setActiveTab] = useState(0)
  const tabIcons = [Send, RefreshCw, Target, Bell]
  
  return (
    <section id="features" className="py-28 bg-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">{t.features.tag}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t.features.title}</h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">{t.features.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="md:col-span-4 space-y-2">
            {t.features.tabs.map((tab, i) => {
              const Icon = tabIcons[i]
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all flex items-center gap-3",
                    activeTab === i 
                      ? "bg-white/10 border border-white/10 text-white" 
                      : "text-white/40 hover:text-white/60 hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    activeTab === i 
                      ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30" 
                      : "bg-white/5"
                  )}>
                    <Icon className={cn("w-5 h-5", activeTab === i ? "text-white" : "text-white/40")} />
                  </div>
                  {tab}
                </button>
              )
            })}
          </div>
          
          {/* Content */}
          <div className="md:col-span-8">
            <div className="card-glass p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Send className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t.features.tabContent.title}</h3>
                  <p className="text-sm text-white/40">24/7 intelligent responses</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Active
                  </div>
                  <span className="text-sm text-white/40">127 messages today</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "2.3s", label: "Avg. response", color: "violet" },
                    { value: "98%", label: "Reply rate", color: "green" },
                    { value: "42", label: "Leads today", color: "amber" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className={cn(
                        "text-2xl font-bold",
                        stat.color === 'violet' && "text-violet-400",
                        stat.color === 'green' && "text-green-400",
                        stat.color === 'amber' && "text-amber-400"
                      )}>{stat.value}</div>
                      <div className="text-xs text-white/40">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-white/60 leading-relaxed">{t.features.tabContent.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Feature Grid - Dark Tech Style */
function FeatureGrid({ t }) {
  const items = [
    { icon: Inbox, title: t.grid.title1, desc: t.grid.desc1 },
    { icon: RefreshCw, title: t.grid.title2, desc: t.grid.desc2 },
    { icon: Target, title: t.grid.title3, desc: t.grid.desc3 },
    { icon: MessageSquare, title: t.grid.title4, desc: t.grid.desc4 },
    { icon: BarChart3, title: t.grid.title5, desc: t.grid.desc5 }
  ]
  
  return (
    <section className="py-28 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-tech-grid opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div key={i} className="card-glass p-6 group hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-5 group-hover:from-violet-500 group-hover:to-purple-600 group-hover:border-transparent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/30">
                <item.icon className="w-7 h-7 text-violet-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Integrations - Dark Tech Style */
function Integrations({ t }) {
  return (
    <section className="py-28 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">{t.integrations.tag}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{t.integrations.title}</h2>
            <p className="text-xl text-white/50 mb-10 leading-relaxed">{t.integrations.subtitle}</p>
            <a href="#" className="inline-flex items-center gap-2 text-violet-400 font-semibold hover:gap-3 transition-all">
              {t.integrations.cta} <ChevronRight className="w-5 h-5" />
            </a>
          </div>
          
          <div className="card-glass p-6">
            <div className="space-y-3">
              {[
                { name: "WhatsApp Business", desc: "Direct messaging", icon: <WhatsAppIcon className="w-5 h-5" />, connected: true, color: "bg-green-500" },
                { name: "Instagram DM", desc: "Social engagement", icon: <InstagramIcon className="w-5 h-5" />, connected: true, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
                { name: "Facebook Messenger", desc: "Page messages", icon: "💬", connected: false, color: "bg-blue-500" },
                { name: "Email (SMTP)", desc: "Email integration", icon: <Mail className="w-5 h-5" />, connected: false, color: "bg-slate-500" }
              ].map((tool, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all",
                  tool.connected 
                    ? "bg-violet-500/10 border border-violet-500/30" 
                    : "bg-white/5 border border-white/5 hover:bg-white/10"
                )}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", tool.color)}>
                    {typeof tool.icon === 'string' ? tool.icon : tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{tool.name}</div>
                    <div className="text-xs text-white/40">{tool.desc}</div>
                  </div>
                  {tool.connected && (
                    <div className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Pricing - Dark Tech Style */
function Pricing({ t }) {
  return (
    <section id="pricing" className="py-28 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-tech-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t.pricing.title}</h2>
          <p className="text-xl text-white/50">{t.pricing.subtitle}</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl blur-lg opacity-50" />
            
            <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-violet-500/50">
              <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                <div className="relative">
                  <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">{t.pricing.badge}</div>
                  <h3 className="text-2xl font-bold mb-2">{t.pricing.planTitle}</h3>
                  <p className="text-violet-200">{t.pricing.planSubtitle}</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-10">
                  <span className="text-6xl font-bold text-white">{t.pricing.monthly}</span>
                  <span className="text-white/50 text-lg">/mo</span>
                </div>
                
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-5 mb-8 text-center">
                  <span className="text-sm text-white/50">{t.pricing.setup}: </span>
                  <span className="font-bold text-white">{t.pricing.setupPrice}</span>
                  <span className="text-xs text-white/40 block mt-1">One-time</span>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {t.pricing.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-4 text-white/80">
                      <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/30">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="btn-glossy w-full h-14 text-white text-lg font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t.pricing.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Contact - Dark Tech Style */
function Contact({ t }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !message) { setStatus('error'); return }
    setStatus('success')
    setEmail('')
    setMessage('')
    setTimeout(() => setStatus(null), 3000)
  }
  
  return (
    <section id="contact" className="py-28 bg-slate-950 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">{t.contact.tag}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t.contact.title}</h2>
            <p className="text-xl text-white/50">{t.contact.subtitle}</p>
          </div>
          
          <div className="card-glass p-8">
            {status && (
              <div className={cn(
                "p-4 rounded-xl mb-6 text-center text-sm font-medium border",
                status === 'success' 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              )}>
                {status === 'success' ? t.contact.success : t.contact.error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-white/70 font-semibold text-sm">{t.contact.email}</Label>
                <Input 
                  type="email" 
                  placeholder="you@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="h-12 mt-2 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-violet-500" 
                />
              </div>
              <div>
                <Label className="text-white/70 font-semibold text-sm">{t.contact.message}</Label>
                <Textarea 
                  placeholder="Tell us about your business..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="min-h-[120px] mt-2 bg-white/5 border-white/10 rounded-xl resize-none text-white placeholder:text-white/30 focus:border-violet-500" 
                />
              </div>
              <button type="submit" className="btn-glossy w-full h-12 text-white font-semibold">{t.contact.send}</button>
            </form>
            
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">{t.contact.or}</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            
            <button className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-[#25D366] text-white font-semibold shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all hover:-translate-y-0.5">
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Footer */
function Footer({ t }) {
  return (
    <footer className="bg-slate-950 border-t border-white/5 text-white/40 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Zyllo</span>
          </div>
          
          <p className="text-sm">{t.footer.copy}</p>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {t.footer.status}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* App */
function App() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('respondeja-lang')
      if (saved === 'en' || saved === 'pt') return saved
      if (navigator.language?.toLowerCase().startsWith('pt')) return 'pt'
    } catch {}
    return 'en'
  })
  
  useEffect(() => {
    localStorage.setItem('respondeja-lang', lang)
    document.documentElement.lang = lang
  }, [lang])
  
  const t = translations[lang]
  
  return (
    <>
      <Header lang={lang} setLang={setLang} t={t} />
      <main className="bg-slate-950">
        <Hero t={t} />
        <Features t={t} />
        <FeatureGrid t={t} />
        <Integrations t={t} />
        <Pricing t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  )
}

export default App
