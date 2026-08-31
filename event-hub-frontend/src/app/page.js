'use client';
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Bookmark, 
  Settings, 
  Search, 
  TrendingUp, 
  Briefcase, 
  ChevronRight, 
  ExternalLink, 
  CalendarCheck, 
  Bot, 
  CalendarPlus, 
  ArrowLeft, 
  ListChecks, 
  Filter, 
  Sparkles, 
  LogOut, 
  PlusCircle, 
  Save, 
  Bell, 
  Sliders, 
  AlertCircle,
  XCircle,
  ArrowRight,
  Globe,
  Layers,
  Zap,
  Target,
  RefreshCw,
  Radio
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EventHubMasterApp() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  // Submit / Ingest Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState('ai');
  const [rawText, setRawText] = useState('');
  const [manualData, setManualData] = useState({
    title: '',
    source_platform: 'Community',
    deadline: '',
    application_link: '',
    ai_summary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settings States
  const [selectedSkills, setSelectedSkills] = useState(['C++', 'Hackathons', 'Aptitude']);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminderDays, setDeadlineReminderDays] = useState('2');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Data States
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [stats, setStats] = useState({ upcoming: 0, trending: 0, internships: 0, contests: 0 });
  
  // UI States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreTab, setExploreTab] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');

  // Load Saved Auth Session
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('eventhub_user');
      const token = localStorage.getItem('eventhub_token');
      if (token && savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setAuthToken(token);
        if (parsed.preferences && parsed.preferences.length > 0) {
          setSelectedSkills(parsed.preferences);
        }
      }
      setShowLanding(true);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const refreshAllData = async () => {
    try {
      const eventsRes = await fetch(`${API_BASE}/api/events`).catch(() => null);
      if (!eventsRes || !eventsRes.ok) {
        setIsBackendOffline(true);
        return;
      }
      setIsBackendOffline(false);
      const eventsJson = await eventsRes.json();
      setEvents(eventsJson.data || []);

      const statsRes = await fetch(`${API_BASE}/api/stats`).catch(() => null);
      if (statsRes && statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.data) setStats(statsJson.data);
      }

      if (currentUser) {
        const recsRes = await fetch(`${API_BASE}/api/recommendations/${currentUser.id}`).catch(() => null);
        if (recsRes && recsRes.ok) {
          const recsJson = await recsRes.json();
          setRecommendedEvents(recsJson.data || []);
        }
      } else {
        setRecommendedEvents([]);
      }

      const token = authToken || localStorage.getItem('eventhub_token');
      if (token && currentUser) {
        const savedRes = await fetch(`${API_BASE}/api/saved-events`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null);
        if (savedRes && savedRes.ok) {
          const savedJson = await savedRes.json();
          setSavedEvents(savedJson.data || []);
        }
      } else {
        setSavedEvents([]);
      }
    } catch (err) {
      setIsBackendOffline(true);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [currentUser, authToken]);

  // Auth Submit (Strict Separation)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = authMode === 'signup' ? '/api/signup' : '/api/login';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setSavedEvents([]);
        setRecommendedEvents([]);
        
        localStorage.setItem('eventhub_token', data.token);
        localStorage.setItem('eventhub_user', JSON.stringify(data.user));
        
        setCurrentUser(data.user);
        setAuthToken(data.token);
        setSelectedSkills(data.user.preferences || ['C++', 'Hackathons', 'Aptitude']);

        const savedRes = await fetch(`${API_BASE}/api/saved-events`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        }).catch(() => null);
        if (savedRes && savedRes.ok) {
          const savedJson = await savedRes.json();
          setSavedEvents(savedJson.data || []);
        }

        const recsRes = await fetch(`${API_BASE}/api/recommendations/${data.user.id}`).catch(() => null);
        if (recsRes && recsRes.ok) {
          const recsJson = await recsRes.json();
          setRecommendedEvents(recsJson.data || []);
        }
        
        setShowAuthModal(false);
        setShowLanding(false);
        setAuthEmail('');
        setAuthPassword('');
      } else {
        setAuthError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Backend offline. Please start backend on port 5000.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('eventhub_token');
    localStorage.removeItem('eventhub_user');
    setCurrentUser(null);
    setAuthToken(null);
    setSavedEvents([]);
    setRecommendedEvents([]);
    setSelectedSkills(['C++', 'Hackathons', 'Aptitude']);
    setShowLanding(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let res;
      if (addMode === 'ai') {
        res = await fetch(`${API_BASE}/api/events/ai-add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raw_text: rawText,
            source_platform: 'Community / Notice',
            application_link: manualData.application_link || 'https://eventhub.internal'
          })
        });
      } else {
        res = await fetch(`${API_BASE}/api/events/manual-add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(manualData)
        });
      }

      const data = await res.json();
      if (data.status === 'success') {
        setShowAddModal(false);
        setRawText('');
        setManualData({ title: '', source_platform: 'Community', deadline: '', application_link: '', ai_summary: '' });
        refreshAllData();
      } else {
        alert(data.message || 'Failed to ingest opportunity');
      }
    } catch (err) {
      alert('Backend server unreachable');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSaveSettings = async () => {
    if (!currentUser || !authToken) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/preferences`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ preferences: selectedSkills })
      });

      const data = await res.json();
      if (data.status === 'success') {
        const updatedUser = { ...currentUser, preferences: selectedSkills };
        localStorage.setItem('eventhub_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
        refreshAllData();
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const toggleBookmark = async (eventObj) => {
    if (!currentUser || !authToken) return;

    const isAlreadySaved = savedEvents.some(e => e.id === eventObj.id);
    
    if (isAlreadySaved) {
      setSavedEvents(savedEvents.filter(e => e.id !== eventObj.id));
    } else {
      const newSavedItem = { ...eventObj, status: 'Applying' };
      setSavedEvents([...savedEvents, newSavedItem]);
      
      try {
        await fetch(`${API_BASE}/api/saved-events`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            event_id: eventObj.id,
            status: 'Applying'
          })
        });
      } catch (err) {
        console.error("Failed to save event:", err);
      }
    }
  };

  const handleStatusUpdate = async (eventId, newStatus) => {
    if (!currentUser || !authToken) return;
    setSavedEvents(savedEvents.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    
    try {
      await fetch(`${API_BASE}/api/saved-events/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          event_id: eventId,
          status: newStatus
        })
      });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const createGoogleCalUrl = (title, deadline) => {
    const eventTitle = encodeURIComponent(title || 'Opportunity');
    const dateStr = deadline ? new Date(deadline).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${dateStr}/${dateStr}`;
  };

  const getCurrentWeekDays = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMon = (currentDay + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMon);

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      return {
        name: dayName,
        dateNum: d.getDate(),
        fullDateStr: d.toISOString().split('T')[0]
      };
    });
  };

  // Source Badge Color Helper
  const getSourceBadge = (source) => {
    const s = (source || '').toLowerCase();
    if (s.includes('unstop')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (s.includes('devfolio')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('devpost')) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (s.includes('linkedin')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  const filteredExploreEvents = events.filter(e => {
    const titleText = (e.title || '').toLowerCase();
    const summaryText = (e.ai_summary || '').toLowerCase();
    const fullText = `${titleText} ${summaryText}`;

    const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || 
                          summaryText.includes(searchQuery.toLowerCase());
    
    const matchesSource = selectedSource === 'All' || (e.source_platform || '').toLowerCase() === selectedSource.toLowerCase();
    
    let matchesCategory = true;
    if (exploreTab === 'Hackathons') {
      matchesCategory = fullText.includes('hackathon') || fullText.includes('devpost') || fullText.includes('devfolio');
    } else if (exploreTab === 'Internships') {
      matchesCategory = fullText.includes('intern') || fullText.includes('hiring') || fullText.includes('job');
    } else if (exploreTab === 'Contests') {
      matchesCategory = fullText.includes('contest') || fullText.includes('challenge') || fullText.includes('championship') || fullText.includes('aptitude');
    } else if (exploreTab === 'Workshops') {
      matchesCategory = fullText.includes('workshop') || fullText.includes('bootcamp') || fullText.includes('webinar');
    }

    return matchesSearch && matchesSource && matchesCategory;
  });

  // =========================================================================
  // VIEW 1: HOME PAGE (AGGREGATOR HERO)
  // =========================================================================
  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#0A071B] text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
        
        <div className="absolute -top-40 left-1/3 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-tight">EventHub</span>
              <span className="text-[10px] text-indigo-300 font-semibold tracking-wide uppercase">AI Opportunity Aggregator</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button 
                type="button"
                onClick={() => setShowLanding(false)}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button 
                  type="button"
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  type="button"
                  onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                  className="text-xs font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </header>

        {/* Live Aggregation Ticker */}
        <div className="max-w-5xl mx-auto w-full px-4 z-20 mb-2">
          <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl px-4 py-2 flex items-center justify-between text-xs backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-indigo-200 font-semibold">Live Ingestion Engine Active:</span>
              <span className="text-slate-300">Aggregating Unstop, Devfolio, Devpost, LinkedIn & Campus Notices</span>
            </div>
            <span className="text-[11px] text-indigo-300 hidden md:inline">Automated 24/7 Sync</span>
          </div>
        </div>

        {/* Main Card */}
        <main className="max-w-5xl mx-auto w-full px-4 py-4 z-20 my-auto">
          <div className="bg-white text-slate-900 rounded-[2.2rem] p-7 md:p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#4338CA]">
                  Problem: Finding Events Is Really Hard
                </h1>
                <p className="text-slate-600 font-medium text-xs md:text-sm mt-1.5">
                  Students miss hackathons, internships, competitions, and workshops because event information is <strong className="text-indigo-600">scattered everywhere</strong>.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-200"></span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
              
              {/* Left Platforms */}
              <div className="lg:col-span-7 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[320px]">
                
                <div className="w-full grid grid-cols-3 gap-2.5">
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-sky-600">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span> unstop
                  </div>

                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> devfolio
                  </div>

                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-700">
                    <Globe className="w-3.5 h-3.5" /> College Site
                  </div>
                </div>

                <div className="my-3 relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-3xl">
                    👨‍💻
                  </div>
                  <span className="absolute -top-1 -right-1 text-xs font-black text-indigo-600 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow">?</span>
                </div>

                <div className="w-full grid grid-cols-3 gap-2.5">
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700">
                    <span className="text-xs font-black">in</span> LinkedIn
                  </div>

                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-purple-600">
                    <Layers className="w-3.5 h-3.5" /> Discord
                  </div>

                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600">
                    <span className="text-xs font-black">💬</span> WhatsApp
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-bold">
                    📅 Missed Deadline
                  </span>
                  <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[10px] font-bold">
                    ✕ Registration Closed
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-bold">
                    ⚠️ Forgot to Apply
                  </span>
                </div>
              </div>

              {/* Right Side */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                    ?
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Why Does This Happen?</h3>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Information is scattered</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Too many platforms</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Missed deadlines</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>No personalized recommendations</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                  className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition cursor-pointer"
                >
                  Explore Centralized Hub →
                </button>
              </div>

            </div>

            {/* Bottom Quote Banner */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-indigo-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div className="text-xs md:text-sm font-black text-slate-800">
                  Opportunities are everywhere. <span className="text-[#EA580C]">Visibility isn't.</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => {
                  if (currentUser) {
                    setShowLanding(false);
                  } else {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-indigo-600 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                Sign In to Start <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Aggregator Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Automated Web Scraper</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Aggregates Unstop, Devpost & Devfolio.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Smart Match Scoring</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Personalized recommendations for your skills.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">1-Click Google Cal Sync</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Never miss application deadlines again.</p>
              </div>
            </div>
          </div>

        </main>

        <footer className="max-w-5xl mx-auto w-full text-center text-[11px] text-slate-500 py-4 z-20">
          © 2026 EventHub. Intelligent opportunity discovery & tracking platform. All rights reserved.
        </footer>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 text-slate-800">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">
                  {authMode === 'login' ? 'Login to EventHub' : 'Create Account'}
                </h2>
                <button type="button" onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer">✕</button>
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition mt-2 shadow-xs cursor-pointer"
                >
                  {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED-IN AGGREGATOR DASHBOARD
  // =========================================================================
  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-4 select-none shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="bg-[#4F46E5] text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#1E1B4B] block leading-tight">EventHub</span>
              <span className="text-[9px] text-indigo-500 font-bold tracking-wide uppercase">Live Aggregator</span>
            </div>
          </div>

          {/* Secondary Ingest Link */}
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" /> Ingest Opportunity
          </button>

          <nav className="space-y-1.5">
            <button 
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-[#F5F3FF] text-[#4F46E5]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              Feed Overview
            </button>

            <button 
              type="button"
              onClick={() => {
                setExploreTab('All');
                setSearchQuery('');
                setSelectedSource('All');
                setActiveTab('explore');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'explore' ? 'bg-[#F5F3FF] text-[#4F46E5]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              Explore Feeds
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'saved' ? 'bg-[#F5F3FF] text-[#4F46E5]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4" />
                Saved Tracker
              </div>
              {savedEvents.length > 0 && (
                <span className="bg-[#4F46E5] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {savedEvents.length}
                </span>
              )}
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#F5F3FF] text-[#4F46E5]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              Preferences
            </button>
          </nav>
        </div>

        {/* User Footer */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-bold text-slate-800 leading-tight truncate">{currentUser?.email ? currentUser.email.split('@')[0] : 'User'}</span>
                <span className="text-[10px] text-slate-400 truncate">{currentUser?.email}</span>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {isBackendOffline && (
          <div className="bg-rose-500 text-white px-10 py-2 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Backend server is offline. Please run npm start on port 5000.
            </span>
            <button onClick={refreshAllData} className="underline cursor-pointer">Retry</button>
          </div>
        )}

        {/* Header with Live Sync Indicator */}
        <header className="h-16 px-10 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xs z-10 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search aggregated hackathons, jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50/80 border border-slate-200/80 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 outline-none text-slate-600"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Scraper Connected
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={refreshAllData} 
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              title="Refresh Feeds"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span>{currentUser?.email?.split('@')[0]}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </header>

        <main className="px-10 py-8 space-y-7 max-w-5xl">
          
          {/* TAB 1: FEED OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  👋 Feed Overview for {currentUser?.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Aggregated opportunities synced in real-time across top student platforms.</p>
              </div>

              {/* Aggregated Counters */}
              <div className="grid grid-cols-4 gap-4">
                <button 
                  type="button"
                  onClick={() => { setExploreTab('All'); setSearchQuery(''); setSelectedSource('All'); setActiveTab('explore'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 text-left hover:border-indigo-200 hover:shadow-md transition active:scale-[0.98] cursor-pointer group"
                >
                  <div className="p-3 rounded-xl bg-[#F5F3FF] text-[#4F46E5] group-hover:scale-105 transition"><Calendar className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-slate-900">{stats.upcoming || events.length}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">All Aggregated</p>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => { setExploreTab('Hackathons'); setSearchQuery(''); setSelectedSource('All'); setActiveTab('explore'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 text-left hover:border-emerald-200 hover:shadow-md transition active:scale-[0.98] cursor-pointer group"
                >
                  <div className="p-3 rounded-xl bg-[#F0FDF4] text-[#16A34A] group-hover:scale-105 transition"><TrendingUp className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-slate-900">{stats.trending || 0}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Hackathons</p>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => { setExploreTab('Internships'); setSearchQuery(''); setSelectedSource('All'); setActiveTab('explore'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 text-left hover:border-sky-200 hover:shadow-md transition active:scale-[0.98] cursor-pointer group"
                >
                  <div className="p-3 rounded-xl bg-[#F0F9FF] text-[#0284C7] group-hover:scale-105 transition"><Briefcase className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-slate-900">{stats.internships || 0}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Internships</p>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => { setExploreTab('Contests'); setSearchQuery(''); setSelectedSource('All'); setActiveTab('explore'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 text-left hover:border-amber-200 hover:shadow-md transition active:scale-[0.98] cursor-pointer group"
                >
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition text-base flex items-center justify-center">🏆</div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-slate-900">{stats.contests || 0}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Contests</p>
                  </div>
                </button>
              </div>

              {/* Aggregator Recommended Feed */}
              <section className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-sm">⭐</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">SMART MATCH FOR YOUR PROFILE</h2>
                    <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI Match Engine
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {(recommendedEvents.length > 0 ? recommendedEvents.slice(0, 2) : events.slice(0, 2)).map((event) => (
                    <div key={event.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl bg-[#0F172A] flex flex-col items-center justify-center text-white shrink-0 p-2 text-center shadow-inner">
                        <span className="text-sm font-black tracking-tight text-blue-400">
                          {event.title ? event.title.slice(0, 3).toUpperCase() : 'AI'}
                        </span>
                        <div className="w-4 h-0.5 bg-blue-500/40 my-1"></div>
                        <span className="text-[7px] text-slate-400 font-mono">&lt;/&gt;</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{event.title}</h3>
                            <button type="button" onClick={() => toggleBookmark(event)} className="text-slate-300 hover:text-indigo-600 cursor-pointer">
                              <Bookmark className={`w-3.5 h-3.5 ${savedEvents.some(e => e.id === event.id) ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                            </button>
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getSourceBadge(event.source_platform)}`}>
                              {event.source_platform}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">• Scraped Live</span>
                          </div>
                          <p className="text-[11px] text-rose-500 font-semibold mt-1">
                            🗓️ {event.deadline ? new Date(event.deadline).toLocaleDateString() : 'Rolling'}
                          </p>
                        </div>

                        <div className="mt-3">
                          <button 
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className="px-3 py-1 bg-white border border-indigo-200 text-[#4F46E5] hover:bg-indigo-50 rounded-lg text-[11px] font-bold transition shadow-2xs cursor-pointer"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Deadlines Section with Direct Platform Links */}
              <section className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🚨</span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">EXPIRING OPPORTUNITIES</h2>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100/80">
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${getSourceBadge(event.source_platform)}`}>
                          {event.source_platform}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{event.title}</span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            🗓️ Deadline: {event.deadline ? new Date(event.deadline).toLocaleDateString() : 'Rolling'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <a 
                          href={event.application_link || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white border border-indigo-200 hover:bg-indigo-50 text-[#4F46E5] rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition"
                        >
                          Apply on {event.source_platform} <ExternalLink className="w-3 h-3" />
                        </a>
                        <a 
                          href={createGoogleCalUrl(event.title, event.deadline)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-[#16A34A] rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition"
                        >
                          <CalendarCheck className="w-3 h-3" /> Sync Cal
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* TAB 2: EXPLORE FEEDS */}
          {activeTab === 'explore' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6 h-fit shadow-xs">
                <div>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Source Channels
                  </h3>
                  <div className="space-y-2 text-xs font-medium text-slate-600">
                    {['All', 'Devfolio', 'LinkedIn', 'Unstop', 'Devpost', 'Community'].map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                        <input 
                          type="radio" 
                          name="source_radio" 
                          checked={selectedSource === s} 
                          onChange={() => setSelectedSource(s)}
                          className="text-indigo-600" 
                        /> 
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => { setSelectedSource('All'); setSearchQuery(''); setExploreTab('All'); }}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition border border-slate-200 cursor-pointer"
                >
                  Reset Channels
                </button>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {['All', 'Hackathons', 'Internships', 'Contests', 'Workshops'].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setExploreTab(pill)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                        exploreTab === pill 
                          ? 'bg-[#4F46E5] text-white shadow-xs' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredExploreEvents.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-2">
                      <p className="text-sm font-bold text-slate-700">No events found under "{exploreTab}".</p>
                      <button 
                        type="button"
                        onClick={() => { setExploreTab('All'); setSearchQuery(''); setSelectedSource('All'); }}
                        className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Reset filters to view all aggregated feeds
                      </button>
                    </div>
                  ) : (
                    filteredExploreEvents.map((evt) => (
                      <div key={evt.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex items-start gap-4 hover:border-indigo-100 transition">
                        <div className="w-24 h-24 rounded-2xl bg-[#0F172A] flex flex-col items-center justify-center text-white shrink-0 p-2 shadow-inner">
                          <span className="text-xs font-black text-emerald-400 leading-tight text-center">
                            {evt.title ? evt.title.slice(0, 5) : 'OPP'}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-1">AGGREGATED</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                            <button 
                              type="button"
                              onClick={() => toggleBookmark(evt)}
                              className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                            >
                              <Bookmark className={`w-3 h-3 ${savedEvents.some(e => e.id === evt.id) ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                              {savedEvents.some(e => e.id === evt.id) ? 'Tracked' : 'Track'}
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getSourceBadge(evt.source_platform)}`}>
                              🌐 {evt.source_platform}
                            </span>
                            <span>🗓️ {evt.deadline ? new Date(evt.deadline).toLocaleDateString() : 'Rolling'}</span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="text-indigo-600 font-semibold">✨ AI Summary:</span> {evt.ai_summary}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAVED TRACKER */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                <h1 className="text-lg font-black uppercase tracking-wide text-slate-900">
                  YOUR SAVED TRACKER
                </h1>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <ListChecks className="w-4 h-4 text-indigo-600" /> STATUS TRACKER (DATABASE SYNC)
                </div>

                <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100">
                  <span className="col-span-6">Opportunity</span>
                  <span className="col-span-3">Deadline</span>
                  <span className="col-span-3 text-right">Status</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {savedEvents.length === 0 ? (
                    <div className="py-8 text-center text-xs font-semibold text-slate-400">
                      No bookmarks saved yet. Go to Explore Feeds and click Track!
                    </div>
                  ) : (
                    savedEvents.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 items-center py-3.5 hover:bg-slate-50/50 transition">
                        <div className="col-span-6 flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSourceBadge(item.source_platform)}`}>
                            {item.source_platform}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                        </div>

                        <div className="col-span-3 flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600 font-medium">
                            {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'Upcoming'}
                          </span>
                        </div>

                        <div className="col-span-3 flex justify-end">
                          <select 
                            value={item.status || 'Applying'}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700 outline-none cursor-pointer"
                          >
                            <option value="Applying">🟠 Applying</option>
                            <option value="Submitted">🟢 Submitted</option>
                            <option value="Saved">🔵 Saved</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-indigo-600" /> APPLICATION TIMELINE (THIS WEEK)
                </div>

                <div className="grid grid-cols-7 text-center gap-2">
                  {getCurrentWeekDays().map((day) => {
                    const matchedSaved = savedEvents.find(e => e.deadline && e.deadline.startsWith(day.fullDateStr));

                    return (
                      <div key={day.name} className="flex flex-col items-center space-y-2">
                        <span className="text-[11px] font-bold text-slate-400">{day.name}</span>
                        <span className="text-xs font-bold text-slate-700">{day.dateNum}</span>
                        
                        <div className="h-10 flex flex-col items-center justify-start">
                          {matchedSaved && (
                            <div className="flex flex-col items-center animate-bounce">
                              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                              <span className="text-[9px] font-bold text-indigo-600 mt-1 truncate max-w-[50px]">
                                {matchedSaved.title.split(' ')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREFERENCES */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" /> Aggregator Calibration
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">Customize your skill filters and deadline notification preferences.</p>
                </div>
                {settingsSaved && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                    ✓ Saved successfully
                  </span>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Target Skills & Career Focus</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Select tags to prioritize relevant opportunities in your feed.</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'C++', 'Python', 'Machine Learning', 'Aptitude', 
                    'Hackathons', 'Web3 / Blockchain', 'Competitive Programming', 
                    'Design / UI', 'System Design', 'Open Source'
                  ].map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600" /> Deadline Alerts & Notifications
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Automated email reminders before registration portals close.</p>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-700">
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">Email Reminders</p>
                      <p className="text-[11px] text-slate-400">Receive automated deadline reminders via Email.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </label>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">Remind Before</p>
                      <p className="text-[11px] text-slate-400">Timeframe prior to deadline expiration.</p>
                    </div>
                    <select 
                      value={deadlineReminderDays}
                      onChange={(e) => setDeadlineReminderDays(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="1">24 Hours (1 Day)</option>
                      <option value="2">48 Hours (2 Days)</option>
                      <option value="3">3 Days</option>
                      <option value="7">1 Week</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleSaveSettings}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Ingest Opportunity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Ingest Unstructured Notice</h2>
                <p className="text-xs text-slate-500">Extract event details via AI from WhatsApp messages or posters</p>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer">✕</button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button 
                type="button"
                onClick={() => setAddMode('ai')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${addMode === 'ai' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'}`}
              >
                ✨ AI Text Ingestion
              </button>
              <button 
                type="button"
                onClick={() => setAddMode('manual')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${addMode === 'manual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'}`}
              >
                📝 Manual Channel Entry
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              {addMode === 'ai' ? (
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Paste Raw Notice / Poster Content</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Paste college club announcement or WhatsApp text here. AI will extract deadline, title, and summary..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Opportunity Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. ACM Summer CodeSprint 2026"
                      value={manualData.title}
                      onChange={(e) => setManualData({...manualData, title: e.target.value})}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Platform Source</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Unstop, Campus Portal"
                        value={manualData.source_platform}
                        onChange={(e) => setManualData({...manualData, source_platform: e.target.value})}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Deadline Date</label>
                      <input 
                        type="date" 
                        required
                        value={manualData.deadline}
                        onChange={(e) => setManualData({...manualData, deadline: e.target.value})}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">AI Overview Summary</label>
                    <input 
                      type="text" 
                      placeholder="Brief overview"
                      value={manualData.ai_summary}
                      onChange={(e) => setManualData({...manualData, ai_summary: e.target.value})}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Official Registration Link (URL)</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={manualData.application_link}
                  onChange={(e) => setManualData({...manualData, application_link: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Processing Ingestion...' : 'Ingest to Live Feed'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-slate-800">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <button 
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Aggregated Feeds
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="w-full h-36 rounded-2xl bg-[#0F172A] p-6 flex flex-col justify-between text-white shadow-inner">
                <span className="text-3xl font-black text-blue-400">{selectedEvent.title ? selectedEvent.title.slice(0, 4) : 'EVNT'}</span>
                <span className="text-xs text-slate-300">Channel Source: {selectedEvent.source_platform}</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-lg font-black text-slate-900">🏆 {selectedEvent.title}</h1>
                <p className="text-xs text-slate-500">Aggregated from: <span className="text-indigo-600 font-bold">{selectedEvent.source_platform}</span></p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/70 space-y-1">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase">
                  <Bot className="w-4 h-4" /> Parsed Summary
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedEvent.ai_summary}</p>
              </div>

              <div className="space-y-2 pt-2">
                <a 
                  href={selectedEvent.application_link || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
                >
                  Apply on {selectedEvent.source_platform || 'Portal'} <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a 
                  href={createGoogleCalUrl(selectedEvent.title, selectedEvent.deadline)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <CalendarPlus className="w-4 h-4 text-emerald-600" /> Add to Google Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}