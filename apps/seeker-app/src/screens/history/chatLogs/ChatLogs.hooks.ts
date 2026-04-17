import { BookingStackParamList } from '@navigation/BookingStack';
import { HistoryStackParamList } from '@navigation/HistoryStack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

type ChatLogsRouteProp = RouteProp<HistoryStackParamList & BookingStackParamList, 'ChatLogs'>;

interface Message {
  id: string;
  userId: string;
  message: string | null;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  imageUrls: string[];
}

export function useChatLogs() {
  const route = useRoute<ChatLogsRouteProp>();
  const { bookingId, otherUser } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadChatLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await seekerClient.apiFetch(`/bookings/${bookingId}/chat-logs`, 'GET');

      if (!response.ok) {
        throw new Error('Failed to load chat logs');
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to load chat logs:', err);
      setError('Failed to load chat logs');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadChatLogs();
  }, [loadChatLogs]);

  return {
    messages,
    isLoading,
    error,
    otherUser,
    selectedImage,
    setSelectedImage,
    loadChatLogs,
  };
}
