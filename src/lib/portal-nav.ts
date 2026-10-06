import type { LucideIcon } from 'lucide-react';
import {
  Activity, Award, BarChart3, Bell, BookOpen, Building2, CalendarDays, CircleHelp, ClipboardList, Coins,
  FileCheck2, FileText, FolderKanban, KeyRound, LayoutDashboard, Lightbulb, ListChecks,
  Megaphone, MessageSquare, Microscope, Settings, Shield, ShieldCheck, Sparkles, Star, Target, UserRound,
  Users, Wallet,
} from 'lucide-react';
import type { UserRole } from '@/types';

export type PortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Sample count shown until the item is wired to live data. */
  badge?: number;
};

export function getWorkspaceRole(pathname: string, fallback: UserRole): UserRole {
  const role = pathname.split('/')[1]?.toUpperCase();
  return role && Object.prototype.hasOwnProperty.call(portalNavigation, role) ? role as UserRole : fallback;
}

export const portalNavigation: Record<UserRole, PortalNavItem[]> = {
  SPONSOR: [
    { label: 'Dashboard', href: '/sponsor/dashboard', icon: LayoutDashboard },
    { label: 'Funded Projects', href: '/sponsor/dashboard#projects', icon: FolderKanban },
    { label: 'Research Proposals', href: '/sponsor/dashboard#proposals', icon: Lightbulb },
    { label: 'Access Requests', href: '/sponsor/dashboard#access-requests', icon: KeyRound },
    { label: 'Researchers', href: '/sponsor/dashboard#researchers', icon: Users },
    { label: 'Impact & Reports', href: '/sponsor/dashboard#impact', icon: BarChart3 },
    { label: 'Payments & Rewards', href: '/sponsor/dashboard#funding', icon: Wallet },
    { label: 'Organizations', href: '/sponsor/dashboard#organization', icon: Building2 },
    { label: 'AI Insights', href: '/sponsor/dashboard#insights', icon: Sparkles },
    { label: 'Contributions', href: '/sponsor/dashboard#contributions', icon: FileCheck2 },
    { label: 'Charter Templates', href: '/sponsor/dashboard#proposals', icon: FileText },
    { label: 'Messages', href: '/sponsor/messages', icon: MessageSquare },
    { label: 'Settings', href: '/sponsor/settings', icon: Settings },
  ],
  STUDENT: [
    { label: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', href: '/student/projects', icon: FolderKanban },
    { label: 'Recommended', href: '/student/recommended', icon: Star },
    { label: 'My Tasks', href: '/student/tasks', icon: ListChecks },
    { label: 'Contributions', href: '/student/contributions', icon: FileCheck2 },
    { label: 'Skills & Verification', href: '/student/skills', icon: Award },
    { label: 'Credits', href: '/student/credits', icon: Coins },
    { label: 'Mentor Feedback', href: '/student/mentor-feedback', icon: MessageSquare },
    { label: 'AI Assistant', href: '/student/ai-assistant', icon: Sparkles },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Profile', href: '/student/profile', icon: UserRound },
    { label: 'Settings', href: '/student/settings', icon: Settings },
  ],
  MENTOR: [
    { label: 'Dashboard', href: '/mentor/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', href: '/mentor/projects', icon: FolderKanban },
    { label: 'My Mentees', href: '/mentor/students', icon: Users },
    { label: 'Candidate Matching', href: '/mentor/candidate-matching', icon: Target },
    { label: 'Contribution Reviews', href: '/mentor/queue', icon: ClipboardList },
    { label: 'Skill Verification', href: '/mentor/skill-verification', icon: Award },
    { label: 'Task Management', href: '/mentor/tasks', icon: ListChecks },
    { label: 'Mentor Reports', href: '/mentor/reports', icon: BarChart3 },
    { label: 'Messages', href: '/mentor/messages', icon: MessageSquare },
    { label: 'Calendar', href: '/mentor/calendar', icon: CalendarDays },
    { label: 'Resources', href: '/mentor/resources', icon: BookOpen },
    { label: 'Profile', href: '/mentor/profile', icon: UserRound },
    { label: 'Settings', href: '/mentor/settings', icon: Settings },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Organizations', href: '/admin/organizations', icon: Building2 },
    { label: 'Project Verification', href: '/admin/verification', icon: ShieldCheck },
    { label: 'Access Requests', href: '/admin/access-requests', icon: KeyRound },
    { label: 'Research Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Contributions', href: '/admin/contributions', icon: FileCheck2 },
    { label: 'AI Mesh Monitor', href: '/admin/mesh', icon: Sparkles },
    { label: 'System Analytics', href: '/admin/analytics', icon: Activity },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Security & Audit', href: '/admin/audit', icon: Shield },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
    { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Help & Support', href: '/admin/help', icon: CircleHelp },
  ],
  RESEARCHER: [
    { label: 'Dashboard', href: '/researcher/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', href: '/researcher/dashboard#projects', icon: FolderKanban },
    { label: 'Research Problems', href: '/researcher/dashboard#research-focus', icon: Lightbulb },
    { label: 'Access Requests', href: '/researcher/dashboard#collaboration-requests', icon: KeyRound },
    { label: 'Contributions', href: '/researcher/dashboard#contributions', icon: FileCheck2 },
    { label: 'Payments & Rewards', href: '/researcher/dashboard#credits', icon: Coins },
    { label: 'Reports & Analytics', href: '/researcher/dashboard#impact', icon: BarChart3 },
    { label: 'Researchers', href: '/researcher/dashboard#researchers', icon: Users },
    { label: 'Organizations', href: '/researcher/dashboard#organization', icon: Building2 },
    { label: 'AI Insights', href: '/researcher/dashboard#ai-insights', icon: Sparkles },
    { label: 'Messages', href: '/researcher/messages', icon: MessageSquare },
    { label: 'Settings', href: '/researcher/settings', icon: Settings },
  ],
};

export function findPortalItem(path: string): PortalNavItem | undefined {
  return Object.values(portalNavigation).flat().find((item) => item.href === path);
}
