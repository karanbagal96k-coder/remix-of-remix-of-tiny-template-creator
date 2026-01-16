// FRONTEND FROZEN — BACKEND IS SOURCE OF TRUTH
/**
 * Student Notifications Page
 * 
 * OWNERSHIP: SYSTEM & COMPANY
 * STUDENT ACCESS: READ-ONLY
 * 
 * This page displays system and company-generated notifications.
 * Students cannot reply, edit, or dismiss individual notifications.
 * The only action available is "Mark all as read".
 */

import { useState } from 'react';
import { Bell, Building2, Shield, Clock, CheckCheck, Inbox } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import StudentHeader from '@/components/StudentHeader';

// ============================================================================
// NOTIFICATION TYPES (SYSTEM-OWNED)
// ============================================================================

interface Notification {
  readonly id: string;
  readonly type: 'system' | 'company';
  readonly title: string;
  readonly message: string;
  readonly timestamp: string;
  readonly read: boolean;
}

// ============================================================================
// MOCK DATA (REPLACE WITH API)
// ============================================================================

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'company',
    title: 'You have been accepted',
    message: 'TechCorp Solutions has accepted your application for the Frontend Developer Intern position.',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
  },
  {
    id: 'notif-002',
    type: 'system',
    title: 'You have been matched to a role',
    message: 'Aura has identified a potential match based on your skills and preferences.',
    timestamp: '2024-01-14T15:45:00Z',
    read: false,
  },
  {
    id: 'notif-003',
    type: 'company',
    title: 'Company reviewed your profile',
    message: 'DataFlow Inc. has reviewed your profile and is currently evaluating candidates.',
    timestamp: '2024-01-13T09:20:00Z',
    read: true,
  },
  {
    id: 'notif-004',
    type: 'system',
    title: 'Your profile is under evaluation',
    message: 'Your profile has entered the matching queue. No action is required from your side.',
    timestamp: '2024-01-12T14:00:00Z',
    read: true,
  },
  {
    id: 'notif-005',
    type: 'company',
    title: 'You have been waitlisted',
    message: 'CloudBase Technologies has placed you on their waitlist. You may be contacted if a position opens.',
    timestamp: '2024-01-11T11:15:00Z',
    read: true,
  },
  {
    id: 'notif-006',
    type: 'system',
    title: 'You will be considered for future matches',
    message: 'Your profile remains active in the system. New opportunities will be matched automatically.',
    timestamp: '2024-01-10T08:30:00Z',
    read: true,
  },
  {
    id: 'notif-007',
    type: 'company',
    title: 'You have been rejected',
    message: 'InnovateTech has decided to proceed with other candidates for this role.',
    timestamp: '2024-01-09T16:45:00Z',
    read: true,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return 'Just now';
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

// ============================================================================
// NOTIFICATION CARD COMPONENT
// ============================================================================

interface NotificationCardProps {
  notification: Notification;
}

function NotificationCard({ notification }: NotificationCardProps) {
  const isSystem = notification.type === 'system';
  
  return (
    <Card className={`transition-colors ${notification.read ? 'bg-muted/30' : 'bg-card border-primary/20'}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isSystem ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'
          }`}>
            {isSystem ? <Shield className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {notification.title}
                </h3>
                {!notification.read && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
              <Badge 
                variant={isSystem ? 'default' : 'secondary'}
                className="flex-shrink-0 text-xs"
              >
                {isSystem ? 'System' : 'Company'}
              </Badge>
            </div>
            
            <p className={`text-sm mb-2 ${notification.read ? 'text-muted-foreground' : 'text-foreground/80'}`}>
              {notification.message}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(notification.timestamp)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">No updates yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Aura will notify you when something changes in your matching journey.
      </p>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Notifications() {
  // Local state for read status (mock - would be API in production)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasNotifications = notifications.length > 0;

  // Mark all as read handler
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      
      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  System and company updates related to your profile
                </p>
              </div>
            </div>
            
            {/* Unread count badge */}
            {unreadCount > 0 && (
              <Badge variant="default" className="text-sm">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        {/* Mark All Read Button */}
        {hasNotifications && unreadCount > 0 && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        )}

        {/* Notification List */}
        {hasNotifications ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Footer Notice */}
        <Separator className="my-8" />
        
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <p className="text-sm">
              All notifications are system or company generated. Students cannot respond to notifications.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
