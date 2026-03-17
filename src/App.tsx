/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  ICONS, 
  View, 
  UserRole, 
  MOCK_COURSES, 
  Course,
  CourseStatus,
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  Student,
  Teacher,
  TeacherApplication
} from './types';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  type = 'button'
}: { 
  children: React.ReactNode; 
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  key?: React.Key;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const baseStyles = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-indigo-600",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100 hover:-translate-y-0.5"
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; key?: React.Key; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden card-hover ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, color = 'indigo', className = "" }: { children: React.ReactNode; color?: string; key?: React.Key; className?: string }) => {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.indigo} ${className}`}>
      {children}
    </span>
  );
};

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-indigo-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-8 right-8 ${colors[type]} text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold`}
    >
      {type === 'success' && <ICONS.CheckCircle className="w-5 h-5" />}
      {type === 'error' && <ICONS.X className="w-5 h-5" />}
      {type === 'info' && <ICONS.Bell className="w-5 h-5" />}
      {message}
    </motion.div>
  );
};

const CategoryFilterBar = ({ 
  selectedCategory, 
  onSelect 
}: { 
  selectedCategory: string; 
  onSelect: (cat: string) => void 
}) => {
  const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Finance', 'Health'];
  
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
            selectedCategory === cat
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-105'
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

// --- Layout Components ---

const Logo = ({ className = "", onClick }: { className?: string; onClick?: () => void }) => (
  <div 
    className={`flex items-center gap-3 cursor-pointer group ${className}`} 
    onClick={onClick}
  >
    <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:rotate-6 transition-transform duration-500">
      <ICONS.GraduationCap className="w-7 h-7" />
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">EduStream</span>
      <span className="text-[11px] font-extrabold text-indigo-600 tracking-[0.2em] uppercase leading-none mt-1.5">Pro Academy</span>
    </div>
  </div>
);

interface Notification {
  id: string;
  text: string;
  time: string;
  icon: keyof typeof ICONS;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', text: 'New lecture uploaded in Web Development', time: '2 hours ago', icon: 'FileText', read: false },
  { id: '2', text: 'Quiz available for Python Course', time: '5 hours ago', icon: 'HelpCircle', read: false },
  { id: '3', text: 'Certificate ready for download', time: '1 day ago', icon: 'Award', read: true },
  { id: '4', text: 'Course completed successfully', time: '2 days ago', icon: 'CheckCircle', read: true },
];

const NotificationDropdown = ({ 
  notifications, 
  onMarkAllRead, 
  onClose 
}: { 
  notifications: Notification[]; 
  onMarkAllRead: () => void;
  onClose: () => void;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
  >
    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <h3 className="font-bold text-slate-900">Notifications</h3>
      <button 
        onClick={onMarkAllRead}
        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
      >
        Mark All as Read
      </button>
    </div>
    <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
      {notifications.length > 0 ? (
        notifications.map((n) => {
          const Icon = ICONS[n.icon];
          return (
            <div key={n.id} className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/30' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className={`text-xs leading-relaxed ${!n.read ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{n.text}</p>
                <p className="text-[10px] text-slate-400">{n.time}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-8 text-center space-y-2">
          <ICONS.Bell className="w-8 h-8 text-slate-200 mx-auto" />
          <p className="text-sm text-slate-500">No new notifications</p>
        </div>
      )}
    </div>
    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
      <button onClick={onClose} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-700">Close</button>
    </div>
  </motion.div>
);

const Header = ({ 
  role, 
  setView, 
  setRole,
  onToggleSidebar,
  userId,
  searchQuery,
  setSearchQuery,
  notifications,
  showNotifications,
  setShowNotifications,
  onMarkAllRead
}: { 
  role: UserRole; 
  setView: (v: View) => void; 
  setRole: (r: UserRole) => void;
  onToggleSidebar: () => void;
  userId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  onMarkAllRead: () => void;
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const instructor = role === 'instructor' ? MOCK_TEACHERS.find(t => t.id === userId) : null;
  const userName = instructor ? instructor.name : (role === 'admin' ? 'Admin User' : 'Student User');
  const userEmail = instructor ? instructor.email : (role === 'admin' ? 'admin@lms.com' : 'aj77lion@gmail.com');

  return (
    <header className="h-24 glass sticky top-0 z-50 px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-12">
          <button 
            onClick={onToggleSidebar}
            className="p-2.5 hover:bg-slate-100 rounded-xl lg:hidden text-slate-600 transition-colors"
          >
            <ICONS.Menu className="w-6 h-6" />
          </button>
        
        <Logo onClick={() => setView(role ? (role === 'admin' ? 'admin-dashboard' : role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard') : 'home')} />
        
        {role !== 'student' && role !== 'admin' && role !== 'instructor' && (
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Home', view: 'home' },
              { label: 'Courses', view: 'browse-courses' },
              { label: 'Categories', view: 'categories' },
              { label: 'About', view: 'about-us' },
              { label: 'Contact', view: 'contact-us' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setView(item.view as any)}
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block group">
          <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search difficulty..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 0) setView('browse-courses');
            }}
            className="pl-12 pr-6 py-3 bg-slate-100/50 border-2 border-transparent rounded-2xl text-sm w-72 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          />
        </div>
        
        {role && (
          <div className="relative">
            <button 
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <ICONS.Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <NotificationDropdown 
                  notifications={notifications} 
                  onMarkAllRead={onMarkAllRead}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          {role ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-200 group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 ring-2 ring-white">
                  {userName[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900">{userName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{role}</p>
                </div>
                <ICONS.ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${isProfileOpen ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 z-50 overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-slate-50 mb-3">
                      <p className="text-sm font-black text-slate-900">{userName}</p>
                      <p className="text-xs font-medium text-slate-400 truncate">{userEmail}</p>
                    </div>
                    
                    <div className="px-3 space-y-1">
                      {[
                        { label: 'My Profile', icon: ICONS.User, view: role === 'instructor' ? 'instructor-profile' : 'student-profile' },
                        { label: 'Dashboard', icon: ICONS.LayoutDashboard, view: `${role}-dashboard` },
                        { label: 'My Courses', icon: ICONS.BookOpen, view: 'my-courses' },
                        { label: 'Certificates', icon: ICONS.Award, view: 'certificates' },
                        { label: 'Settings', icon: ICONS.Settings, view: role === 'admin' ? 'admin-settings' : 'student-settings' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            setView(item.view as any);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all group"
                        >
                          <item.icon className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 px-3">
                      <button
                        onClick={() => {
                          setRole(null);
                          setView('home');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <ICONS.LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button variant="primary" onClick={() => setView('login')}>Login / Sign Up</Button>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = ({ setView }: { setView: (v: View) => void }) => (
  <footer className="bg-slate-900 text-slate-400 py-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">E</div>
          <span className="text-xl font-bold">EduStream</span>
        </div>
        <p className="text-sm leading-relaxed">
          Empowering learners worldwide with professional-grade courses and industry-recognized certifications.
        </p>
        <div className="flex gap-4">
          <ICONS.Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => window.open('https://twitter.com', '_blank')} />
          <ICONS.Github className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => window.open('https://github.com', '_blank')} />
          <ICONS.Linkedin className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => window.open('https://linkedin.com', '_blank')} />
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-4">Platform</h4>
        <ul className="space-y-2 text-sm">
          <li><button onClick={() => setView('browse-courses')} className="hover:text-white transition-colors">Browse Courses</button></li>
          <li><button onClick={() => setView('categories')} className="hover:text-white transition-colors">Course Categories</button></li>
          <li><button onClick={() => setView('become-teacher')} className="hover:text-white transition-colors">Become an Instructor</button></li>
          <li><button onClick={() => setView('student-dashboard')} className="hover:text-white transition-colors">Student Dashboard</button></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-4">Support</h4>
        <ul className="space-y-2 text-sm">
          <li><button onClick={() => setView('help-center')} className="hover:text-white transition-colors">Help Center</button></li>
          <li><button onClick={() => setView('contact-us')} className="hover:text-white transition-colors">Contact Us</button></li>
          <li><button onClick={() => setView('privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-4">Contact Info</h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <ICONS.Mail className="w-4 h-4 text-indigo-500" />
            <span>support@edustream.com</span>
          </li>
          <li className="flex items-center gap-3">
            <ICONS.Phone className="w-4 h-4 text-indigo-500" />
            <span>+91 1800-123-4567</span>
          </li>
          <li className="flex items-center gap-3">
            <ICONS.MapPin className="w-4 h-4 text-indigo-500" />
            <span>123 Tech Park, Bangalore, India</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
      <p>© EduStream Pro 2026. All rights reserved.</p>
    </div>
  </footer>
);

const Sidebar = ({ 
  role, 
  currentView, 
  setView,
  isOpen,
  onClose
}: { 
  role: UserRole; 
  currentView: View; 
  setView: (v: View) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const adminLinks = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: ICONS.LayoutDashboard },
    { id: 'admin-students', label: 'Students', icon: ICONS.Users },
    { id: 'admin-teachers', label: 'Teachers', icon: ICONS.GraduationCap },
    { id: 'admin-courses', label: 'Courses', icon: ICONS.BookOpen },
    { id: 'admin-course-approvals', label: 'Approvals', icon: ICONS.CheckCircle },
    { id: 'admin-teacher-applications', label: 'Applications', icon: ICONS.FileText },
    { id: 'admin-categories', label: 'Categories', icon: ICONS.Menu },
    { id: 'admin-enrollments', label: 'Enrollments', icon: ICONS.FileText },
    { id: 'admin-quizzes', label: 'Quizzes', icon: ICONS.HelpCircle },
    { id: 'admin-certificates', label: 'Certificates', icon: ICONS.Award },
    { id: 'admin-payments', label: 'Payments', icon: ICONS.CreditCard },
    { id: 'admin-reports', label: 'Reports', icon: ICONS.BarChart },
    { id: 'admin-settings', label: 'Settings', icon: ICONS.Settings },
  ];

  const studentLinks = [
    { id: 'student-dashboard', label: 'Dashboard', icon: ICONS.LayoutDashboard },
    { id: 'my-courses', label: 'My Courses', icon: ICONS.BookOpen },
    { id: 'browse-courses', label: 'Browse Courses', icon: ICONS.Search },
    { id: 'categories', label: 'Categories', icon: ICONS.Menu },
    { id: 'student-quizzes', label: 'Quizzes', icon: ICONS.HelpCircle },
    { id: 'certificates', label: 'Certificates', icon: ICONS.Award },
    { id: 'student-profile', label: 'Profile', icon: ICONS.User },
    { id: 'student-settings', label: 'Settings', icon: ICONS.Settings },
  ];

  const instructorLinks = [
    { id: 'instructor-dashboard', label: 'Dashboard', icon: ICONS.LayoutDashboard },
    { id: 'create-course', label: 'Create Course', icon: ICONS.Plus },
    { id: 'edit-course-content', label: 'Course Content', icon: ICONS.FileText },
    { id: 'instructor-quizzes', label: 'Quizzes', icon: ICONS.HelpCircle },
    { id: 'instructor-messages', label: 'Messages', icon: ICONS.Mail },
    { id: 'instructor-reviews', label: 'Reviews', icon: ICONS.Star },
    { id: 'course-analytics', label: 'Analytics', icon: ICONS.BarChart },
    { id: 'instructor-profile', label: 'Profile', icon: ICONS.User },
  ];

  const guestLinks = [
    { id: 'home', label: 'Home', icon: ICONS.LayoutDashboard },
    { id: 'browse-courses', label: 'Browse Courses', icon: ICONS.Search },
    { id: 'categories', label: 'Categories', icon: ICONS.Menu },
    { id: 'about-us', label: 'About Us', icon: ICONS.Users },
    { id: 'instructors', label: 'Instructors', icon: ICONS.GraduationCap },
    { id: 'contact-us', label: 'Contact Us', icon: ICONS.Mail },
  ];

  const links = role === 'admin' ? adminLinks : (role === 'student' ? studentLinks : (role === 'instructor' ? instructorLinks : guestLinks));

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-64px)] 
        w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 lg:hidden flex items-center justify-between border-b border-slate-100 mb-4">
          <Logo onClick={() => setView('home')} />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <ICONS.X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 lg:p-6 space-y-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setView(link.id as View);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentView === link.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <link.icon className={`w-5 h-5 ${currentView === link.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              {link.label}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

// --- Views ---

const HomePage = ({ 
  setView, 
  selectedCategory, 
  setSelectedCategory, 
  courses,
  role,
  onSelectCourse
}: { 
  setView: (v: View) => void; 
  selectedCategory: string; 
  setSelectedCategory: (cat: string) => void;
  courses: Course[];
  role: UserRole;
  onSelectCourse: (id: string) => void;
}) => {
  const instructors = [
    { name: 'Dr. Ananya Iyer', expertise: 'Data Science & AI', courses: 12, image: 'https://picsum.photos/seed/inst1/200/200' },
    { name: 'Vikram Malhotra', expertise: 'Full Stack Development', courses: 8, image: 'https://picsum.photos/seed/inst2/200/200' },
    { name: 'Sanya Gupta', expertise: 'UI/UX Design', courses: 15, image: 'https://picsum.photos/seed/inst3/200/200' },
    { name: 'Arjun Reddy', expertise: 'Digital Marketing', courses: 10, image: 'https://picsum.photos/seed/inst4/200/200' },
  ];

  const stats = [
    { label: 'Students', value: '50,000+' },
    { label: 'Courses', value: '500+' },
    { label: 'Instructors', value: '200+' },
    { label: 'Certificates', value: '10,000+' },
  ];

  const filteredCourses = courses.filter(c => c.status === 'Approved' && (selectedCategory === 'All' || c.category === selectedCategory));

  return (
    <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-32 pb-40 px-6 lg:px-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              New Courses Available
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              Upgrade Your Skills <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-700">with Industry-Ready Courses.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Join over 50,000+ students learning the most in-demand skills from industry experts.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" className="px-10 py-4 text-lg shadow-xl shadow-indigo-200" onClick={() => setView('browse-courses')}>
                Browse Courses <ICONS.ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="px-10 py-4 text-lg border-2" onClick={() => setView('signup')}>
                Start Learning
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="User" referrerPolicy="no-referrer" />
                ))}
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">4.9/5</span> from 2,000+ reviews
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50 border-8 border-white group">
              <img 
                src="https://picsum.photos/seed/online-learning/1200/1000" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Hero" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 z-20 glass p-6 rounded-2xl shadow-xl max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ICONS.CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-900">Course Completed</div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-10 -left-10 z-20 glass p-6 rounded-2xl shadow-xl max-w-[220px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <ICONS.Play className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Now</div>
                  <div className="text-sm font-bold text-slate-900">React Masterclass</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
              Top Picks
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Popular Courses</h2>
            <CategoryFilterBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
          </div>
          <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50 px-6 py-3 rounded-xl" onClick={() => setView('browse-courses')}>
            View All Courses <ICONS.ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {filteredCourses.slice(0, 8).map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDetails={() => {
                    onSelectCourse(course.id);
                    setView('course-details');
                  }} 
                  onEnroll={() => {
                    onSelectCourse(course.id);
                    setView('payment-options');
                  }}
                  showProgress={role === 'student'} 
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <ICONS.Search className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">No courses available in this category yet.</h3>
                <p className="text-slate-500">Try exploring other categories or browse all our courses.</p>
              </div>
              <Button variant="primary" onClick={() => setSelectedCategory('All')}>Browse All Courses</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Become an Instructor Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/20 skew-x-12 translate-x-1/2" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                Join Our Team
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Become an Instructor <br />
                & Share Your Knowledge.
              </h2>
              <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                Join our community of expert instructors and help students around the world achieve their goals.
              </p>
              <Button 
                variant="primary" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 text-lg"
                onClick={() => setView('become-teacher')}
              >
                Apply Now <ICONS.ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="glass p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <ICONS.Users className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <div className="text-2xl font-black">200+</div>
                      <div className="text-xs text-indigo-200">Expert Instructors</div>
                    </div>
                  </div>
                  <div className="glass p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <ICONS.Award className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <div className="text-2xl font-black">Top Rated</div>
                      <div className="text-xs text-indigo-200">Quality Content</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="glass p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <ICONS.Star className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <div className="text-2xl font-black">4.9/5</div>
                      <div className="text-xs text-indigo-200">Average Rating</div>
                    </div>
                  </div>
                  <div className="glass p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <ICONS.Globe className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <div className="text-2xl font-black">Global</div>
                      <div className="text-xs text-indigo-200">Reach Students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative bg-slate-900 py-32 px-6 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-24 relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
              The Process
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: ICONS.Search, title: 'Browse Courses', desc: 'Explore our curated library of high-impact courses designed for modern careers.' },
              { icon: ICONS.Play, title: 'Learn at Your Pace', desc: 'Access bite-sized lessons and interactive assignments that fit your busy schedule.' },
              { icon: ICONS.ShieldCheck, title: 'Get Certified', desc: 'Validate your expertise with industry-recognized certificates that boost your resume.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="space-y-6 text-center group"
              >
                <div className="relative mx-auto mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-500/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <step.icon className="w-10 h-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-white font-black text-sm">
                    0{i + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
            Expert Mentors
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Learn from the Best</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {instructors.map((inst, i) => (
            <Card key={i} className="p-8 text-center group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border-slate-100/50 hover:border-indigo-200/50 bg-white/50 backdrop-blur-sm">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src={inst.image} alt={inst.name} className="relative w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border-4 border-white shadow-lg" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{inst.name}</h3>
              <p className="text-sm text-indigo-600 font-bold mt-2 uppercase tracking-wider">{inst.expertise}</p>
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-lg font-black text-slate-900">{inst.courses}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Courses</div>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <div className="text-lg font-black text-slate-900">4.9</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Rating</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Stats */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 skew-y-3 translate-y-12" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="text-6xl lg:text-7xl font-black text-white tracking-tighter">{stat.value}</div>
              <div className="text-indigo-100 font-bold uppercase tracking-[0.2em] text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certificate Preview */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center py-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
            Certification
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter">Validate Your <br /> Expertise.</h2>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            Every course you complete on EduStream Pro comes with a professional certificate of completion. Share them on LinkedIn and with employers to prove your expertise.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['Industry Recognized', 'Verifiable via QR Code', 'Professional PDF Format', 'LinkedIn Integration'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ICONS.CheckCircle className="w-4 h-4" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-indigo-100 rounded-full blur-[100px] opacity-30" />
          <Card className="relative p-12 border-[16px] border-slate-50 bg-white shadow-2xl rounded-[2rem]">
            <div className="border-2 border-slate-100 p-12 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              {/* Decorative seal */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50" />
              
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200">E</div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Certificate of Achievement</p>
                <div className="h-px w-20 bg-indigo-100 mx-auto" />
              </div>
              
              <div className="space-y-4">
                <p className="text-lg font-serif italic text-slate-500">This is to certify that</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">John Doe</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-500 font-medium">has successfully completed the professional course</p>
                <p className="text-2xl font-black text-indigo-600 tracking-tight">Advanced Full-Stack Development</p>
              </div>

              <div className="pt-12 flex justify-between w-full items-end">
                <div className="text-left space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</div>
                  <div className="text-sm font-black text-slate-900">MARCH 2026</div>
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-sm opacity-50" />
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certificate ID</div>
                  <div className="text-sm font-black text-slate-900">ED-99283-X</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-[2rem]">
              <Badge color="slate">Preview Only</Badge>
            </div>
          </Card>
        </motion.div>
      </section>
      {/* Learning Benefits */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { title: 'Flexible Learning', desc: 'Learn on your own schedule from anywhere.', icon: ICONS.Clock },
            { title: 'Expert Instructors', desc: 'Taught by industry professionals with real experience.', icon: ICONS.GraduationCap },
            { title: 'Affordable Pricing', desc: 'Quality education at a fraction of the cost.', icon: ICONS.CreditCard },
            { title: 'Lifetime Access', desc: 'Once you enroll, the course is yours forever.', icon: ICONS.ShieldCheck }
          ].map((benefit, i) => (
            <div key={i} className="space-y-4 group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 py-24 px-12 text-center space-y-10">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_70%)]" />
          </div>
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">Ready to start your learning journey?</h2>
            <p className="text-xl text-indigo-100/60 font-medium">Join 50,000+ students already learning on EduStream Pro. Start your free trial today.</p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-6">
            <Button variant="primary" className="px-12 py-5 text-xl shadow-2xl shadow-indigo-500/40" onClick={() => setView('browse-courses')}>
              Get Started for Free
            </Button>
            <Button variant="outline" className="px-12 py-5 text-xl border-white/20 text-white hover:bg-white/10" onClick={() => setView('about-us')}>
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = ({ onLogin, setView, message }: { onLogin: (role: UserRole, userId?: string) => void; setView: (v: View) => void; message: string | null }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Admin login
    if (email === 'admin@lms.com' && password === 'admin123') {
      onLogin('admin');
      return;
    }

    // Teacher login (check by ID or Email)
    const teacher = MOCK_TEACHERS.find(t => (t.id === email || t.email === email) && password === 'password123');
    if (teacher) {
      onLogin('instructor', teacher.id);
      return;
    }

    // Student login
    if (email.includes('@') && password === 'student123') {
      onLogin('student');
      return;
    }

    setError('Invalid credentials. Please try again.');
  };

  return (
    <div className="py-32 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none -z-10">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-50" />
      </div>

      {(message || error) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 w-full max-w-md p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border ${error ? 'bg-red-50 border-red-100 text-red-700' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}
        >
          {error || message}
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to your EduStream Pro account</p>
        </div>

        <Card className="p-10 shadow-2xl shadow-indigo-500/10 border-slate-100/50 bg-white/80 backdrop-blur-xl rounded-3xl">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ID / Email Address</label>
              <input 
                type="text" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ID (e.g. T201) or Email"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-5 text-lg shadow-xl shadow-indigo-500/20">
              Sign In
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to EduStream? <button onClick={() => setView('signup')} className="text-indigo-600 font-black hover:underline">Create Account</button>
            </p>
          </div>
        </Card>

        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Demo Credentials</p>
          <div className="grid grid-cols-1 gap-2 text-[10px] font-bold text-slate-500">
            <div className="flex justify-between items-center px-3 py-2 bg-white rounded-lg border border-slate-100">
              <span>Admin</span>
              <span className="font-mono text-indigo-600">admin@lms.com / admin123</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2 bg-white rounded-lg border border-slate-100">
              <span>Instructor</span>
              <span className="font-mono text-indigo-600">T201 / password123</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2 bg-white rounded-lg border border-slate-100">
              <span>Student</span>
              <span className="font-mono text-indigo-600">student@lms.com / student123</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SignupPage = ({ onLogin, setView }: { onLogin: (role: UserRole) => void; setView: (v: View) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' as UserRole });
  const [nameError, setNameError] = useState('');

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name) return 'Name is required';
    if (!nameRegex.test(name)) return 'Name can only contain alphabets and spaces';
    return '';
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateName(formData.name);
    if (error) {
      setNameError(error);
      return;
    }
    onLogin('student');
  };

  return (
    <div className="py-32 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none -z-10">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 font-medium">Join our global community of learners</p>
        </div>

        <Card className="p-10 shadow-2xl shadow-indigo-500/10 border-slate-100/50 bg-white/80 backdrop-blur-xl rounded-3xl">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setNameError(validateName(e.target.value));
                }}
                placeholder="John Doe"
                className={`w-full px-5 py-4 rounded-2xl border ${nameError ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500'} transition-all outline-none bg-slate-50/50 font-medium`}
              />
              {nameError && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tighter">{nameError}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-5 text-lg shadow-xl shadow-indigo-500/20">
              Create Account
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account? <button onClick={() => setView('login')} className="text-indigo-600 font-black hover:underline">Sign In</button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const BecomeTeacherPage = ({ setView, showToast, onSubmit }: { setView: (v: View) => void; showToast: (m: string, t: any) => void; onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: '',
    experience: '',
    bio: ''
  });

  const [errors, setErrors] = useState({
    name: ''
  });

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name) return 'Name is required';
    if (!nameRegex.test(name)) return 'Name can only contain alphabets and spaces';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateName(formData.name);
    if (nameError) {
      setErrors({ ...errors, name: nameError });
      showToast(nameError, 'error');
      return;
    }

    onSubmit(formData);
    showToast('Application submitted successfully! We will review it and get back to you.', 'success');
    setView('home');
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
          Instructor Application
        </div>
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">Become an Instructor</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Share your expertise with the world. Fill out the form below to start your journey as an educator on EduStream.
        </p>
      </div>

      <Card className="p-10 lg:p-16 shadow-2xl border-slate-100/50 bg-white/80 backdrop-blur-xl rounded-[3rem]">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: validateName(e.target.value) });
              }}
              placeholder="John Doe"
              className={`w-full px-5 py-4 rounded-2xl border ${errors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500'} transition-all outline-none bg-slate-50/50 font-medium`}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tighter">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Area of Expertise</label>
            <input 
              type="text" 
              required
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              placeholder="e.g. Web Development, Data Science"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Years of Experience</label>
            <input 
              type="number" 
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g. 5"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Short Bio</label>
            <textarea 
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself and your teaching experience..."
              rows={4}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-medium resize-none"
            />
          </div>
          <div className="md:col-span-2 pt-4">
            <Button type="submit" variant="primary" className="w-full py-5 text-lg shadow-xl shadow-indigo-500/20">
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const InstructorsPage = ({ setView }: { setView: (v: View) => void }) => (
  <div className="py-12 px-6 max-w-7xl mx-auto space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-slate-900">Meet Our Expert Instructors</h1>
      <p className="text-slate-500 max-w-2xl mx-auto">Learn from industry professionals with years of experience in their respective fields.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {MOCK_TEACHERS.map((teacher) => (
        <Card key={teacher.id} className="p-6 text-center space-y-4 group hover:shadow-xl transition-all">
          <div className="relative inline-block">
            <img src={teacher.image} alt={teacher.name} className="w-32 h-32 rounded-full object-cover border-4 border-slate-50" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 rounded-full bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{teacher.name}</h3>
            <p className="text-sm text-slate-500">Expert Instructor</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-sm">
            <ICONS.BookOpen className="w-4 h-4" />
            <span>{teacher.assignedCourses} Courses</span>
          </div>
          <Button variant="outline" className="w-full" onClick={() => setView('instructors')}>View Profile</Button>
        </Card>
      ))}
    </div>
  </div>
);

const AboutUsPage = () => (
  <div className="py-12 px-6 max-w-7xl mx-auto space-y-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-slate-900 leading-tight">Revolutionizing Education Through Technology</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          EduStream Pro is a leading online learning platform dedicated to providing high-quality, accessible education to learners worldwide. Our mission is to empower individuals with the skills they need to succeed in the modern workforce.
        </p>
        <div className="grid grid-cols-2 gap-8 pt-6">
          <div>
            <p className="text-4xl font-bold text-indigo-600">10M+</p>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Students</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-indigo-600">50K+</p>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Courses</p>
          </div>
        </div>
      </div>
      <div className="relative">
        <img src="https://picsum.photos/seed/about/800/600" className="rounded-3xl shadow-2xl" alt="About Us" referrerPolicy="no-referrer" />
        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <ICONS.CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Certified Platform</p>
              <p className="text-xs text-slate-500">Industry recognized standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white">Our Core Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
            <ICONS.Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Excellence</h3>
          <p className="text-slate-400 text-sm">We strive for the highest quality in every course we offer.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <ICONS.Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Community</h3>
          <p className="text-slate-400 text-sm">Building a supportive environment for learners and teachers.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <ICONS.ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Integrity</h3>
          <p className="text-slate-400 text-sm">Transparency and trust are at the heart of our platform.</p>
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="py-12 px-6 max-w-7xl mx-auto space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-slate-900">Get in Touch</h1>
      <p className="text-slate-500 max-w-2xl mx-auto">Have questions? We're here to help. Send us a message and we'll get back to you as soon as possible.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="space-y-8">
        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <ICONS.Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Email Us</h3>
            <p className="text-sm text-slate-500">support@edustream.pro</p>
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <ICONS.HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Call Us</h3>
            <p className="text-sm text-slate-500">+91 12345 67890</p>
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <ICONS.Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Office</h3>
            <p className="text-sm text-slate-500">Tech Park, Bengaluru, India</p>
          </div>
        </Card>
      </div>
      <Card className="lg:col-span-2 p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">First Name</label>
              <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Last Name</label>
              <input type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Subject</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>General Inquiry</option>
              <option>Technical Support</option>
              <option>Billing Question</option>
              <option>Partnership</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Message</label>
            <textarea rows={5} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>
          <Button variant="primary" className="w-full py-4 text-lg">Send Message</Button>
        </form>
      </Card>
    </div>
  </div>
);

const CourseLearningPage = ({ setView, courseId, courses }: { setView: (v: View) => void; courseId: string | null; courses: Course[] }) => {
  const course = courses.find(c => c.id === courseId) || courses[0];
  const [activeLesson, setActiveLesson] = useState(0);
  const lessons = [
    { title: 'Introduction to the Course', duration: '10:00', completed: true },
    { title: 'Setting up your Environment', duration: '15:30', completed: true },
    { title: 'Core Concepts & Fundamentals', duration: '25:00', completed: false },
    { title: 'Building your First Project', duration: '45:00', completed: false },
    { title: 'Advanced Techniques', duration: '30:00', completed: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
          <p className="text-slate-500">Instructor: {course.instructor}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
        <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative group">
          <img src="https://picsum.photos/seed/lecture/1280/720" className="w-full h-full object-cover opacity-50" alt="Video" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <ICONS.Play className="w-8 h-8 fill-current" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-xl font-bold text-white">{lessons[activeLesson].title}</h2>
            <p className="text-slate-300 text-sm">Lesson {activeLesson + 1} of {lessons.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="outline" disabled={activeLesson === 0} onClick={() => setActiveLesson(activeLesson - 1)}>
              <ICONS.ArrowLeft className="w-4 h-4" /> Previous
            </Button>
            <Button variant="primary" onClick={() => {
              if (activeLesson < lessons.length - 1) setActiveLesson(activeLesson + 1);
            }}>
              Next Lesson <ICONS.ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" className="text-emerald-600 border-emerald-100 hover:bg-emerald-50">
            <ICONS.CheckCircle className="w-4 h-4" /> Mark as Complete
          </Button>
        </div>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <button className="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-4">Overview</button>
            <button className="text-sm font-bold text-slate-500 pb-4 hover:text-slate-700">Resources</button>
            <button className="text-sm font-bold text-slate-500 pb-4 hover:text-slate-700">Q&A</button>
            <button className="text-sm font-bold text-slate-500 pb-4 hover:text-slate-700">Reviews</button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About this Lesson</h3>
            <p className="text-slate-600 leading-relaxed">
              In this lesson, we will cover the fundamental concepts required to understand the course material. We'll explore the core architecture and how different components interact with each other.
            </p>
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Downloadable Materials</h4>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <ICONS.FileText className="w-5 h-5 text-indigo-600" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Lesson_Notes.pdf</p>
                  <p className="text-[10px] text-slate-500">2.4 MB • PDF Document</p>
                </div>
                <Button variant="ghost" className="text-indigo-600"><ICONS.Upload className="w-4 h-4 rotate-180" /></Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-6 h-fit sticky top-28">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <ICONS.Menu className="w-4 h-4" /> Course Content
        </h3>
        <div className="space-y-2">
          {lessons.map((lesson, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveLesson(idx)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${idx === activeLesson ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${lesson.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {lesson.completed ? <ICONS.CheckCircle className="w-3 h-3" /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${idx === activeLesson ? 'text-indigo-700' : 'text-slate-700'}`}>{lesson.title}</p>
                <p className="text-[10px] text-slate-500">{lesson.duration}</p>
              </div>
              {idx === activeLesson && <ICONS.Play className="w-3 h-3 text-indigo-600" />}
            </button>
          ))}
        </div>
      </Card>
    </div>
    </div>
  );
};

interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'multi' | 'boolean';
  options: string[];
  correctAnswer: number | number[] | boolean;
}

const QuizSession = ({ 
  courseId, 
  onComplete, 
  onCancel 
}: { 
  courseId: string | null; 
  onComplete: (score: number, total: number, questions: QuizQuestion[], answers: any[]) => void;
  onCancel: () => void;
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(20).fill(-1));
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes

  // Generate 20 mock questions with different types
  const questions: QuizQuestion[] = Array.from({ length: 20 }, (_, i) => {
    const type = i % 3 === 0 ? 'mcq' : i % 3 === 1 ? 'multi' : 'boolean';
    return {
      id: `${i}`,
      type,
      question: type === 'boolean' 
        ? `Question ${i + 1}: Is it true that this topic is essential for modern development?`
        : type === 'multi'
          ? `Question ${i + 1}: Which of the following are key benefits of this topic? (Select all that apply)`
          : `Question ${i + 1}: What is the primary purpose of this topic in the context of modern development?`,
      options: type === 'boolean' 
        ? ['True', 'False']
        : type === 'multi'
          ? ['Performance', 'Scalability', 'Maintainability', 'Cost Efficiency']
          : ['To improve performance', 'To simplify development', 'To enhance UX', 'All of the above'],
      correctAnswer: type === 'boolean' ? true : type === 'multi' ? [0, 1, 2] : 3
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [...answers];
    
    if (currentQuestion.type === 'multi') {
      const currentAnswer = (newAnswers[currentQuestionIndex] as number[]) || [];
      if (Array.isArray(currentAnswer)) {
        if (currentAnswer.includes(optionIndex)) {
          newAnswers[currentQuestionIndex] = currentAnswer.filter(idx => idx !== optionIndex);
        } else {
          newAnswers[currentQuestionIndex] = [...currentAnswer, optionIndex];
        }
      } else {
        newAnswers[currentQuestionIndex] = [optionIndex];
      }
    } else if (currentQuestion.type === 'boolean') {
      newAnswers[currentQuestionIndex] = optionIndex === 0; // 0 for True, 1 for False
    } else {
      newAnswers[currentQuestionIndex] = optionIndex;
    }
    
    setAnswers(newAnswers);
  };

  const isSelected = (idx: number) => {
    const answer = answers[currentQuestionIndex];
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.type === 'multi') {
      return Array.isArray(answer) && answer.includes(idx);
    } else if (currentQuestion.type === 'boolean') {
      return (idx === 0 && answer === true) || (idx === 1 && answer === false);
    }
    return answer === idx;
  };

  const handleSubmit = () => {
    const score = answers.reduce((acc, curr, idx) => {
      const question = questions[idx];
      if (question.type === 'multi') {
        const correct = question.correctAnswer as number[];
        const user = curr as number[];
        if (Array.isArray(user) && user.length === correct.length && user.every(v => correct.includes(v))) {
          return acc + 1;
        }
      } else if (question.type === 'boolean') {
        if (curr === question.correctAnswer) return acc + 1;
      } else {
        if (curr === question.correctAnswer) return acc + 1;
      }
      return acc;
    }, 0);
    onComplete(score, questions.length, questions, answers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ICONS.ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Course Quiz</h1>
            <p className="text-xs text-slate-500">Assessment for your current course</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
          <ICONS.Clock className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-black text-indigo-700 font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            className="h-full bg-indigo-600"
          />
        </div>

        <Card className="p-10 space-y-8 shadow-xl border-slate-100/50">
          <h2 className="text-xl font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4 group ${
                  isSelected(idx)
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-500/10'
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected(idx)
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-300 group-hover:border-indigo-400'
                }`}>
                  {isSelected(idx) && (
                    <div className={currentQuestion.type === 'multi' ? "w-2 h-2 bg-white rounded-sm" : "w-2 h-2 bg-white rounded-full"} />
                  )}
                </div>
                <span className={`font-medium ${isSelected(idx) ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline" 
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          >
            <ICONS.ArrowLeft className="w-4 h-4" /> Previous
          </Button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <Button 
              variant="primary" 
              className="px-10 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              onClick={handleSubmit}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              variant="primary" 
              className="px-10"
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            >
              Next Question <ICONS.ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const QuizResult = ({ 
  score, 
  total, 
  questions,
  answers,
  onClose 
}: { 
  score: number; 
  total: number; 
  questions: QuizQuestion[];
  answers: any[];
  onClose: () => void;
}) => {
  const percentage = (score / total) * 100;
  const passed = percentage >= 60;

  const isCorrect = (idx: number) => {
    const question = questions[idx];
    const user = answers[idx];
    if (question.type === 'multi') {
      const correct = question.correctAnswer as number[];
      return Array.isArray(user) && user.length === correct.length && user.every(v => correct.includes(v));
    } else if (question.type === 'boolean') {
      return user === question.correctAnswer;
    }
    return user === question.correctAnswer;
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <Card className="p-12 text-center space-y-10 shadow-2xl border-slate-100/50">
        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl ${
          passed ? 'bg-emerald-100 text-emerald-600 shadow-emerald-100' : 'bg-red-100 text-red-600 shadow-red-100'
        }`}>
          {passed ? <ICONS.Award className="w-12 h-12" /> : <ICONS.X className="w-12 h-12" />}
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            You have completed the course assessment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
            <p className="text-2xl font-black text-slate-900">{score}/{total}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentage</p>
            <p className="text-2xl font-black text-slate-900">{Math.round(percentage)}%</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
            <p className={`text-2xl font-black ${passed ? 'text-emerald-600' : 'text-red-600'}`}>{passed ? 'PASSED' : 'FAILED'}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Spent</p>
            <p className="text-2xl font-black text-slate-900">12:45</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="primary" className="flex-1 py-4 text-lg" onClick={onClose}>
            Back to Dashboard
          </Button>
          {passed && (
            <Button variant="outline" className="flex-1 py-4 text-lg border-indigo-200 text-indigo-600">
              Download Certificate
            </Button>
          )}
        </div>
      </Card>

      <div className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Review Answers</h3>
        <div className="space-y-6">
          {questions.map((q, i) => (
            <Card key={q.id} className={`p-8 border-2 ${isCorrect(i) ? 'border-emerald-100 bg-emerald-50/20' : 'border-red-100 bg-red-50/20'}`}>
              <div className="flex gap-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCorrect(i) ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {isCorrect(i) ? <ICONS.CheckCircle className="w-6 h-6" /> : <ICONS.XCircle className="w-6 h-6" />}
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {i + 1}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCorrect(i) ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {isCorrect(i) ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 leading-relaxed">{q.question}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Answer</p>
                      <div className={`p-4 rounded-xl border ${isCorrect(i) ? 'bg-white border-emerald-200 text-emerald-900' : 'bg-white border-red-200 text-red-900'} font-medium`}>
                        {q.type === 'multi' 
                          ? (answers[i] as number[]).map(idx => q.options[idx]).join(', ') || 'No answer'
                          : q.type === 'boolean'
                            ? (answers[i] === true ? 'True' : answers[i] === false ? 'False' : 'No answer')
                            : (q.options[answers[i]] || 'No answer')}
                      </div>
                    </div>
                    {!isCorrect(i) && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answer</p>
                        <div className="p-4 rounded-xl border bg-white border-emerald-200 text-emerald-900 font-medium">
                          {q.type === 'multi' 
                            ? (q.correctAnswer as number[]).map(idx => q.options[idx]).join(', ')
                            : q.type === 'boolean'
                              ? (q.correctAnswer === true ? 'True' : 'False')
                              : q.options[q.correctAnswer as number]}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentQuizzesPage = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Quizzes</h1>
        <p className="text-slate-500">Test your knowledge and track your progress</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <ICONS.FileText className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${i === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              {i === 1 ? 'Completed' : 'Pending'}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Quiz {i}: Web Fundamentals</h3>
            <p className="text-xs text-slate-500 mt-1">Course: Modern Web Development</p>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100">
            <span className="text-slate-500">20 Questions</span>
            <span className="text-slate-900 font-bold">{i === 1 ? 'Score: 18/20' : 'Time: 20m'}</span>
          </div>
          <Button 
            variant={i === 1 ? 'outline' : 'primary'} 
            className="w-full" 
            onClick={() => {
              if (i === 1) showToast('Reviewing results...', 'info');
              else setView('student-quiz-session');
            }}
          >
            {i === 1 ? 'Review Results' : 'Start Quiz'}
          </Button>
        </Card>
      ))}
    </div>
  </div>
);

const InstructorQuizzesPage = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
        <p className="text-slate-500">Create and manage quizzes for your courses</p>
      </div>
      <Button variant="primary" onClick={() => showToast('Opening Create Quiz dialog...', 'info')}><ICONS.Plus className="w-4 h-4" /> Create New Quiz</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Quiz {i}: Advanced React Patterns</h3>
            <Button variant="ghost" className="text-slate-400" onClick={() => showToast('Opening Quiz Settings...', 'info')}><ICONS.Settings className="w-4 h-4" /></Button>
          </div>
          <p className="text-xs text-slate-500">Course: Master React in 30 Days</p>
          <div className="flex items-center gap-6 text-xs text-slate-500 pt-4 border-t border-slate-100">
            <span className="flex items-center gap-1"><ICONS.Users className="w-3 h-3" /> 120 Attempts</span>
            <span className="flex items-center gap-1"><ICONS.Star className="w-3 h-3" /> 85% Avg. Score</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => showToast('Opening Question Editor...', 'info')}>Edit Questions</Button>
            <Button variant="outline" className="flex-1" onClick={() => showToast('Viewing Quiz Results...', 'info')}>View Results</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const AdminDashboard = ({ 
  setView, 
  showToast,
  applicationCount
}: { 
  setView: (v: View) => void; 
  showToast: (m: string, t?: 'success' | 'error' | 'info') => void;
  applicationCount: number;
}) => {
  const stats = [
    { label: 'Total Students', value: '12,450', icon: ICONS.Users, color: 'text-blue-600', bg: 'bg-blue-50', view: 'admin-students' as View },
    { label: 'Total Instructors', value: '148', icon: ICONS.GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50', view: 'admin-teachers' as View },
    { label: 'Total Courses', value: '342', icon: ICONS.BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', view: 'admin-courses' as View },
    { label: 'Applications', value: applicationCount.toString(), icon: ICONS.FileText, color: 'text-rose-600', bg: 'bg-rose-50', view: 'admin-teacher-applications' as View },
    { label: 'Payment Reports', value: '₹12.4L', icon: ICONS.BarChart, color: 'text-amber-600', bg: 'bg-amber-50', view: 'admin-payments' as View },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-500">Welcome back, Administrator.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setView('admin-course-approvals')}><ICONS.ShieldCheck className="w-4 h-4" /> Course Approvals</Button>
          <Button variant="primary" onClick={() => setView('admin-add-course')}><ICONS.Plus className="w-4 h-4" /> New Course</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 cursor-pointer hover:shadow-md transition-all group" onClick={() => setView(stat.view)}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Recent Course Enrollments</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">S</div>
                  <div>
                    <p className="text-sm font-bold">Student Name {i+1}</p>
                    <p className="text-xs text-slate-500">Enrolled in React Masterclass</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">2 mins ago</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Instructor Performance</h3>
          <div className="space-y-4">
            {['Arjun Sharma', 'Priya Patel', 'Rohan Verma'].map((name, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{name[0]}</div>
                  <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-xs text-slate-500">4.9 Rating • 12 Courses</p>
                  </div>
                </div>
                <Badge color="emerald">Top Rated</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StudentDashboard = ({ 
  setView,
  courses,
  onSelectCourse
}: { 
  setView: (v: View) => void;
  courses: Course[];
  onSelectCourse: (id: string) => void;
}) => {
  const enrolledCourses = courses.filter(c => c.progress !== undefined);
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);
  const inProgressCourses = enrolledCourses.filter(c => c.progress !== undefined && c.progress < 100);
  
  const totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((acc, c) => acc + (c.progress || 0), 0) / enrolledCourses.length)
    : 0;

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length.toString(), icon: ICONS.BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', action: () => setView('my-courses') },
    { label: 'Courses Completed', value: completedCourses.length.toString(), icon: ICONS.CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', action: () => setView('completed-courses') },
    { label: 'Certificates Earned', value: '8', icon: ICONS.Award, color: 'text-amber-600', bg: 'bg-amber-50', action: () => setView('certificates') },
    { label: 'Pending Assignments', value: '3', icon: ICONS.FileText, color: 'text-rose-600', bg: 'bg-rose-50', action: null },
  ];

  const upcomingQuizzes = [
    { title: 'React.js Masterclass', quiz: 'Final Assessment', date: 'Tomorrow, 10:00 AM', duration: '45 mins' },
    { title: 'UI/UX Design Bootcamp', quiz: 'Module 3 Quiz', date: 'March 6, 2026', duration: '20 mins' },
    { title: 'Python Programming', quiz: 'Mid-term Quiz', date: 'March 8, 2026', duration: '30 mins' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Student Dashboard</h1>
          <p className="text-slate-500 font-medium text-lg">Your learning journey at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setView('browse-courses')} className="rounded-2xl border-slate-200 font-black uppercase tracking-widest text-xs py-4">Explore More</Button>
          <Button variant="primary" onClick={() => setView('my-courses')} className="rounded-2xl font-black uppercase tracking-widest text-xs py-4 shadow-xl shadow-indigo-500/20">My Learning</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.button 
            key={i} 
            whileHover={{ y: -5 }}
            onClick={() => stat.action?.()}
            className={`text-left group ${!stat.action ? 'cursor-default' : ''}`}
          >
            <Card className="p-8 group-hover:border-indigo-200 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 transition-all rounded-[2rem] border-slate-100/50">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-inner`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Current Progress</h2>
              <Button variant="ghost" className="text-indigo-600 font-black uppercase tracking-widest text-[10px]" onClick={() => setView('my-courses')}>View All</Button>
            </div>
            
            <div className="space-y-6">
              {inProgressCourses.length > 0 ? inProgressCourses.map((course) => (
                <Card key={course.id} className="p-6 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all rounded-3xl border-slate-100/50 group">
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="relative w-full sm:w-48 h-32 shrink-0 overflow-hidden rounded-2xl">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                          <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{course.progress}%</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next: {course.level} Module</p>
                      </div>
                      <div className="mt-6">
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                          />
                        </div>
                        <div className="flex justify-between mt-4">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Last active: 2 hours ago</span>
                          <button onClick={() => {
                            onSelectCourse(course.id);
                            setView('course-details');
                          }} className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">Resume Course</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card className="p-20 text-center border-dashed border-2 border-slate-200 rounded-[3rem] bg-slate-50/50">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <ICONS.BookOpen className="w-10 h-10" />
                  </div>
                  <p className="text-slate-500 font-bold text-lg">No courses in progress. Start learning today!</p>
                  <Button variant="primary" className="mt-8 px-10 rounded-2xl font-black uppercase tracking-widest text-xs py-4" onClick={() => setView('browse-courses')}>Browse Courses</Button>
                </Card>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Learning Activity</h2>
            <Card className="p-10 rounded-[2.5rem] border-slate-100/50 shadow-2xl shadow-indigo-500/5">
              <div className="flex items-end justify-between h-48 gap-4">
                {[30, 50, 80, 40, 90, 60, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full relative h-full flex flex-col justify-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="w-full bg-slate-50 rounded-2xl group-hover:bg-indigo-600 transition-all duration-500 relative cursor-pointer"
                      >
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap shadow-xl">
                          {Math.round(h/10)}h spent
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ICONS.BarChart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">This Week</div>
                    <div className="text-lg font-black text-slate-900 leading-none">24.5 Hours</div>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest">
                  +12% from last week
                </div>
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6 font-black tracking-tight">Upcoming Quizzes</h2>
            <div className="space-y-4">
              {upcomingQuizzes.map((item, i) => (
                <Card key={i} className="p-5 border-l-4 border-l-indigo-600 rounded-2xl hover:shadow-lg transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">{item.duration}</span>
                      <ICONS.Clock className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm tracking-tight">{item.title}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1">{item.quiz}</p>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.date}</p>
                  </div>
                </Card>
              ))}
              <Button variant="outline" className="w-full text-xs font-black uppercase tracking-widest py-4 rounded-2xl border-slate-200">View All Quizzes</Button>
            </div>
          </section>

          <Card className="p-6 bg-slate-900 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ICONS.Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Next Milestone</h3>
              <p className="text-sm text-slate-400">Complete 2 more modules in "Advanced React" to earn your next certificate!</p>
              <Button variant="secondary" className="w-full bg-white text-slate-900 hover:bg-slate-100">Claim Reward</Button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ 
  course, 
  onDetails, 
  onEnroll, 
  showProgress = false 
}: { 
  course: Course; 
  onDetails: () => void; 
  onEnroll?: () => void;
  showProgress?: boolean; 
  key?: React.Key 
}) => (
  <Card className="group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border-slate-100/50 hover:border-indigo-200/50 bg-white/50 backdrop-blur-sm" >
    <div onClick={onDetails}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge color="indigo" className="glass shadow-sm border-white/40">{course.category}</Badge>
          <Badge color={course.level === 'Beginner' ? 'emerald' : course.level === 'Intermediate' ? 'amber' : 'slate'} className="glass shadow-sm border-white/40">{course.level}</Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="glass px-2.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 text-[10px] font-bold text-slate-700 border-white/40">
            <ICONS.Clock className="w-3.5 h-3.5 text-indigo-600" />
            {course.duration}
          </div>
        </div>

        {showProgress && course.progress !== undefined && (
          <div className="absolute inset-x-4 bottom-4 z-20">
            <div className="glass p-3 rounded-2xl shadow-xl space-y-2 border-white/40 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-indigo-600">
                <span>Your Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <ICONS.Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(course.rating) ? 'fill-current' : 'opacity-20'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{course.rating}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.students.toLocaleString()} students</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 h-12 group-hover:text-indigo-600 transition-colors duration-300">{course.title}</h3>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-200">
              {course.instructor[0]}
            </div>
            <span className="text-xs font-semibold text-slate-500">{course.instructor}</span>
          </div>
        </div>

        {showProgress && course.progress !== undefined ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1"><ICONS.CheckCircle className="w-3 h-3 text-emerald-500" /> {Math.round(course.progress / 10)}/10 Lessons</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <Button 
              variant="primary" 
              className="w-full py-2 text-xs shadow-indigo-100"
              onClick={(e) => {
                e.stopPropagation();
                onDetails();
              }}
            >
              Continue Learning <ICONS.ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-100/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</span>
              <span className="text-xl font-black text-slate-900 tracking-tighter">₹{course.price.toLocaleString()}</span>
            </div>
            <Button 
              variant="ghost" 
              className="p-2.5 rounded-xl hover:bg-indigo-50 group/btn"
              onClick={(e) => {
                e.stopPropagation();
                onEnroll?.();
              }}
            >
              <ICONS.ArrowRight className="w-5 h-5 text-slate-400 group-hover/btn:text-indigo-600 group-hover/btn:translate-x-1 transition-all" />
            </Button>
          </div>
        )}
      </div>
    </div>
  </Card>
);

const BrowseCourses = ({ 
  setView, 
  selectedCategory, 
  setSelectedCategory, 
  courses,
  role,
  searchQuery,
  setSearchQuery,
  onSelectCourse
}: { 
  setView: (v: View) => void; 
  selectedCategory: string; 
  setSelectedCategory: (cat: string) => void;
  courses: Course[];
  role: UserRole;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectCourse: (id: string) => void;
}) => {
  const filteredCourses = courses.filter(c => 
    c.status === 'Approved' && 
    (selectedCategory === 'All' || c.category === selectedCategory) &&
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Browse Courses</h1>
          <p className="text-slate-500 mt-1">Explore our wide range of professional courses</p>
        </div>
        <div className="relative w-full md:w-80">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search difficulty..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
          />
        </div>
      </div>

      <div className="space-y-8">
        <CategoryFilterBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDetails={() => {
                    onSelectCourse(course.id);
                    setView('course-details');
                  }} 
                  onEnroll={() => {
                    onSelectCourse(course.id);
                    setView('payment-options');
                  }}
                  showProgress={role === 'student'} 
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <ICONS.Search className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">No courses available in this category yet.</h3>
                <p className="text-slate-500">Try exploring other categories or browse all our courses.</p>
              </div>
              <Button variant="primary" onClick={() => setSelectedCategory('All')}>Browse All Courses</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CategoriesPage = ({ setView, setSelectedCategory }: { setView: (v: View) => void; setSelectedCategory: (cat: string) => void }) => {
  const categories = [
    { name: 'Development', icon: ICONS.Code, count: 120, color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Design', icon: ICONS.Palette, count: 85, color: 'bg-rose-50 text-rose-600' },
    { name: 'Business', icon: ICONS.Briefcase, count: 64, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Marketing', icon: ICONS.Megaphone, count: 42, color: 'bg-amber-50 text-amber-600' },
    { name: 'Finance', icon: ICONS.CreditCard, count: 38, color: 'bg-sky-50 text-sky-600' },
    { name: 'Health', icon: ICONS.Heart, count: 25, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Explore Categories</h1>
        <p className="text-slate-500 font-medium">Discover courses across various domains and start your learning journey today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <motion.button
            key={cat.name}
            whileHover={{ y: -8 }}
            onClick={() => {
              setSelectedCategory(cat.name);
              setView('browse-courses');
            }}
            className="text-left group"
          >
            <Card className="p-8 rounded-[2rem] border-slate-100/50 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.color} shadow-inner`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{cat.count} Courses</p>
                </div>
              </div>
            </Card>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const AdminReports = ({ setView }: { setView: (v: View) => void }) => {
  const enrollmentData = [
    { name: 'Jan', students: 400 },
    { name: 'Feb', students: 600 },
    { name: 'Mar', students: 450 },
    { name: 'Apr', students: 800 },
    { name: 'May', students: 550 },
    { name: 'Jun', students: 900 },
    { name: 'Jul', students: 700 },
    { name: 'Aug', students: 850 },
    { name: 'Sep', students: 650 },
    { name: 'Oct', students: 950 },
    { name: 'Nov', students: 750 },
    { name: 'Dec', students: 1000 },
  ];

  const categoryData = [
    { name: 'Web Dev', value: 400 },
    { name: 'Data Science', value: 300 },
    { name: 'Business', value: 200 },
    { name: 'Design', value: 150 },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-6">Student Enrollment Growth</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-6">Popular Categories</h3>
          <div className="h-64 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-8">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminCategories = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
        <p className="text-slate-500">Organize courses by categories and sub-categories</p>
      </div>
      <Button variant="primary" onClick={() => showToast('Opening Add Category dialog...', 'info')}><ICONS.Plus className="w-4 h-4" /> Add Category</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Programming', 'Design', 'Business', 'Marketing', 'Music', 'Lifestyle'].map((cat) => (
        <Card key={cat} className="p-6 flex items-center justify-between hover:border-indigo-200 transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl flex items-center justify-center transition-colors">
              <ICONS.Menu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{cat}</h3>
              <p className="text-xs text-slate-500">24 Courses</p>
            </div>
          </div>
          <Button variant="ghost" className="text-slate-400" onClick={() => showToast(`Settings for ${cat} category`, 'info')}><ICONS.Settings className="w-4 h-4" /></Button>
        </Card>
      ))}
    </div>
  </div>
);

const AdminEnrollments = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-slate-900">Enrollment Management</h1>
    <Card className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Student</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Course</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">S</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Student {i}</p>
                    <p className="text-[10px] text-slate-500">student{i}@example.com</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">Modern Web Development</td>
              <td className="px-6 py-4 text-sm text-slate-500">Oct {10 + i}, 2023</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">Active</span>
              </td>
              <td className="px-6 py-4">
                <Button variant="ghost" className="text-indigo-600 text-xs" onClick={() => showToast('Viewing enrollment details...', 'info')}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const AdminQuizzes = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Final Assessment: UI/UX Design</h3>
            <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">20 Questions</span>
          </div>
          <p className="text-sm text-slate-500">Instructor: Arjun Sharma</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><ICONS.Users className="w-3 h-3" /> 450 Passed</span>
              <span className="flex items-center gap-1"><ICONS.Star className="w-3 h-3" /> 4.5 Avg</span>
            </div>
            <Button variant="outline" className="text-xs" onClick={() => showToast('Opening Quiz Management...', 'info')}>Manage Quiz</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const AdminCertificates = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-slate-900">Certificate Management</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="p-8 text-center space-y-4 border-2 border-dashed border-slate-200 bg-slate-50/50">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-slate-300">
          <ICONS.Plus className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-900">New Template</h3>
        <p className="text-xs text-slate-500">Design a new certificate template for your courses.</p>
        <Button variant="outline" className="w-full" onClick={() => showToast('Opening Certificate Designer...', 'info')}>Create Template</Button>
      </Card>
      {[1, 2].map((i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="aspect-[1.4/1] bg-slate-100 rounded-xl flex items-center justify-center relative group overflow-hidden">
            <ICONS.Award className="w-12 h-12 text-slate-300" />
            <div className="absolute inset-0 bg-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="primary" onClick={() => showToast(`Previewing Template v${i}`, 'info')}>Preview</Button>
            </div>
          </div>
          <h3 className="font-bold text-slate-900">Professional Certificate v{i}</h3>
          <p className="text-xs text-slate-500">Used in 124 Courses</p>
          <Button variant="outline" className="w-full" onClick={() => showToast(`Editing Template v${i}`, 'info')}>Edit Template</Button>
        </Card>
      ))}
    </div>
  </div>
);

const AdminPayments = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => showToast('Exporting payment data to CSV...', 'info')}><ICONS.Upload className="w-4 h-4 rotate-180" /> Export CSV</Button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-emerald-600 text-white">
        <p className="text-xs font-bold uppercase opacity-80">Total Revenue</p>
        <p className="text-3xl font-bold mt-1">₹45,20,000</p>
        <p className="text-xs mt-4 opacity-80">+12% from last month</p>
      </Card>
      <Card className="p-6 bg-indigo-600 text-white">
        <p className="text-xs font-bold uppercase opacity-80">Pending Payouts</p>
        <p className="text-3xl font-bold mt-1">₹8,40,000</p>
        <p className="text-xs mt-4 opacity-80">14 Instructors waiting</p>
      </Card>
      <Card className="p-6 bg-slate-900 text-white">
        <p className="text-xs font-bold uppercase opacity-80">Refunds (MTD)</p>
        <p className="text-3xl font-bold mt-1">₹12,500</p>
        <p className="text-xs mt-4 opacity-80">0.2% of total revenue</p>
      </Card>
    </div>
    <Card className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Student</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Method</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-mono text-slate-500">#TRX-9283{i}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">Rahul Kumar</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">₹4,999</td>
              <td className="px-6 py-4 text-sm text-slate-500">UPI / GPay</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">Success</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const AdminSettings = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card className="p-8 space-y-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <ICONS.Settings className="w-5 h-5 text-indigo-600" /> General Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Site Name</label>
              <input type="text" defaultValue="EduStream Pro" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Support Email</label>
              <input type="email" defaultValue="support@edustream.pro" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Maintenance Mode</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
              </div>
              <span className="text-sm text-slate-600">Off</span>
            </div>
          </div>
          <Button variant="primary" onClick={() => showToast('System settings saved successfully!', 'success')}>Save Changes</Button>
        </Card>

        <Card className="p-8 space-y-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <ICONS.ShieldCheck className="w-5 h-5 text-emerald-600" /> Security Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Add an extra layer of security to admin accounts.</p>
              </div>
              <Button variant="outline" className="text-xs">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-900">IP Whitelisting</p>
                <p className="text-xs text-slate-500">Restrict admin access to specific IP addresses.</p>
              </div>
              <Button variant="outline" className="text-xs">Configure</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Server Status</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div> Online</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Database</span>
              <span className="text-emerald-600 font-bold">Healthy</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Storage</span>
              <span className="text-slate-900 font-bold">42% Used</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-xs"><ICONS.BarChart className="w-4 h-4" /> Clear Cache</Button>
            <Button variant="outline" className="w-full justify-start text-xs"><ICONS.Users className="w-4 h-4" /> Force Logout All</Button>
            <Button variant="outline" className="w-full justify-start text-xs text-red-600 border-red-100 hover:bg-red-50"><ICONS.Settings className="w-4 h-4" /> Reset System</Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const AboutUs = () => (
  <div className="max-w-4xl mx-auto space-y-12 py-10">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-slate-900">Empowering Learners Worldwide</h1>
      <p className="text-xl text-slate-500">We believe that education should be accessible, flexible, and high-quality for everyone.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <img src="https://picsum.photos/seed/about/800/600" className="rounded-2xl shadow-xl" alt="About" referrerPolicy="no-referrer" />
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
        <p className="text-slate-600 leading-relaxed">EduStream Pro was founded in 2024 with a simple goal: to bridge the gap between industry requirements and academic learning. We partner with top experts to bring you courses that are practical, up-to-date, and engaging.</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-indigo-600">500+</p>
            <p className="text-sm text-slate-500 font-medium">Expert Instructors</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-indigo-600">100k+</p>
            <p className="text-sm text-slate-500 font-medium">Active Students</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InstructorProfile = ({ setView, teacherId, showToast }: { setView: (v: View) => void; teacherId: string | null; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => {
  const teacher = MOCK_TEACHERS.find(t => t.id === teacherId) || MOCK_TEACHERS[0];
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('instructor-dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ICONS.ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 text-center space-y-4">
          <img src={teacher.image} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-slate-50" alt="Profile" referrerPolicy="no-referrer" />
          <div>
            <h3 className="font-bold text-lg text-slate-900">{teacher.name}</h3>
            <p className="text-sm text-slate-500">Instructor ID: {teacher.id}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => showToast('Opening photo upload dialog...', 'info')}>Change Photo</Button>
        </Card>
        <Card className="md:col-span-2 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <input type="text" defaultValue={teacher.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <input type="email" defaultValue={teacher.email} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Biography</label>
            <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" defaultValue="Passionate educator with 10+ years of experience in full-stack development. I love teaching React and Node.js." />
          </div>
          <Button variant="primary" onClick={() => showToast('Instructor profile updated successfully!', 'success')}>Update Profile</Button>
        </Card>
      </div>
    </div>
  );
};

const InstructorMessages = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
      <Card className="p-0 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <input type="text" placeholder="Search conversations..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${i === 0 ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-sm truncate">Rahul Verma</h4>
                    <span className="text-[10px] text-slate-400">10:45 AM</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">Sir, I have a doubt in Module 4...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="lg:col-span-2 p-0 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Rahul Verma</h4>
              <span className="text-[10px] text-emerald-500 font-bold">Online</span>
            </div>
          </div>
          <Button variant="ghost" className="p-2" onClick={() => showToast('Conversation settings', 'info')}><ICONS.Settings className="w-4 h-4" /></Button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] text-sm text-slate-700">
              Hello Sir, I'm stuck on the Higher Order Components lesson. Could you please help?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] text-sm text-white">
              Sure Rahul! Let's schedule a quick call tomorrow at 10 AM.
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input type="text" placeholder="Type your message..." className="flex-1 px-4 py-2 rounded-full border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
            <Button variant="primary" className="rounded-full w-10 h-10 p-0 flex items-center justify-center" onClick={() => showToast('Message sent!', 'success')}>
              <ICONS.ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const InstructorReviews = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-slate-900">Course Reviews</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((_, i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100"></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Sneha Kapur</h4>
                <p className="text-[10px] text-slate-400">2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <ICONS.Star className="w-3 h-3 fill-current" />
              <ICONS.Star className="w-3 h-3 fill-current" />
              <ICONS.Star className="w-3 h-3 fill-current" />
              <ICONS.Star className="w-3 h-3 fill-current" />
              <ICONS.Star className="w-3 h-3 fill-current" />
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            "This course is absolutely amazing! The instructor explains complex concepts in a very simple way. Highly recommended for anyone wanting to master React."
          </p>
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Course: Advanced React Patterns</span>
            <Button variant="ghost" className="text-xs text-indigo-600" onClick={() => showToast('Opening reply dialog...', 'info')}>Reply</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const StudentProfile = ({ setView }: { setView: (v: View) => void }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tabs = ['Overview', 'My Courses', 'Quiz Results', 'Certificates', 'Account Settings'];

  const handlePhotoEdit = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-500/5">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[2.5rem] bg-indigo-100 flex items-center justify-center text-indigo-600 text-5xl font-black overflow-hidden border-4 border-white shadow-2xl shadow-indigo-200">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              "JD"
            )}
          </div>
          <button 
            onClick={handlePhotoEdit}
            className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all"
          >
            <ICONS.Upload className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg" 
            className="hidden" 
          />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">John Doe</h1>
            <p className="text-slate-500 font-bold">Computer Science Student • Bangalore, India</p>
          </div>
          <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
            Passionate learner currently mastering Full Stack Web Development and UI/UX Design. 
            Aiming to build industry-ready skills and contribute to innovative tech projects.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Button variant="primary" className="px-8 rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={() => setView('student-settings')}>Edit Profile</Button>
            <Button variant="outline" className="px-8 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200">View Public Profile</Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
                activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'Overview' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="p-8 rounded-3xl border-slate-100/50 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ICONS.BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">12</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Courses Enrolled</p>
                    </div>
                  </Card>
                  <Card className="p-8 rounded-3xl border-slate-100/50 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ICONS.CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">5</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Courses Completed</p>
                    </div>
                  </Card>
                </div>

                <section className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { text: 'Completed "Module 4: React Hooks" in React Masterclass', time: '2 hours ago', icon: ICONS.CheckCircle, color: 'text-emerald-500' },
                      { text: 'Earned a certificate in "UI/UX Design Fundamentals"', time: '1 day ago', icon: ICONS.Award, color: 'text-amber-500' },
                      { text: 'Started a new course: "Python for Data Science"', time: '3 days ago', icon: ICONS.Play, color: 'text-indigo-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                        <div className={`mt-1 ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{item.text}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
            
            {activeTab === 'My Courses' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {MOCK_COURSES.slice(0, 4).map(course => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    onDetails={() => setView('course-learning')}
                    onEnroll={() => {}}
                    showProgress={true}
                  />
                ))}
              </div>
            )}

            {activeTab === 'Quiz Results' && (
              <Card className="overflow-hidden rounded-3xl border-slate-100/50">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { course: 'React Masterclass', score: '18/20', status: 'Pass', date: 'Feb 28, 2026' },
                      { course: 'UI/UX Design Bootcamp', score: '15/20', status: 'Pass', date: 'Feb 25, 2026' },
                      { course: 'Python Programming', score: '12/20', status: 'Fail', date: 'Feb 20, 2026' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.course}</td>
                        <td className="px-6 py-4 text-sm font-black text-indigo-600">{row.score}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            row.status === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-400">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card className="p-8 rounded-3xl border-slate-100/50 space-y-6">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Personal Info</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold text-slate-700">john.doe@example.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold text-slate-700">+91 98765 43210</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-bold text-slate-700">January 2026</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 rounded-3xl border-slate-100/50 space-y-6">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'Figma', 'Python', 'UI Design', 'SEO'].map(skill => (
                  <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentSettings = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showToast('New passwords do not match', 'error');
      return;
    }
    showToast('Password changed successfully', 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    showToast('Account deleted successfully', 'success');
    window.location.href = '/';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
      <div className="space-y-6">
        <Card className="p-8 space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ICONS.ShieldCheck className="w-5 h-5 text-indigo-600" /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
              <input 
                type="password" 
                required
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
              <input 
                type="password" 
                required
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Confirm New Password</label>
              <input 
                type="password" 
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">Save Changes</Button>
          </form>
        </Card>

        <Card className="p-8 space-y-6 border-red-100 bg-red-50/30">
          <div className="flex items-center gap-3 text-red-600">
            <ICONS.X className="w-6 h-6" />
            <h3 className="font-bold">Delete Account</h3>
          </div>
          <p className="text-sm text-slate-600">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="danger" className="w-full" onClick={() => setShowDeleteConfirm(true)}>Delete Account</Button>
        </Card>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <ICONS.HelpCircle className="w-10 h-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Delete Account?</h3>
                <p className="text-slate-500 font-medium">Are you sure you want to delete your account? This action cannot be undone.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="danger" className="flex-1" onClick={handleDeleteAccount}>Confirm Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseDetails = ({ setView, courseId, courses }: { setView: (v: View) => void; courseId: string | null; courses: Course[] }) => {
  const course = courses.find(c => c.id === courseId) || courses[0];
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setView('browse-courses')} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold uppercase tracking-widest text-xs group"
      >
        <ICONS.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to browse
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              {course.category}
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter">{course.title}</h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructor</div>
                  <div className="text-sm font-black text-slate-900">{course.instructor}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-100 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <ICONS.Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</div>
                  <div className="text-sm font-black text-slate-900">{course.rating} <span className="text-slate-400 font-medium ml-1">(1.2k reviews)</span></div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-100 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ICONS.Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students</div>
                  <div className="text-sm font-black text-slate-900">{course.students.toLocaleString()} enrolled</div>
                </div>
              </div>
            </div>
          </motion.div>

          <Card className="p-10 border-slate-100/50 bg-slate-50/30 rounded-3xl">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'Build fully functional web applications',
                'Master React Hooks and Context API',
                'Design robust RESTful APIs with Node.js',
                'Implement secure authentication systems',
                'Deploy applications to cloud platforms',
                'Work with NoSQL databases like MongoDB'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                    <ICONS.CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-slate-600 font-medium leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Course Content</h2>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">4 Sections • 40 Lessons</div>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Introduction to Web Development', lessons: 5, time: '45m' },
                { title: 'React Fundamentals', lessons: 12, time: '3h 20m' },
                { title: 'State Management with Redux', lessons: 8, time: '2h 15m' },
                { title: 'Backend with Node.js', lessons: 15, time: '5h 10m' }
              ].map((section, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="p-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">{i+1}</div>
                    <div>
                      <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{section.title}</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">{section.lessons} lessons • {section.time}</p>
                    </div>
                  </div>
                  <ICONS.ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="sticky top-24 overflow-hidden rounded-[2.5rem] border-slate-100 shadow-2xl shadow-indigo-500/10">
            <div className="relative aspect-video group cursor-pointer">
              <img src={course.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-all">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-125 transition-transform">
                  <ICONS.Play className="w-8 h-8 fill-current" />
                </div>
              </div>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{course.price.toLocaleString()}</span>
                  <span className="text-slate-400 line-through font-bold text-lg">₹9,999</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  60% OFF • Limited Time
                </div>
              </div>
              
              <div className="space-y-4">
                <Button variant="primary" className="w-full py-5 text-xl shadow-xl shadow-indigo-500/20" onClick={() => setView('payment-options')}>
                  Enroll Now
                </Button>
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">30-Day Money-Back Guarantee</p>
              </div>
              
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">This course includes:</p>
                <div className="space-y-4">
                  {[
                    { icon: ICONS.Clock, text: '45 hours on-demand video' },
                    { icon: ICONS.FileText, text: '12 downloadable resources' },
                    { icon: ICONS.ShieldCheck, text: 'Full lifetime access' },
                    { icon: ICONS.Award, text: 'Certificate of completion' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <item.icon className="w-4 h-4" />
                      </div>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PaymentOptions = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Select Payment Method</h1>
        <p className="text-slate-500 mt-2">Secure checkout for your learning journey</p>
      </div>

      <Card className="p-6 flex items-center gap-6 bg-indigo-50 border-indigo-100">
        <img src={MOCK_COURSES[0].image} className="w-24 h-16 rounded-lg object-cover" alt="Course" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">{MOCK_COURSES[0].title}</h3>
          <p className="text-sm text-slate-500">Instructor: {MOCK_COURSES[0].instructor}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-indigo-600">₹{MOCK_COURSES[0].price.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Incl. all taxes</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => setView('payment-upi')}
          className="p-6 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100">
              <ICONS.QrCode className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-slate-900">UPI Payment</h4>
              <p className="text-sm text-slate-500">Google Pay, PhonePe, Paytm, etc.</p>
            </div>
          </div>
          <ICONS.ChevronRight className="w-5 h-5 text-slate-300" />
        </button>

        <button 
          onClick={() => setView('payment-card')}
          className="p-6 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100">
              <ICONS.CreditCard className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-slate-900">Credit / Debit Card</h4>
              <p className="text-sm text-slate-500">Visa, Mastercard, RuPay, etc.</p>
            </div>
          </div>
          <ICONS.ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </div>
  );
};

const UPIPayment = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="max-w-md mx-auto space-y-8 text-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan QR to Pay</h1>
        <p className="text-slate-500">Scan the QR code using any UPI app</p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
          <ICONS.QrCode className="w-48 h-48 text-slate-900" />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-slate-500">UPI ID</p>
          <p className="text-lg font-bold text-indigo-600">edustream.pay@upi</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-500">Amount to Pay</p>
          <p className="text-3xl font-bold text-slate-900">₹{MOCK_COURSES[0].price.toLocaleString()}</p>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
          <ICONS.ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure encrypted payment
        </div>
      </Card>

      <div className="space-y-4">
        <Button variant="primary" className="w-full py-4" onClick={() => setView('payment-success')}>
          I've Completed Payment
        </Button>
        <button onClick={() => setView('payment-options')} className="text-sm text-slate-500 hover:text-indigo-600">
          Cancel and go back
        </button>
      </div>
    </div>
  );
};

const CardPayment = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Card Details</h1>
        <p className="text-slate-500">Enter your card information securely</p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Card Number</label>
            <div className="relative">
              <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              <ICONS.CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cardholder Name</label>
            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Expiry Date</label>
              <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CVV</label>
              <input type="password" placeholder="•••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-500">Total Amount</span>
            <span className="text-2xl font-bold text-slate-900">₹{MOCK_COURSES[0].price.toLocaleString()}</span>
          </div>
          <Button variant="primary" className="w-full py-4" onClick={() => setView('payment-success')}>
            Pay Securely
          </Button>
        </div>
      </Card>

      <button onClick={() => setView('payment-options')} className="w-full text-center text-sm text-slate-500 hover:text-indigo-600">
        Cancel and go back
      </button>
    </div>
  );
};

const PaymentSuccess = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="max-w-md mx-auto text-center space-y-8 py-12">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto"
      >
        <ICONS.CheckCircle className="w-12 h-12" />
      </motion.div>
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Payment Successful!</h1>
        <p className="text-slate-500 mt-2">Your enrollment is confirmed. Welcome to the course!</p>
      </div>

      <Card className="p-6 bg-slate-50 border-slate-100">
        <div className="text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono font-bold">#TXN-82930412</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Course</span>
            <span className="font-bold text-right">{MOCK_COURSES[0].title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-bold">₹{MOCK_COURSES[0].price.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Button variant="primary" className="w-full py-4" onClick={() => setView('my-courses')}>
          Go to My Learning
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => setView('student-dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

const CertificatesPage = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
        <p className="text-slate-500">Your achievements and professional certifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, i) => (
          <Card key={i} className="group overflow-hidden">
            <div className="aspect-[1.414/1] bg-slate-100 p-4 flex items-center justify-center relative">
              <div className="w-full h-full border-4 border-double border-slate-300 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold mb-2">E</div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Certificate of Completion</p>
                <p className="text-[10px] font-serif italic my-2">This is to certify that</p>
                <p className="text-xs font-bold text-slate-800 border-b border-slate-300 pb-1 mb-2">Student Name</p>
                <p className="text-[8px] text-slate-500">has successfully completed the course</p>
                <p className="text-[10px] font-bold text-indigo-600 leading-tight mt-1">{MOCK_COURSES[i].title}</p>
              </div>
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="primary" className="scale-90" onClick={() => showToast('Downloading certificate PDF...', 'info')}><ICONS.Upload className="w-4 h-4" /> Download PDF</Button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{MOCK_COURSES[i].title}</h3>
              <p className="text-xs text-slate-500 mt-1">Issued on: March 15, 2026</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const InstructorDashboard = ({ 
  setView, 
  courses,
  teacherId,
  onSelectCourse,
  showToast
}: { 
  setView: (v: View) => void; 
  courses: Course[];
  teacherId: string | null;
  onSelectCourse: (id: string) => void;
  showToast: (m: string, t?: 'success' | 'error' | 'info') => void;
}) => {
  const teacher = MOCK_TEACHERS.find(t => t.id === teacherId) || MOCK_TEACHERS[0];
  const teacherCourses = courses.filter(c => c.instructor === teacher.name || c.instructor === 'Instructor');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {teacher.name}</h1>
          <p className="text-slate-500">Manage your courses and student progress</p>
        </div>
        <Button variant="primary" onClick={() => setView('create-course')}><ICONS.Plus className="w-4 h-4" /> Create New Course</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-slate-500 font-medium">Total Courses</p>
          <p className="text-3xl font-bold text-slate-900">{teacherCourses.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500 font-medium">Total Students</p>
          <p className="text-3xl font-bold text-slate-900">2,450</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <ICONS.BarChart className="w-3 h-3" /> +12% from last month
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500 font-medium">Course Rating</p>
          <p className="text-3xl font-bold text-slate-900">4.8/5.0</p>
          <p className="text-xs text-slate-400 mt-2">Based on 1,240 reviews</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500 font-medium">Total Earnings</p>
          <p className="text-3xl font-bold text-slate-900">₹4.2L</p>
          <p className="text-xs text-slate-400 mt-2">Next payout: April 1st</p>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-slate-900">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teacherCourses.map((course) => (
          <Card key={course.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={course.image} className="w-20 h-20 rounded-xl object-cover" alt="Course" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-bold text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-500">{course.students} students enrolled</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {course.status === 'Pending' && <Badge color="amber">🟡 Pending Approval</Badge>}
                {course.status === 'Approved' && <Badge color="emerald">🟢 Approved</Badge>}
                {course.status === 'Rejected' && (
                  <div className="text-right">
                    <Badge color="amber">🔴 Rejected</Badge>
                    <p className="text-[10px] text-red-500 mt-1 italic">Note: Content needs more depth.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-xs" onClick={() => {
                onSelectCourse(course.id);
                setView('edit-course-content');
              }}>Edit Content</Button>
              <Button variant="outline" className="flex-1 text-xs" onClick={() => {
                onSelectCourse(course.id);
                setView('course-analytics');
              }}>View Analytics</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CreateCourse = ({ 
  setView, 
  addCourse,
  showToast
}: { 
  setView: (v: View) => void; 
  addCourse: (c: Partial<Course>) => void;
  showToast: (m: string, t?: 'success' | 'error' | 'info') => void
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    description: '',
    price: '',
    level: 'Beginner',
    language: 'English'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      level: formData.level as any,
      instructor: 'Instructor',
      status: 'Pending',
      image: 'https://picsum.photos/seed/newcourse/800/600',
      students: 0,
      rating: 0,
      duration: '0 Hours'
    });
    setView('submission-status');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('instructor-dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600">
          <ICONS.ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Advanced React Patterns" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Development</option>
                <option>Design</option>
                <option>Business</option>
                <option>Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Level</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.level}
                onChange={e => setFormData({...formData, level: e.target.value})}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                rows={4}
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what students will learn..." 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
              <input 
                type="number" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="499" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
              <input 
                type="text" 
                value={formData.language}
                onChange={e => setFormData({...formData, language: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Course Thumbnail</label>
              <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <ICONS.Upload className="w-8 h-8 mb-2" />
                <p className="text-xs">Click to upload image</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Promo Video</label>
              <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <ICONS.Upload className="w-8 h-8 mb-2" />
                <p className="text-xs">Click to upload video</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => setView('instructor-dashboard')}>Save as Draft</Button>
          <Button variant="primary" type="submit" className="px-8">Submit for Approval</Button>
        </div>
      </form>
    </div>
  );
};

const SubmissionStatus = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="max-w-md mx-auto text-center space-y-8 py-12">
      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto">
        <ICONS.Clock className="w-12 h-12" />
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Course Submitted!</h1>
        <div className="mt-4 inline-block">
          <Badge color="amber">🟡 Pending Admin Approval</Badge>
        </div>
        <p className="text-slate-500 mt-4 leading-relaxed">
          Your course has been sent to our administrators for review. This typically takes 24-48 hours. You'll receive a notification once it's approved.
        </p>
      </div>

      <div className="space-y-4">
        <Button variant="primary" className="w-full py-4" onClick={() => setView('instructor-dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

const EditCourseContent = ({ setView, courseId, courses }: { setView: (v: View) => void; courseId: string | null; courses: Course[] }) => {
  const course = courses.find(c => c.id === courseId) || courses[0];
  const [activeTab, setActiveTab] = useState('curriculum');
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('instructor-dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600">
          <ICONS.ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex gap-3">
          <Button variant="outline">Save Changes</Button>
          <Button variant="primary">Submit Updates</Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Editing Content</p>
        <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
      </div>

      <div className="flex border-b border-slate-200">
        {['Curriculum', 'Videos', 'Resources', 'Quizzes'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.toLowerCase() 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Course Structure</h3>
            <Button variant="outline" className="text-xs"><ICONS.Plus className="w-3 h-3" /> Add Section</Button>
          </div>

          <div className="space-y-4">
            {[1, 2].map((section) => (
              <Card key={section} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ICONS.Menu className="w-4 h-4 text-slate-300 cursor-move" />
                    <h4 className="font-bold">Section {section}: Introduction</h4>
                  </div>
                  <Button variant="ghost" className="p-1 h-auto text-slate-400"><ICONS.Settings className="w-4 h-4" /></Button>
                </div>
                <div className="pl-7 space-y-2">
                  {[1, 2, 3].map((lesson) => (
                    <div key={lesson} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <ICONS.Menu className="w-3 h-3 text-slate-300 cursor-move" />
                        <span className="text-sm font-medium">Lesson {lesson}: Getting Started</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-indigo-600"><ICONS.Settings className="w-3 h-3" /></button>
                        <button className="text-slate-400 hover:text-red-600"><ICONS.X className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-xs font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all mt-2">
                    + Add Lesson
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab !== 'curriculum' && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
            <ICONS.Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Manage {activeTab}</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Upload and organize your course {activeTab} here. Drag and drop files to get started.</p>
          <Button variant="primary" className="mt-6">Upload Files</Button>
        </Card>
      )}
    </div>
  );
};

const CourseAnalytics = ({ setView, courseId, courses }: { setView: (v: View) => void; courseId: string | null; courses: Course[] }) => {
  const course = courses.find(c => c.id === courseId) || courses[0];
  const engagementData = [
    { name: 'Mon', views: 400, completions: 240 },
    { name: 'Tue', views: 700, completions: 450 },
    { name: 'Wed', views: 450, completions: 300 },
    { name: 'Thu', views: 900, completions: 600 },
    { name: 'Fri', views: 650, completions: 400 },
    { name: 'Sat', views: 800, completions: 550 },
    { name: 'Sun', views: 550, completions: 350 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('instructor-dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600">
          <ICONS.ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Analytics: {course.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Enrollments</p>
          <p className="text-3xl font-bold text-slate-900">1,250</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Completion Rate</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">68%</p>
            <p className="text-xs text-emerald-600 mb-1">+5%</p>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Avg. Rating</p>
          <div className="flex items-center gap-1 text-3xl font-bold text-slate-900">
            4.8 <ICONS.Star className="w-5 h-5 text-amber-500 fill-current" />
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900">₹6.2L</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h3 className="font-bold text-slate-900 mb-6">Engagement Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
              <span className="text-xs text-slate-500 font-medium">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-slate-500 font-medium">Completions</span>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="font-bold text-slate-900 mb-6">Student Activity</h3>
          <div className="space-y-6">
            {[
              { user: 'Rahul K.', action: 'Completed Section 2', time: '10m ago' },
              { user: 'Sneha M.', action: 'Enrolled in course', time: '45m ago' },
              { user: 'Amit S.', action: 'Passed Quiz: React Hooks', time: '2h ago' },
              { user: 'Priya D.', action: 'Started Lesson 4', time: '5h ago' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{activity.user[0]}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{activity.user} <span className="font-normal text-slate-500">{activity.action}</span></p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminStudents = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('admin-dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ICONS.ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students Management</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Admin</span>
              <ICONS.ChevronRight className="w-3 h-3" />
              <span>Students</span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Enrolled Courses</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {student.name[0]}
                      </div>
                      <span className="font-bold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-center">{student.enrolledCourses}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" className="text-indigo-600 font-bold text-xs" onClick={() => showToast('Viewing student profile...', 'info')}>View Profile</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AdminTeachers = ({ 
  setView, 
  onSelectTeacher,
  teachers,
  onRemoveTeacher,
  showToast
}: { 
  setView: (v: View) => void; 
  onSelectTeacher: (id: string) => void;
  teachers: Teacher[];
  onRemoveTeacher: (id: string) => void;
  showToast: (m: string, t?: 'success' | 'error' | 'info') => void
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('admin-dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ICONS.ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Teachers Management</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Admin</span>
              <ICONS.ChevronRight className="w-3 h-3" />
              <span>Teachers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="p-6 hover:shadow-md transition-shadow relative group">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTeacher(teacher.id);
              }}
              className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
              title="Remove Teacher"
            >
              <ICONS.X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <img src={teacher.image} alt={teacher.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-lg text-slate-900">{teacher.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">ID: {teacher.id}</p>
              </div>
              <div className="w-full pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-900 font-medium">{teacher.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Assigned Courses</span>
                  <span className="text-indigo-600 font-bold">{teacher.assignedCourses}</span>
                </div>
              </div>
      <div className="flex gap-2 w-full">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            onSelectTeacher(teacher.id);
            setView('admin-teacher-profile');
          }}
        >
          View Profile
        </Button>
        <Button 
          variant="danger" 
          className="flex-1"
          onClick={() => onRemoveTeacher(teacher.id)}
        >
          <ICONS.X className="w-4 h-4" />
          Remove Teacher
        </Button>
      </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminTeacherProfile = ({ setView, teacherId, showToast }: { setView: (v: View) => void; teacherId: string | null; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => {
  const teacher = MOCK_TEACHERS.find(t => t.id === teacherId) || MOCK_TEACHERS[0];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('admin-teachers')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ICONS.ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Teacher Profile</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Admin</span>
              <ICONS.ChevronRight className="w-3 h-3" />
              <span>Teachers</span>
              <ICONS.ChevronRight className="w-3 h-3" />
              <span>{teacher.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input type="text" defaultValue={teacher.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" defaultValue={teacher.email} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Assigned Courses</h3>
            <div className="space-y-4">
              {MOCK_COURSES.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <img src={course.image} alt={course.title} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-slate-900">{course.title}</p>
                      <p className="text-xs text-slate-500">{course.category}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-red-600 hover:bg-red-50 p-2" onClick={() => showToast('Unassigning course from teacher...', 'info')}><ICONS.X className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-200" onClick={() => showToast('Opening course assignment dialog...', 'info')}>
                <ICONS.Plus className="w-4 h-4" /> Assign New Course
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Credentials</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Teacher ID</label>
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 font-mono text-sm">
                  {teacher.id}
                </div>
                <p className="text-[10px] text-slate-400 italic">Read-only system identifier</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    defaultValue="password123" 
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none pr-10" 
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <ICONS.EyeOff className="w-4 h-4" /> : <ICONS.Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs" onClick={() => showToast('Sending password reset link to teacher...', 'info')}>Reset Password</Button>
            </div>
          </Card>

          <div className="space-y-3">
            <Button variant="primary" className="w-full py-3" onClick={() => { showToast('Teacher profile updated successfully!', 'success'); setView('admin-teachers'); }}>Save Changes</Button>
            <Button variant="ghost" className="w-full text-slate-500" onClick={() => setView('admin-teachers')}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCourses = ({ setView, courses, showToast }: { setView: (v: View) => void; courses: Course[]; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('admin-dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ICONS.ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Courses Management</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Admin</span>
              <ICONS.ChevronRight className="w-3 h-3" />
              <span>Courses</span>
            </div>
          </div>
        </div>
        <Button variant="primary" onClick={() => setView('admin-add-course')}>
          <ICONS.Plus className="w-4 h-4" /> Add New Course
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Teachers</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={course.image} alt={course.title} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <span className="font-bold text-slate-900 line-clamp-1">{course.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{course.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center -space-x-2">
                      {MOCK_TEACHERS.slice(0, 3).map((t, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden" title={t.name}>
                          <img src={t.image} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      <button 
                        className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" 
                        title="Assign Teacher"
                        onClick={() => showToast('Opening teacher assignment dialog...', 'info')}
                      >
                        <ICONS.Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      course.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                      course.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {course.status || 'Approved'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Button variant="ghost" className="text-indigo-600 font-bold text-xs" onClick={() => setView('admin-add-course')}>Edit Course</Button>
                    <Button variant="ghost" className="text-red-600 font-bold text-xs" onClick={() => window.confirm('Are you sure you want to delete this course?')}>Delete Course</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AdminAddCourse = ({ setView, showToast }: { setView: (v: View) => void; showToast: (m: string, t?: 'success' | 'error' | 'info') => void }) => {
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);

  const toggleTeacher = (teacher: Teacher) => {
    if (selectedTeachers.find(t => t.id === teacher.id)) {
      setSelectedTeachers(selectedTeachers.filter(t => t.id !== teacher.id));
    } else if (selectedTeachers.length < 5) {
      setSelectedTeachers([...selectedTeachers, teacher]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('admin-courses')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ICONS.ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Course</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Admin</span>
              <ICONS.ChevronRight className="w-3 h-3" />
              <span>Courses</span>
              <ICONS.ChevronRight className="w-3 h-3" />
              <span>New Course</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Course Title</label>
              <input type="text" placeholder="e.g. Advanced React Patterns" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option>Development</option>
                  <option>Design</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Price (₹)</label>
                <input type="number" placeholder="4999" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Course Description</label>
              <textarea rows={4} placeholder="Describe what students will learn..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Level</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Language</label>
                <input type="text" placeholder="English" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Teacher Assignment</h3>
              <span className="text-xs text-slate-500">{selectedTeachers.length}/5 Assigned</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedTeachers.map(t => (
                <div key={t.id} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                  <img src={t.image} alt={t.name} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                  {t.name}
                  <button onClick={() => toggleTeacher(t)} className="hover:text-indigo-900"><ICONS.X className="w-3 h-3" /></button>
                </div>
              ))}
              {selectedTeachers.length === 0 && <p className="text-sm text-slate-400 italic">No teachers assigned yet.</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Select Teachers (Max 5)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
                {MOCK_TEACHERS.map(teacher => {
                  const isSelected = selectedTeachers.find(t => t.id === teacher.id);
                  return (
                    <button
                      key={teacher.id}
                      onClick={() => toggleTeacher(teacher)}
                      disabled={!isSelected && selectedTeachers.length >= 5}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                      } disabled:opacity-50`}
                    >
                      <img src={teacher.image} alt={teacher.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{teacher.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{teacher.email}</p>
                      </div>
                      {isSelected && <ICONS.CheckCircle className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Course Media</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Course Thumbnail</label>
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer group"
                  onClick={() => showToast('Opening file browser for thumbnail upload...', 'info')}
                >
                  <ICONS.Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500" />
                  <p className="text-xs text-slate-500">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button variant="primary" className="w-full py-4 text-lg" onClick={() => { showToast('Course published successfully!', 'success'); setView('admin-courses'); }}>Publish Course</Button>
            <Button variant="outline" className="w-full py-4 text-lg" onClick={() => { showToast('Course saved as draft.', 'info'); setView('admin-courses'); }}>Save as Draft</Button>
            <Button variant="ghost" className="w-full text-slate-500" onClick={() => setView('admin-courses')}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminTeacherApplications = ({ 
  setView, 
  applications, 
  onAppoint, 
  onReject 
}: { 
  setView: (v: View) => void; 
  applications: TeacherApplication[]; 
  onAppoint: (id: string) => void; 
  onReject: (id: string) => void 
}) => {
  const pendingApps = applications.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('admin-dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600">
          <ICONS.ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Teacher Applications</h1>
      </div>

      {pendingApps.length === 0 ? (
        <Card className="p-12 text-center">
          <ICONS.Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No pending applications</h3>
          <p className="text-slate-500 mt-2">All teacher applications have been processed.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingApps.map((app) => (
            <Card key={app.id} className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                      <p className="text-slate-500">{app.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expertise</p>
                      <p className="font-bold text-slate-700">{app.expertise}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                      <p className="font-bold text-slate-700">{app.experience} Years</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bio</p>
                    <p className="text-slate-600 leading-relaxed">{app.bio}</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-3">
                  <Button variant="secondary" className="px-8" onClick={() => onAppoint(app.id)}>Appoint</Button>
                  <Button variant="danger" className="px-8" onClick={() => onReject(app.id)}>Reject</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminCourseApprovals = ({ 
  setView, 
  courses, 
  updateStatus 
}: { 
  setView: (v: View) => void; 
  courses: Course[]; 
  updateStatus: (id: string, status: CourseStatus) => void 
}) => {
  const pendingCourses = courses.filter(c => c.status === 'Pending');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('admin-dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600">
          <ICONS.ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Course Approvals</h1>
      </div>

      {pendingCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <ICONS.CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold">All caught up!</h3>
          <p className="text-slate-500 mt-2">No pending course approvals at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingCourses.map((course) => (
            <Card key={course.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img src={course.image} className="w-24 h-16 rounded-lg object-cover" alt="Course" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-bold text-slate-900">{course.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-indigo-600">{course.instructor}</span>
                    <span>•</span>
                    <span>Submitted: March 3, 2026</span>
                    <span>•</span>
                    <span>{course.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="danger" className="px-6" onClick={() => updateStatus(course.id, 'Rejected')}>Reject</Button>
                <Button variant="secondary" className="px-6" onClick={() => updateStatus(course.id, 'Approved')}>Approve</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const StaticPage = ({ title, content }: { title: string; content: string }) => (
  <div className="max-w-4xl mx-auto space-y-8 py-8">
    <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
    <div className="prose prose-slate max-w-none">
      {content.split('\n').map((p, i) => (
        <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>
      ))}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [view, setView] = useState<View>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>(MOCK_COURSES.map((c) => ({ 
    ...c, 
    status: 'Approved',
    progress: undefined
  })));
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [teacherApplications, setTeacherApplications] = useState<TeacherApplication[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [intendedView, setIntendedView] = useState<View | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; questions: QuizQuestion[]; answers: any[] } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const addTeacherApplication = (appData: Omit<TeacherApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: TeacherApplication = {
      ...appData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setTeacherApplications([newApp, ...teacherApplications]);
  };

  const appointTeacher = (appId: string) => {
    const app = teacherApplications.find(a => a.id === appId);
    if (app) {
      const newTeacher: Teacher = {
        id: 'T' + Math.floor(Math.random() * 1000),
        name: app.name,
        email: app.email,
        assignedCourses: 0,
        image: `https://picsum.photos/seed/${app.id}/200/200`
      };
      setTeachers([newTeacher, ...teachers]);
      setTeacherApplications(teacherApplications.map(a => a.id === appId ? { ...a, status: 'Approved' } : a));
      showToast(`${app.name} has been appointed as an instructor!`, 'success');
    }
  };

  const rejectApplication = (appId: string) => {
    setTeacherApplications(teacherApplications.map(a => a.id === appId ? { ...a, status: 'Rejected' } : a));
    showToast('Application rejected', 'info');
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleProtectedNavigation = (targetView: View) => {
    const protectedViews: View[] = [
      'student-dashboard', 'my-courses', 'completed-courses', 'certificates', 
      'instructor-dashboard', 'create-course', 'submission-status', 'edit-course-content', 'course-analytics',
      'admin-dashboard', 'admin-students', 'admin-teachers', 'admin-courses', 'admin-course-approvals', 'admin-teacher-profile', 'admin-add-course',
      'payment-options', 'payment-upi', 'payment-card', 'payment-success'
    ];
    if (protectedViews.includes(targetView) && !role) {
      setLoginMessage('🔒 Please log in to access your dashboard.');
      setIntendedView(targetView);
      setView('login');
    } else {
      setView(targetView);
    }
  };

  const handleLogin = (userRole: UserRole, userId?: string) => {
    setRole(userRole);
    if (userId) setLoggedInUserId(userId);
    setLoginMessage(null);

    // Pre-populate progress for students to show "already completed courses"
    if (userRole === 'student') {
      setAllCourses(prev => prev.map((c, i) => {
        if (i === 0) return { ...c, progress: 100 };
        if (i === 1) return { ...c, progress: 65 };
        if (i === 2) return { ...c, progress: 30 };
        return c;
      }));
    }

    if (intendedView) {
      setView(intendedView);
      setIntendedView(null);
    } else {
      if (userRole === 'admin') setView('admin-dashboard');
      else if (userRole === 'instructor') setView('instructor-dashboard');
      else setView('student-dashboard');
    }
  };

  const addCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title: courseData.title || 'Untitled',
      instructor: courseData.instructor || 'Teacher',
      price: courseData.price || 0,
      duration: courseData.duration || '0 Hours',
      level: courseData.level || 'Beginner',
      rating: courseData.rating || 0,
      students: courseData.students || 0,
      image: courseData.image || '',
      category: courseData.category || 'General',
      description: courseData.description || '',
      status: courseData.status || 'Pending'
    };
    setAllCourses([newCourse, ...allCourses]);
  };

  const updateCourseStatus = (id: string, status: CourseStatus) => {
    setAllCourses(allCourses.map(c => c.id === id ? { ...c, status } : c));
  };

  const removeTeacher = (id: string) => {
    if (window.confirm('Are you sure you want to remove this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== id));
      showToast('Teacher removed successfully', 'success');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home': return <HomePage setView={handleProtectedNavigation} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} courses={allCourses} role={role} onSelectCourse={setSelectedCourseId} />;
      case 'login': return <LoginPage onLogin={handleLogin} setView={handleProtectedNavigation} message={loginMessage} />;
      case 'signup': return <SignupPage onLogin={handleLogin} setView={handleProtectedNavigation} />;
      case 'admin-dashboard': return <AdminDashboard setView={handleProtectedNavigation} showToast={showToast} applicationCount={teacherApplications.filter(a => a.status === 'Pending').length} />;
      case 'admin-students': return <AdminStudents setView={handleProtectedNavigation} showToast={showToast} />;
      case 'admin-teachers': return <AdminTeachers setView={handleProtectedNavigation} onSelectTeacher={setSelectedTeacherId} teachers={teachers} onRemoveTeacher={removeTeacher} showToast={showToast} />;
      case 'admin-teacher-profile': return <AdminTeacherProfile setView={handleProtectedNavigation} teacherId={selectedTeacherId} showToast={showToast} />;
      case 'admin-courses': return <AdminCourses setView={handleProtectedNavigation} courses={allCourses} showToast={showToast} />;
      case 'admin-add-course': return <AdminAddCourse setView={handleProtectedNavigation} showToast={showToast} />;
      case 'admin-course-approvals': return <AdminCourseApprovals setView={handleProtectedNavigation} courses={allCourses} updateStatus={updateCourseStatus} />;
      case 'admin-categories': return <AdminCategories setView={handleProtectedNavigation} showToast={showToast} />;
      case 'admin-enrollments': return <AdminEnrollments setView={handleProtectedNavigation} showToast={showToast} />;
      case 'admin-quizzes': return <AdminQuizzes setView={handleProtectedNavigation} showToast={showToast} />;
      case 'admin-certificates': return <AdminCertificates setView={handleProtectedNavigation} showToast={showToast} />;
      case 'admin-payments': return <AdminPayments setView={handleProtectedNavigation} showToast={showToast} />;
      case 'admin-reports': return <AdminReports setView={handleProtectedNavigation} />;
      case 'admin-settings': return <AdminSettings setView={handleProtectedNavigation} showToast={showToast} />;
      case 'student-dashboard': return <StudentDashboard setView={handleProtectedNavigation} courses={allCourses} onSelectCourse={setSelectedCourseId} />;
      case 'student-profile': return <StudentProfile setView={handleProtectedNavigation} />;
      case 'student-settings': return <StudentSettings setView={handleProtectedNavigation} showToast={showToast} />;
      case 'student-quizzes': return <StudentQuizzesPage setView={handleProtectedNavigation} showToast={showToast} />;
      case 'student-quiz-session': return (
        <QuizSession 
          courseId={selectedCourseId} 
          onCancel={() => setView('student-quizzes')}
          onComplete={(score, total, questions, answers) => {
            setQuizResult({ score, total, questions, answers });
            setView('student-quiz-result');
          }}
        />
      );
      case 'student-quiz-result': return (
        <QuizResult 
          score={quizResult?.score || 0} 
          total={quizResult?.total || 20} 
          questions={quizResult?.questions || []}
          answers={quizResult?.answers || []}
          onClose={() => setView('student-dashboard')} 
        />
      );
      case 'become-teacher': return <BecomeTeacherPage setView={handleProtectedNavigation} showToast={showToast} onSubmit={addTeacherApplication} />;
      case 'admin-teacher-applications': return <AdminTeacherApplications setView={handleProtectedNavigation} applications={teacherApplications} onAppoint={appointTeacher} onReject={rejectApplication} />;
      case 'course-learning': return <CourseLearningPage setView={handleProtectedNavigation} courseId={selectedCourseId} courses={allCourses} />;
      case 'my-courses': return <div className="space-y-8"><div><h1 className="text-2xl font-bold">My Courses</h1><p className="text-slate-500">Continue where you left off</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{allCourses.filter(c => c.progress !== undefined).map(c => <CourseCard key={c.id} course={c} onDetails={() => { setSelectedCourseId(c.id); handleProtectedNavigation('course-learning'); }} showProgress={role === 'student'} />)}</div></div>;
      case 'completed-courses': return <div className="space-y-8"><div><h1 className="text-2xl font-bold">Completed Courses</h1><p className="text-slate-500">Great job on finishing these!</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{allCourses.filter(c => c.progress === 100).map(c => <CourseCard key={c.id} course={c} onDetails={() => { setSelectedCourseId(c.id); handleProtectedNavigation('course-learning'); }} showProgress={role === 'student'} />)}</div></div>;
      case 'certificates': return <CertificatesPage setView={handleProtectedNavigation} showToast={showToast} />;
      case 'browse-courses': return <BrowseCourses setView={handleProtectedNavigation} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} courses={allCourses} role={role} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSelectCourse={setSelectedCourseId} />;
      case 'categories': return <CategoriesPage setView={handleProtectedNavigation} setSelectedCategory={setSelectedCategory} />;
      case 'about-us': return <AboutUsPage />;
      case 'instructors': return <InstructorsPage setView={handleProtectedNavigation} />;
      case 'contact-us': return <ContactPage />;
      case 'course-details': return <CourseDetails setView={handleProtectedNavigation} courseId={selectedCourseId} courses={allCourses} />;
      case 'payment-options': return <PaymentOptions setView={handleProtectedNavigation} />;
      case 'payment-upi': return <UPIPayment setView={handleProtectedNavigation} />;
      case 'payment-card': return <CardPayment setView={handleProtectedNavigation} />;
      case 'payment-success': return <PaymentSuccess setView={handleProtectedNavigation} />;
      case 'instructor-dashboard': return <InstructorDashboard setView={handleProtectedNavigation} courses={allCourses} teacherId={loggedInUserId} onSelectCourse={setSelectedCourseId} showToast={showToast} />;
      case 'instructor-profile': return <InstructorProfile setView={handleProtectedNavigation} teacherId={loggedInUserId} showToast={showToast} />;
      case 'instructor-messages': return <InstructorMessages setView={handleProtectedNavigation} showToast={showToast} />;
      case 'instructor-reviews': return <InstructorReviews setView={handleProtectedNavigation} showToast={showToast} />;
      case 'instructor-quizzes': return <InstructorQuizzesPage setView={handleProtectedNavigation} showToast={showToast} />;
      case 'create-course': return <CreateCourse setView={handleProtectedNavigation} addCourse={addCourse} showToast={showToast} />;
      case 'submission-status': return <SubmissionStatus setView={handleProtectedNavigation} />;
      case 'edit-course-content': return <EditCourseContent setView={handleProtectedNavigation} courseId={selectedCourseId} courses={allCourses} />;
      case 'course-analytics': return <CourseAnalytics setView={handleProtectedNavigation} courseId={selectedCourseId} courses={allCourses} />;
      case 'help-center': return <StaticPage title="Help Center" content="Welcome to the EduStream Pro Help Center. How can we assist you today?\n\nOur support team is available 24/7 to help you with any technical issues, course inquiries, or payment concerns. Browse our extensive knowledge base or reach out to us directly." />;
      case 'privacy-policy': return <StaticPage title="Privacy Policy" content="At EduStream Pro, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.\n\nWe use industry-standard encryption to protect your data and never share your personal information with third parties without your explicit consent." />;
      default: return <StudentDashboard setView={handleProtectedNavigation} courses={allCourses} onSelectCourse={setSelectedCourseId} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        role={role} 
        setView={handleProtectedNavigation} 
        setRole={setRole} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        userId={loggedInUserId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        onMarkAllRead={handleMarkAllRead}
      />
      
      <div className="flex flex-1">
        {view !== 'home' && view !== 'login' && (
          <Sidebar role={role} currentView={view} setView={handleProtectedNavigation} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        )}
        
        <main className={`flex-1 ${view === 'home' ? '' : 'p-4 md:p-6 lg:p-10'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer setView={handleProtectedNavigation} />

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
