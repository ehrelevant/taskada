import { BookingStackParamList } from '@navigation/BookingStack';
import { HistoryStackParamList } from '@navigation/HistoryStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type ChatLogsRouteProp = RouteProp<HistoryStackParamList & BookingStackParamList, 'ChatLogs'>;
type ChatLogsNavigationProp = NativeStackNavigationProp<HistoryStackParamList & BookingStackParamList, 'ChatLogs'>;

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

export function useChatLogs() {
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

  const handleReport = useCallback(() => {
    navigation.navigate('Report', {
      bookingId,
      reportedUser: otherUser,
    });
  }, [bookingId, navigation, otherUser]);

  return {
    messages,
    isLoading,
    error,
    selectedImage,
    setSelectedImage,
    otherUser,
    handleGoBack,
    handleReport,
    loadChatLogs,
  };
}
