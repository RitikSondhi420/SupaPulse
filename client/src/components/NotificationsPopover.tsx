import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, CheckCheck, AlertOctagon, UserPlus, ArrowRight, ShieldAlert } from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setSelectedTask, 
    tasks,
    currentUser,
    currentTeam 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'qa'>('all');

  if (!isOpen) return null;

  // Filter notifications based on tab and team visibility (unless admin)
  const userFiltered = notifications.filter(n => {
    if (currentUser.role !== 'Admin' && n.teamId !== currentTeam.id) return false;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'qa') return n.type === 'testing_failed' || n.type === 'review_required';
    return true;
  });

  const handleNotificationClick = (taskId?: string, notifId?: string) => {
    if (notifId) markNotificationRead(notifId);
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
      }
    }
    onClose();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'testing_failed':
        return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      case 'completed':
        return <Check className="w-4 h-4 text-[#3ecf8e]" />;
      case 'review_required':
        return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      case 'assignment':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      default:
        return <ArrowRight className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover */}
      <div className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#2e2e2e] flex items-center justify-between bg-[#151515]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#3ecf8e]" />
            <h3 className="text-sm font-semibold text-neutral-100">Activity Notifications</h3>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/30">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-neutral-400 hover:text-[#3ecf8e] flex items-center gap-1 transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark read</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2e2e2e] bg-[#121212] px-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'unread'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'qa'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            QA & Alerts
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#262626]">
          {userFiltered.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-xs">
              No notifications in this category.
            </div>
          ) : (
            userFiltered.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.taskId, notif.id)}
                className={`p-3.5 hover:bg-[#202020] cursor-pointer transition-colors flex items-start gap-3 ${
                  !notif.read ? 'bg-[#1b221e]/40' : ''
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={notif.senderAvatar}
                    alt={notif.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-[#2e2e2e]"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#181818] border border-[#2e2e2e]">
                    {getNotifIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-neutral-200 truncate">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 shrink-0">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-snug line-clamp-2">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#3ecf8e] mt-1.5 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
