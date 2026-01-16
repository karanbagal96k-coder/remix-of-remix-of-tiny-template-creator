/**
 * Student Header Component
 * 
 * FRONTEND FROZEN — BACKEND INTEGRATION ONLY
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Home, Loader2, Bell } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import AnimatedButton from './AnimatedButton';
import { Badge } from '@/components/ui/badge';

// Mock unread count - would come from API in production
const MOCK_UNREAD_COUNT = 2;

const StudentHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUI();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.header
      className="glass-strong rounded-2xl p-4 mb-6 flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Home className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">
              {user?.name || 'Student'}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.email || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <Link
          to="/student/notifications"
          className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {MOCK_UNREAD_COUNT > 0 && (
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {MOCK_UNREAD_COUNT > 9 ? '9+' : MOCK_UNREAD_COUNT}
            </Badge>
          )}
        </Link>

        <AnimatedButton
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </AnimatedButton>
      </div>
    </motion.header>
  );
};

export default StudentHeader;