import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import api, { getAuthToken } from '../services/api';
import audioNotification from '../utils/audioNotification';

const RealtimeNotificationContext = createContext(null);

export function RealtimeNotificationProvider({ children, currentUserId, currentProjectId, onProjectEvent }) {
  const [connectionStatus, setConnectionStatus] = useState('OFFLINE'); // 'CONNECTED' | 'RECONNECTING' | 'OFFLINE'
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [preferences, setPreferences] = useState({
    tasksEnabled: true,
    risksEnabled: true,
    projectsEnabled: true,
    meetingsEnabled: true,
    approvalsEnabled: true,
    commentsEnabled: true,
    soundEnabled: true
  });

  const stompClientRef = useRef(null);
  const projectSubRef = useRef(null);
  const processedIdsRef = useRef(new Set());
  const projectCallbacksRef = useRef(new Set());

  // 1. Load initial notifications & preferences from REST API
  const refreshNotifications = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const data = await api.getNotifications(0, 50);
      if (Array.isArray(data)) {
        const formatted = data.map(n => ({
          ...n,
          unread: !n.isRead,
          time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
        }));
        setNotifications(formatted);
      }
      const countRes = await api.getUnreadCount();
      if (countRes && typeof countRes.unreadCount === 'number') {
        setUnreadCount(countRes.unreadCount);
      }
    } catch {
      // Fallback silently if backend temporarily warming up
    }
  }, []);

  const loadPreferences = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const prefs = await api.getNotificationPreferences();
      if (prefs && typeof prefs === 'object') {
        setPreferences(prefs);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    loadPreferences();
  }, [refreshNotifications, loadPreferences]);

  // 2. Dispatch a Toast Notification
  const addToast = useCallback((toastData) => {
    const id = toastData.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = {
      id,
      ...toastData,
      createdAt: Date.now()
    };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]); // Keep max 5 toasts visible

    // Play micro-chime if audio enabled
    if (preferences.soundEnabled) {
      audioNotification.playChime(toastData.severity || toastData.type);
    }

    // Auto dismiss
    const duration = (toastData.severity === 'CRITICAL' || toastData.severity === 'HIGH' || toastData.type === 'danger') ? 10000 : 6000;
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }, [preferences.soundEnabled]);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 3. Mark single notification read
  const markNotificationRead = useCallback(async (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false, isRead: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await api.markNotificationRead(id);
    } catch {
      // Optimistic update retained
    }
  }, []);

  // 4. Mark all notifications read
  const markAllNotificationsRead = useCallback(async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false, isRead: true }))
    );
    setUnreadCount(0);

    try {
      await api.markAllNotificationsRead();
    } catch {
      // Optimistic update retained
    }
  }, []);

  // 5. Update user notification preferences
  const updatePreferences = useCallback(async (newPrefs) => {
    setPreferences(newPrefs);
    try {
      await api.updateNotificationPreferences(newPrefs);
    } catch {
      // Fallback
    }
  }, []);

  // 6. Register project telemetry event callbacks
  const registerProjectListener = useCallback((cb) => {
    projectCallbacksRef.current.add(cb);
    return () => {
      projectCallbacksRef.current.delete(cb);
    };
  }, []);

  // 7. WebSocket STOMP Connection Setup
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setConnectionStatus('OFFLINE');
      return;
    }

    const host = window.location.host;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Vite proxies /ws to backend:8080/ws
    const brokerURL = `${protocol}//${host}/ws/websocket`;

    const client = new Client({
      brokerURL,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: () => {
        // Disabled verbose logging for production cleanliness
      },
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setConnectionStatus('CONNECTED');
        // Refresh offline notifications missed during disconnect
        refreshNotifications();

        // A. Subscribe to personal notifications: /user/queue/notifications
        client.subscribe('/user/queue/notifications', (message) => {
          try {
            const event = JSON.parse(message.body);
            if (event.id && processedIdsRef.current.has(event.id)) {
              return; // Prevent duplicate
            }
            if (event.id) {
              processedIdsRef.current.add(event.id);
            }

            const formatted = {
              ...event,
              unread: true,
              isRead: false,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setNotifications(prev => [formatted, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Determine toast action
            let actionLabel = null;
            let actionView = null;
            if (event.relatedEntityType === 'TASK') {
              actionLabel = 'View Task';
              actionView = 'Tasks';
            } else if (event.relatedEntityType === 'CHANGE_REQUEST') {
              actionLabel = 'View Request';
              actionView = 'Change Requests';
            } else if (event.relatedEntityType === 'APPROVAL') {
              actionLabel = 'View Approval';
              actionView = 'Approvals';
            } else if (event.relatedEntityType === 'MEETING') {
              actionLabel = 'View Meeting';
              actionView = 'Meetings';
            } else if (event.relatedEntityType === 'PROJECT') {
              actionLabel = 'View Project';
              actionView = 'Overview';
            }

            addToast({
              id: event.id || `notif-${Date.now()}`,
              type: (event.severity === 'CRITICAL' || event.severity === 'HIGH') ? 'danger' : (event.severity === 'WARNING' ? 'warning' : 'info'),
              severity: event.severity,
              title: event.title,
              message: event.message,
              actionLabel,
              actionView,
              actionId: event.relatedEntityId
            });
          } catch (err) {
            console.warn('Error processing STOMP notification:', err);
          }
        });

        // B. Subscribe to unread count updates: /user/queue/unread-count
        client.subscribe('/user/queue/unread-count', (message) => {
          try {
            const payload = JSON.parse(message.body);
            if (typeof payload.unreadCount === 'number') {
              setUnreadCount(payload.unreadCount);
            }
          } catch (err) {
            console.warn('Error processing unread count:', err);
          }
        });

        // C. Subscribe to active project telemetry topic
        if (currentProjectId) {
          projectSubRef.current = client.subscribe(`/topic/project/${currentProjectId}`, (message) => {
            try {
              const telemetry = JSON.parse(message.body);
              // Notify registered listeners
              projectCallbacksRef.current.forEach(cb => {
                try { cb(telemetry); } catch {}
              });
              if (onProjectEvent) {
                onProjectEvent(telemetry);
              }
            } catch (err) {
              console.warn('Error processing project telemetry:', err);
            }
          });
        }
      },
      onDisconnect: () => {
        setConnectionStatus('OFFLINE');
      },
      onStompError: (frame) => {
        console.warn('STOMP broker error:', frame.headers['message']);
        setConnectionStatus('RECONNECTING');
      },
      onWebSocketClose: () => {
        setConnectionStatus('RECONNECTING');
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (projectSubRef.current) {
        projectSubRef.current.unsubscribe();
        projectSubRef.current = null;
      }
      if (client) {
        client.deactivate();
      }
      setConnectionStatus('OFFLINE');
    };
  }, [currentProjectId, addToast, refreshNotifications, onProjectEvent]);

  // Dynamic project subscription switch when active project changes
  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !client.connected || !currentProjectId) return;

    if (projectSubRef.current) {
      projectSubRef.current.unsubscribe();
    }

    projectSubRef.current = client.subscribe(`/topic/project/${currentProjectId}`, (message) => {
      try {
        const telemetry = JSON.parse(message.body);
        projectCallbacksRef.current.forEach(cb => {
          try { cb(telemetry); } catch {}
        });
        if (onProjectEvent) {
          onProjectEvent(telemetry);
        }
      } catch (err) {
        console.warn('Error processing project telemetry:', err);
      }
    });

    return () => {
      if (projectSubRef.current) {
        projectSubRef.current.unsubscribe();
        projectSubRef.current = null;
      }
    };
  }, [currentProjectId, onProjectEvent]);

  const value = {
    connectionStatus,
    notifications,
    unreadCount,
    toasts,
    preferences,
    addToast,
    dismissToast,
    markNotificationRead,
    markAllNotificationsRead,
    refreshNotifications,
    updatePreferences,
    registerProjectListener
  };

  return (
    <RealtimeNotificationContext.Provider value={value}>
      {children}
    </RealtimeNotificationContext.Provider>
  );
}

export function useRealtimeNotifications() {
  const context = useContext(RealtimeNotificationContext);
  if (!context) {
    throw new Error('useRealtimeNotifications must be used within RealtimeNotificationProvider');
  }
  return context;
}
