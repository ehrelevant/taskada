import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type ChatLogsRouteProp = RouteProp<TransactionHistoryStackParamList, 'ChatLogs'>;
type ChatLogsNavigationProp = NativeStackNavigationProp<TransactionHistoryStackParamList, 'ChatLogs'>;

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

export function useChatLogsScreen() {
  const route = useRoute<ChatLogsRouteProp>();
  const navigation = useNavigation<ChatLogsNavigationProp>();
  const { bookingId, otherUser } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadChatLogs();
  }, [bookingId]);

  const loadChatLogs = async () => {
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
  };

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    messages,
    isLoading,
    error,
    otherUser,
    selectedImage,
    setSelectedImage,
    handleGoBack,
  };
}
