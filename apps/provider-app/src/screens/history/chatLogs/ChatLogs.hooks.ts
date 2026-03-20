import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useCallback, useEffect, useState } from 'react';

type ChatLogsRouteProp = RouteProp<TransactionHistoryStackParamList, 'ChatLogs'>;
type ChatLogsNavigationProp = NativeStackNavigationProp<TransactionHistoryStackParamList, 'ChatLogs'>;

export interface Message {
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

interface UseChatLogsReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  handleGoBack: () => void;
  loadChatLogs: () => Promise<void>;
}

export function useChatLogs(): UseChatLogsReturn {
  const route = useRoute<ChatLogsRouteProp>();
  const navigation = useNavigation<ChatLogsNavigationProp>();
  const { bookingId, otherUser } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadChatLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await providerClient.apiFetch(`/bookings/${bookingId}/chat-logs`, 'GET');

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

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    messages,
    isLoading,
    error,
    selectedImage,
    setSelectedImage,
    otherUser,
    handleGoBack,
    loadChatLogs,
  };
}
