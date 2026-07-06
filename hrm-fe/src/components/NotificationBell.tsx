import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import axiosClient from "../api/axiosClient";

type Notification = {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

const EMPTY_NOTIFICATIONS: Notification[] = [];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [displayNotifications, setDisplayNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications = EMPTY_NOTIFICATIONS, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosClient.get("/notifications/unread");
      return res.data;
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.length;

  useEffect(() => {
    if (!isOpen) {
      setDisplayNotifications(notifications);
    }
  }, [notifications, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
    // Remove locally from displayNotifications for immediate feedback
    setDisplayNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (id: string, type: string) => {
    markAsReadMutation.mutate(id);
    setDisplayNotifications(prev => prev.filter(n => n.id !== id));

    if (type.includes('leave_request')) {
      navigate('/schedule');
      setIsOpen(false);
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef} style={{ position: "relative" }}>
      <button 
        className="icon-button" 
        aria-label="Notifications" 
        type="button"
        onClick={handleToggle}
        style={{ position: "relative" }}
      >
        <Bell size={19} className={unreadCount > 0 ? "bell-ringing" : ""} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && <span>{unreadCount} unread</span>}
          </div>
          <div className="notification-list">
            {isLoading ? (
              <div className="notification-empty">
                <Loader2 size={16} className="spin-icon" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No new notifications</p>
              </div>
            ) : (
              displayNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="notification-item"
                  onClick={() => handleNotificationClick(notif.id, notif.type)}
                  style={{ cursor: 'pointer' }}
                >
                  <p>{notif.message}</p>
                  <div className="notification-footer">
                    <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    <button 
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title="Mark as read"
                    >
                      <CheckCheck size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
