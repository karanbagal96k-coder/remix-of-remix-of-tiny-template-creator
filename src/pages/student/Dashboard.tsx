/**
 * Student Dashboard
 * 
 * FRONTEND FROZEN — BACKEND INTEGRATION ONLY
 * 
 * OWNERSHIP: SYSTEM
 * STUDENT ACCESS: READ-ONLY
 * 
 * High-level overview of the student journey.
 * This is NOT editable by students.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Bell,
  History,
  User,
  ArrowRight,
  Shield,
  Sparkles,
  Lock,
} from 'lucide-react';
import StudentHeader from '@/components/StudentHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ============================================================================
// MOCK DATA (SYSTEM-OWNED, READ-ONLY)
// ============================================================================

type DashboardStatus = 'processing' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';

interface DashboardData {
  readonly currentStatus: DashboardStatus;
  readonly statusMessage: string;
  readonly unreadNotificationsCount: number;
}

const MOCK_DASHBOARD: DashboardData = {
  currentStatus: 'under_review',
  statusMessage: 'A company is currently reviewing your profile. No action required from you.',
  unreadNotificationsCount: 2,
};

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

interface StatusConfig {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly bgClass: string;
  readonly iconClass: string;
  readonly badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
}

const STATUS_CONFIGS: Record<DashboardStatus, StatusConfig> = {
  processing: {
    icon: Loader2,
    label: 'Processing',
    bgClass: 'bg-muted/50 border-muted',
    iconClass: 'text-muted-foreground animate-spin',
    badgeVariant: 'secondary',
  },
  under_review: {
    icon: Search,
    label: 'Under Review',
    bgClass: 'bg-primary/10 border-primary/30',
    iconClass: 'text-primary',
    badgeVariant: 'outline',
  },
  accepted: {
    icon: CheckCircle2,
    label: 'Accepted',
    bgClass: 'bg-chart-4/20 border-chart-4/40',
    iconClass: 'text-chart-4',
    badgeVariant: 'default',
  },
  rejected: {
    icon: XCircle,
    label: 'Not Selected',
    bgClass: 'bg-destructive/10 border-destructive/30',
    iconClass: 'text-destructive',
    badgeVariant: 'destructive',
  },
  waitlisted: {
    icon: Clock,
    label: 'Waitlisted',
    bgClass: 'bg-chart-5/20 border-chart-5/40',
    iconClass: 'text-chart-5',
    badgeVariant: 'outline',
  },
};

// ============================================================================
// QUICK LINKS DATA
// ============================================================================

const QUICK_LINKS = [
  {
    title: 'Notifications',
    description: 'View system and company updates',
    icon: Bell,
    href: '/student/notifications',
    badge: MOCK_DASHBOARD.unreadNotificationsCount > 0 ? MOCK_DASHBOARD.unreadNotificationsCount : null,
  },
  {
    title: 'Match History',
    description: 'Your past and current matches',
    icon: History,
    href: '/student/history',
    badge: null,
  },
  {
    title: 'Profile',
    description: 'View your submitted profile',
    icon: User,
    href: '/student/profile',
    badge: null,
    hint: 'Read-only',
  },
];

// ============================================================================
// AURA GUIDANCE MESSAGES
// ============================================================================

const AURA_MESSAGES = [
  'Aura is evaluating your profile against available positions.',
  'No action required from you at this time.',
  'We will notify you when something changes.',
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Dashboard() {
  const config = STATUS_CONFIGS[MOCK_DASHBOARD.currentStatus];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-6">
        <StudentHeader />

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Aura</h1>
          <p className="text-muted-foreground">
            Your internship journey, guided by intelligence
          </p>
        </motion.div>

        {/* Section 1: Current Status Card (Primary) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`${config.bgClass} border-2 mb-6`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Current Status</CardTitle>
                <Badge variant="outline" className="text-xs gap-1">
                  <Lock className="w-3 h-3" />
                  System Owned
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-background/80 flex items-center justify-center">
                  <StatusIcon className={`w-7 h-7 ${config.iconClass}`} />
                </div>
                <div className="flex-1">
                  <Badge variant={config.badgeVariant} className="mb-2">
                    {config.label}
                  </Badge>
                  <p className="text-sm text-foreground/80">
                    {MOCK_DASHBOARD.statusMessage}
                  </p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link to="/student/result">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 2: Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold mb-3 text-foreground">Quick Links</h2>
          <div className="grid gap-3">
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} to={link.href}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <link.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{link.title}</span>
                          {link.badge && (
                            <Badge variant="default" className="text-xs">
                              {link.badge}
                            </Badge>
                          )}
                          {link.hint && (
                            <Badge variant="secondary" className="text-xs">
                              {link.hint}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Section 3: Aura Guidance Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                Aura Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {AURA_MESSAGES.map((message, index) => (
                  <li
                    key={index}
                    className="text-sm text-foreground/80 flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{message}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 4: System Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              This dashboard is system generated. Match outcomes cannot be influenced by students.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
