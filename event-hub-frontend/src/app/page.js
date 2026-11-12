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
  Radio,
  CheckCircle2,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Flame,
  Shield,
  Award,
  Terminal,
  Code2,
  ArrowUpRight,
  Compass
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Dynamic future deadline generator — ensures showcase events are always strictly upcoming
const getFutureDate = (daysFromNow) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const getUpcomingTechEvents = () => [
  {
    id: 't1',
    title: 'ETHIndia 2026',
    organizer: 'Devfolio & Ethereum Foundation',
    source_platform: 'Devfolio',
    category: 'Hackathons',
    deadline: getFutureDate(18),
    prize: '₹35,00,000 Pool',
    tags: ['Web3', 'Solidity', 'Smart Contracts', 'Bangalore'],
    ai_summary: 'Asia\'s flagship 36-hour Ethereum hackathon. Build dApps, protocol infrastructure, and DeFi protocols with mentorship from core Ethereum builders.',
    match_score: '98%',
    application_link: 'https://devfolio.co'
  },
  {
    id: 't2',
    title: 'Google Summer of Code (GSoC) 2026',
    organizer: 'Google Open Source',
    source_platform: 'Google',
    category: 'Internships',
    deadline: getFutureDate(25),
    prize: '$3,000 - $6,600 Stipend',
    tags: ['Open Source', 'Python', 'C++', 'Go', 'Remote'],
    ai_summary: 'Global 12-week open source software development mentorship. Write production code for Linux, Apache, Python Software Foundation, and CNCF.',
    match_score: '96%',
    application_link: 'https://summerofcode.withgoogle.com'
  },
  {
    id: 't3',
    title: 'Uber HackTag 2026 (SDE Campus Challenge)',
    organizer: 'Uber Engineering',
    source_platform: 'Unstop',
    category: 'Contests',
    deadline: getFutureDate(12),
    prize: 'PPI + ₹5,00,000',
    tags: ['DSA', 'Algorithms', 'System Design', 'SDE-1'],
    ai_summary: 'Uber India flagship coding challenge for engineering undergraduates. Top rankers receive direct SDE-1 and summer intern interview fast-tracks.',
    match_score: '94%',
    application_link: 'https://unstop.com'
  },
  {
    id: 't4',
    title: 'Smart India Hackathon (SIH 2026)',
    organizer: 'Ministry of Education & AICTE',
    source_platform: 'Govt Portal',
    category: 'Hackathons',
    deadline: getFutureDate(40),
    prize: '₹1,00,000 per Problem',
    tags: ['Full Stack', 'AI/ML', 'IoT', 'National'],
    ai_summary: 'India\'s largest nationwide product hackathon solving critical software and hardware challenges curated by central ministries and tech leaders.',
    match_score: '91%',
    application_link: 'https://sih.gov.in'
  },
  {
    id: 't5',
    title: 'Flipkart GRiD 7.0 - SDE Track',
    organizer: 'Flipkart India',
    source_platform: 'Unstop',
    category: 'Contests',
    deadline: getFutureDate(9),
    prize: '₹32 LPA PPI + ₹3,00,000',
    tags: ['DSA', 'Competitive Programming', 'SDE'],
    ai_summary: 'Algorithmic coding competition testing advanced data structures, graph theory, and scale design for pre-final and final year CS students.',
    match_score: '95%',
    application_link: 'https://unstop.com'
  },
  {
    id: 't6',
    title: 'LFX Mentorship (Linux Foundation) - Spring 2026',
    organizer: 'Linux Foundation',
    source_platform: 'Linux Foundation',
    category: 'Internships',
    deadline: getFutureDate(21),
    prize: '$3,000 - $6,000 Stipend',
    tags: ['Rust', 'Kubernetes', 'Linux Kernel', 'Remote'],
    ai_summary: 'Direct remote mentorship on cloud-native and core Linux infrastructure projects with CNCF, Hyperledger, and OpenSSF maintainers.',
    match_score: '93%',
    application_link: 'https://lfx.linuxfoundation.org'
  },
  {
    id: 't7',
    title: 'Atlassian Off-Campus SDE Summer Intern 2026',
    organizer: 'Atlassian',
    source_platform: 'LinkedIn',
    category: 'Internships',
    deadline: getFutureDate(15),
    prize: '₹1,00,000/mo Stipend',
    tags: ['Java', 'Distributed Systems', 'Backend', '2027 Grad'],
    ai_summary: 'Summer 2026 engineering internship to build high-scale distributed microservices powering Jira and Confluence Cloud systems.',
    match_score: '97%',
    application_link: 'https://linkedin.com'
  },
  {
    id: 't8',
    title: 'Codeforces Global Round 31',
    organizer: 'Codeforces',
    source_platform: 'Codeforces',
    category: 'Contests',
    deadline: getFutureDate(6),
    prize: 'Rating + T-Shirts',
    tags: ['C++', 'Competitive Programming', 'Algorithms'],
    ai_summary: 'Rated 2.5-hour algorithmic contest open to Div 1 + Div 2 participants featuring 8 challenging problems curated by international grandmasters.',
    match_score: '88%',
    application_link: 'https://codeforces.com'
  }
];

const FALLBACK_SHOWCASE_EVENTS = getUpcomingTechEvents();

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
  const [pendingIngest, setPendingIngest] = useState(false);

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

  // Landing Page Interactive States
  const [landingFilter, setLandingFilter] = useState('All');
  const [landingSearchQuery, setLandingSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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

  // Access Gate for Ingesting Opportunities
  const handleOpenIngest = () => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthError('Please sign in or create an account to ingest an opportunity.');
      setPendingIngest(true);
      setShowAuthModal(true);
    } else {
      setShowAddModal(true);
    }
  };

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
        if (pendingIngest) {
          setPendingIngest(false);
          setShowAddModal(true);
        } else {
          setShowLanding(false);
        }
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

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'Rolling';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
    } catch {
      return String(dateStr);
    }
  };

  const isUpcoming = (deadlineStr) => {
    if (!deadlineStr) return true; // Ongoing / rolling
    try {
      const d = new Date(deadlineStr);
      if (isNaN(d.getTime())) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    } catch {
      return true;
    }
  };

  const getDaysBadge = (deadlineStr) => {
    if (!deadlineStr) return 'Open & Ongoing';
    try {
      const d = new Date(deadlineStr);
      if (isNaN(d.getTime())) return 'Active';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'Closes Today';
      if (diffDays === 1) return 'Closes Tomorrow';
      return `${diffDays} days left`;
    } catch {
      return 'Active';
    }
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

  const filteredExploreEvents = events
    .filter(e => isUpcoming(e.deadline))
    .filter(e => {
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
  // VIEW 1: HOME PAGE (CLEAN DEVELOPER TECH DIRECTORY)
  // =========================================================================
  if (showLanding) {
    const rawList = events && events.length > 0 ? events : FALLBACK_SHOWCASE_EVENTS;
    const showcaseList = rawList.filter((item) => isUpcoming(item.deadline));
    const filteredLandingEvents = showcaseList.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const summary = (item.ai_summary || '').toLowerCase();
      const platform = (item.source_platform || '').toLowerCase();
      const organizer = (item.organizer || '').toLowerCase();
      const tagsStr = (item.tags || []).join(' ').toLowerCase();
      const combined = `${title} ${summary} ${platform} ${organizer} ${tagsStr}`;
      
      const matchesSearch = !landingSearchQuery || combined.includes(landingSearchQuery.toLowerCase());
      
      let matchesCat = true;
      if (landingFilter === 'Hackathons') {
        matchesCat = (item.category === 'Hackathons') || combined.includes('hackathon');
      } else if (landingFilter === 'Internships') {
        matchesCat = (item.category === 'Internships') || combined.includes('intern') || combined.includes('mentorship');
      } else if (landingFilter === 'Contests') {
        matchesCat = (item.category === 'Contests') || combined.includes('contest') || combined.includes('challenge') || combined.includes('round');
      }
      return matchesSearch && matchesCat;
    });

    const techFilterChips = ['All', 'DSA', 'Python', 'Web3', 'C++', 'Java', 'Rust', 'AI/ML', 'Remote'];

    return (
      <div className="min-h-screen bg-[#FDFDFD] text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
        
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            
            {/* Logo - Matches Dashboard Brand Identically */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setLandingFilter('All'); setLandingSearchQuery(''); }}>
              <div className="bg-[#4F46E5] text-white p-1.5 rounded-lg flex items-center justify-center shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#1E1B4B] block leading-tight">EventHub</span>
                <span className="text-[9px] text-indigo-600 font-bold tracking-wide uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md hidden sm:inline">
                  Live Aggregator
                </span>
              </div>
            </div>

            {/* Quick Category Nav */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500">
              <button 
                type="button" 
                onClick={() => { setLandingFilter('All'); setLandingSearchQuery(''); }}
                className={`hover:text-[#4F46E5] transition-colors cursor-pointer ${landingFilter === 'All' ? 'text-[#4F46E5] font-bold' : ''}`}
              >
                All Opportunities
              </button>
              <button 
                type="button" 
                onClick={() => setLandingFilter('Hackathons')}
                className={`hover:text-[#4F46E5] transition-colors cursor-pointer ${landingFilter === 'Hackathons' ? 'text-[#4F46E5] font-bold' : ''}`}
              >
                Hackathons
              </button>
              <button 
                type="button" 
                onClick={() => setLandingFilter('Internships')}
                className={`hover:text-[#4F46E5] transition-colors cursor-pointer ${landingFilter === 'Internships' ? 'text-[#4F46E5] font-bold' : ''}`}
              >
                SDE Internships
              </button>
              <button 
                type="button" 
                onClick={() => setLandingFilter('Contests')}
                className={`hover:text-[#4F46E5] transition-colors cursor-pointer ${landingFilter === 'Contests' ? 'text-[#4F46E5] font-bold' : ''}`}
              >
                Coding Contests
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button 
                type="button"
                onClick={handleOpenIngest}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#4F46E5] bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-600" /> Ingest Notice
              </button>

              {currentUser ? (
                <button 
                  type="button"
                  onClick={() => setShowLanding(false)}
                  className="text-xs font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <>
                  <button 
                    type="button"
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                    className="text-xs font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>

          </div>
        </header>

        {/* HERO HEADER */}
        <section className="pt-12 pb-8 px-4 sm:px-6 max-w-6xl mx-auto w-full text-left">
          
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-3 py-1 rounded-full mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Aggregator • {filteredLandingEvents.length} Active Opportunities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
            Tech Hackathons, SDE Internships & Coding Contests.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 leading-relaxed font-normal">
            Aggregated in real-time across top student platforms like Devpost, Unstop, Devfolio, and career portals. Filtered strictly for engineering students so you never miss an application deadline.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 pt-6 border-t border-slate-200/90 text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Software & Tech Focus
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Direct Official Application URLs
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 1-Click Google Calendar Sync
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Zero Marketing or Spam Contests
            </span>
          </div>

        </section>

        {/* SEARCH & FILTERS BAR */}
        <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/80 py-3.5 px-4 sm:px-6 shadow-2xs">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {[
                { label: 'All Tech', value: 'All' },
                { label: 'Hackathons', value: 'Hackathons' },
                { label: 'SDE Internships', value: 'Internships' },
                { label: 'Coding Contests', value: 'Contests' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setLandingFilter(tab.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    landingFilter === tab.value 
                      ? 'bg-[#4F46E5] text-white shadow-xs' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search tech (e.g. Python, DSA, Web3)..."
                value={landingSearchQuery}
                onChange={(e) => setLandingSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              {landingSearchQuery && (
                <button 
                  type="button"
                  onClick={() => setLandingSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          {/* Quick Tech Tag Chips */}
          <div className="max-w-6xl mx-auto mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-mono mr-1">Filter by skill:</span>
            {techFilterChips.map((chip) => {
              const isActive = (chip === 'All' && !landingSearchQuery) || 
                               (chip !== 'All' && landingSearchQuery.toLowerCase() === chip.toLowerCase());
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    if (chip === 'All') setLandingSearchQuery('');
                    else setLandingSearchQuery(chip);
                  }}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-mono transition cursor-pointer border ${
                    isActive 
                      ? 'bg-indigo-50 text-[#4F46E5] border-indigo-200 font-bold shadow-2xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </section>

        {/* OPPORTUNITY FEED CARDS */}
        <main className="py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
          
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{filteredLandingEvents.length}</strong> engineering opportunities
            </span>
            {(landingSearchQuery || landingFilter !== 'All') && (
              <button 
                type="button"
                onClick={() => { setLandingFilter('All'); setLandingSearchQuery(''); }}
                className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredLandingEvents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
              <p className="text-sm text-slate-800 font-bold mb-1">No opportunities found matching your filter.</p>
              <p className="text-xs text-slate-500 mb-4">Try clearing the search query or selecting "All Tech".</p>
              <button 
                type="button"
                onClick={() => { setLandingFilter('All'); setLandingSearchQuery(''); }}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
              >
                View All Opportunities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLandingEvents.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-xs"
                >
                  <div>
                    {/* Top Row: Platform Pill + Category + Prize */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {item.source_platform}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          • {item.category}
                        </span>
                      </div>

                      {item.prize && (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {item.prize}
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-snug mb-1">
                      {item.title}
                    </h3>

                    {/* Organizer / Host */}
                    {item.organizer && (
                      <p className="text-xs text-slate-500 mb-3">
                        Host: <span className="text-slate-700 font-medium">{item.organizer}</span>
                      </p>
                    )}

                    {/* Tech Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {item.tags.map((tag) => (
                          <span 
                            key={tag}
                            onClick={() => setLandingSearchQuery(tag)}
                            className="text-xs font-mono bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-[#4F46E5] px-2 py-0.5 rounded-md cursor-pointer transition border border-slate-200/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description Summary */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                      {item.ai_summary}
                    </p>
                  </div>

                  {/* Bottom Row: Deadline & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2" suppressHydrationWarning>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {getDaysBadge(item.deadline)}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline font-medium">
                        • {formatDeadline(item.deadline)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setSelectedEvent(item)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
                      >
                        Details
                      </button>

                      <a 
                        href={createGoogleCalUrl(item.title, item.deadline)}
                        target="_blank" 
                        rel="noreferrer"
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition flex items-center gap-1 cursor-pointer"
                        title="Add to Google Calendar"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" /> Cal
                      </a>

                      <a 
                        href={item.application_link || '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Bottom Community Notice Banner */}
          <div className="mt-10 p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#1E1B4B]">Know a hackathon or internship drive not listed here?</h4>
              <p className="text-xs text-slate-600 mt-0.5">Paste raw WhatsApp circulars or notice posters. Our parser indexes it for everyone.</p>
            </div>
            <button 
              type="button"
              onClick={handleOpenIngest}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" /> Ingest Opportunity
            </button>
          </div>

        </main>

        {/* WHY WE BUILT THIS (SIMPLE DEVELOPER NOTES, NO MARKETING SLOP) */}
        <section className="border-t border-slate-200/80 py-12 px-4 sm:px-6 bg-slate-50/70">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-base font-bold text-slate-900 mb-6">Why EventHub?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-mono text-xs font-bold">
                  01
                </div>
                <h3 className="text-sm font-bold text-slate-900">100% Software Engineering Only</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Every listed challenge involves writing code, building systems, or solving algorithmic problems. No non-tech quiz forms or random essay competitions.
                </p>
              </div>

              <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-mono text-xs font-bold">
                  02
                </div>
                <h3 className="text-sm font-bold text-slate-900">1-Click Google Calendar Sync</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Click 'Cal' to create a pre-filled event in your Google Calendar with links and reminders, so you never rush an application at 11:58 PM.
                </p>
              </div>

              <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-mono text-xs font-bold">
                  03
                </div>
                <h3 className="text-sm font-bold text-slate-900">Campus & Discord Notice Parser</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Got an unstructured circular from your college club or a Discord announcement? Paste it into our parser to extract clean deadlines and register links.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* DEVELOPER FOOTER */}
        <footer className="border-t border-slate-200 py-6 px-4 sm:px-6 text-xs text-slate-500 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">EventHub</span>
              <span>• Live aggregator for student developers and competitive programmers.</span>
            </div>

            <div className="flex items-center gap-4 text-slate-600 font-medium">
              <button 
                type="button" 
                onClick={() => { setLandingFilter('All'); setLandingSearchQuery(''); }}
                className="hover:text-[#4F46E5] cursor-pointer transition-colors"
              >
                All Tech Events
              </button>
              <button 
                type="button" 
                onClick={handleOpenIngest}
                className="hover:text-[#4F46E5] cursor-pointer transition-colors"
              >
                Ingest Notice
              </button>
              <button 
                type="button" 
                onClick={() => setShowLanding(false)}
                className="hover:text-[#4F46E5] cursor-pointer transition-colors font-bold"
              >
                Dashboard →
              </button>
            </div>
          </div>
        </footer>

        {/* AUTH MODAL */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 text-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-[#4F46E5] text-white p-1 rounded-md">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {authMode === 'login' ? 'Login to EventHub' : 'Create Free Account'}
                  </h2>
                </div>
                <button type="button" onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">✕</button>
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="dev@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs transition shadow-xs mt-2 cursor-pointer"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Free Account'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
                  className="text-[#4F46E5] font-bold hover:underline cursor-pointer"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INGEST OPPORTUNITY MODAL (Protected: Requires Authenticated User) */}
        {showAddModal && currentUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-slate-800">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Ingest Notice / Hackathon</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Extract event details via AI from WhatsApp messages, Discord or circulars</p>
                </div>
                <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">✕</button>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button 
                  type="button"
                  onClick={() => setAddMode('ai')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${addMode === 'ai' ? 'bg-white text-[#4F46E5] font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ✨ AI Text Ingestion
                </button>
                <button 
                  type="button"
                  onClick={() => setAddMode('manual')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${addMode === 'manual' ? 'bg-white text-[#4F46E5] font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  📝 Manual Form
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                {addMode === 'ai' ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Paste Raw Notice / Discord / WhatsApp Content</label>
                    <textarea 
                      rows={4}
                      required
                      placeholder="Paste college club announcement or WhatsApp text here. AI will automatically extract deadline, title, and summary..."
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none transition"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Opportunity Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. ACM Summer CodeSprint 2026"
                        value={manualData.title}
                        onChange={(e) => setManualData({...manualData, title: e.target.value})}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Source / Platform</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Unstop, Campus Club"
                          value={manualData.source_platform}
                          onChange={(e) => setManualData({...manualData, source_platform: e.target.value})}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Deadline Date</label>
                        <input 
                          type="date" 
                          required
                          value={manualData.deadline}
                          onChange={(e) => setManualData({...manualData, deadline: e.target.value})}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Brief Summary</label>
                      <input 
                        type="text" 
                        placeholder="Short overview of the hackathon or role"
                        value={manualData.ai_summary}
                        onChange={(e) => setManualData({...manualData, ai_summary: e.target.value})}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Official Registration Link (URL)</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={manualData.application_link}
                    onChange={(e) => setManualData({...manualData, application_link: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Parsing & Indexing...' : 'Index Opportunity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-slate-800">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => setSelectedEvent(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedEvent.source_platform}
                    </span>
                    {selectedEvent.prize && (
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {selectedEvent.prize}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">{selectedEvent.title}</h2>
                  {selectedEvent.organizer && (
                    <p className="text-xs text-slate-500 mt-1">Host: <span className="font-semibold text-slate-700">{selectedEvent.organizer}</span></p>
                  )}
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2" suppressHydrationWarning>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {getDaysBadge(selectedEvent.deadline)}
                    </span>
                    <span>Deadline: <strong className="text-slate-800">{formatDeadline(selectedEvent.deadline)}</strong></span>
                  </p>
                </div>

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedEvent.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/70 space-y-1">
                  <span className="text-xs font-bold text-indigo-700 uppercase">AI Parsed Summary</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedEvent.ai_summary}</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a 
                    href={selectedEvent.application_link || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    Apply on {selectedEvent.source_platform} <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a 
                    href={createGoogleCalUrl(selectedEvent.title, selectedEvent.deadline)}
                    target="_blank" 
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" /> Add to Cal
                  </a>
                </div>
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
            onClick={handleOpenIngest}
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
                          <p className="text-[11px] text-rose-500 font-semibold mt-1" suppressHydrationWarning>
                            🗓️ {formatDeadline(event.deadline)}
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
                          <span className="text-[11px] text-slate-400 font-medium" suppressHydrationWarning>
                            🗓️ Deadline: {formatDeadline(event.deadline)}
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
                            <span suppressHydrationWarning>🗓️ {formatDeadline(evt.deadline)}</span>
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
                          <span className="text-slate-600 font-medium" suppressHydrationWarning>
                            {formatDeadline(item.deadline)}
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