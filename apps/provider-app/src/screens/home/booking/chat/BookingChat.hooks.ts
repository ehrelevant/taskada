import * as ImagePicker from 'expo-image-picker';
import { Alert, AppState } from 'react-native';
import { authClient } from '@lib/authClient';
import { BookingStackParamList } from '@navigation/BookingStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabsParamList } from '@navigation/DashboardTabs';
import { FlatList } from 'react-native';
import type { Message } from '@repo/shared';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';

type ChatRouteProp = RouteProp<BookingStackParamList, 'BookingChat'>;
type ChatNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingChat'>;

interface ChatScreenParams {
  bookingId: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  requestId: string;
  address: {
    label: string | null;
    coordinates: [number, number];
  };
}

export function useBookingChat() {
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<ChatNavigationProp>();
  const { bookingId, otherUser, requestId, address } = route.params as ChatScreenParams;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const session = authClient.useSession();
  const currentUserId = session.data?.user?.id;

  const navigateToRequestsList = useCallback(() => {
    const tabsNavigation = navigation.getParent<BottomTabNavigationProp<DashboardTabsParamList>>();
    tabsNavigation?.navigate('RequestsStack', {
      screen: 'RequestList',
    });
  }, [navigation]);

  const mergeMessages = useCallback((existing: Message[], incoming: Message[]): Message[] => {
    const messageMap = new Map(existing.map(message => [message.id, message]));
    for (const message of incoming) {
      messageMap.set(message.id, message);
    }

    return [...messageMap.values()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, []);

  const loadMessages = useCallback(
    async (loadOffset = 0) => {
      try {
        const response = await providerClient.apiFetch(
          `/bookings/${bookingId}/messages?limit=50&offset=${loadOffset}`,
          'GET',
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(prev => mergeMessages(prev, data.messages));
          setHasMoreMessages(data.hasMore);
          setOffset(loadOffset + data.messages.length);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookingId, mergeMessages],
  );

  const refreshLatestMessages = useCallback(async () => {
    try {
      const response = await providerClient.apiFetch(`/bookings/${bookingId}/messages?limit=50&offset=0`, 'GET');
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setMessages(prev => mergeMessages(prev, data.messages));
      setHasMoreMessages(data.hasMore);
      setOffset(prevOffset => Math.max(prevOffset, data.messages.length));
    } catch (error) {
      console.error('Failed to refresh latest messages:', error);
    }
  }, [bookingId, mergeMessages]);

  useEffect(() => {
    if (session.data) {
      loadMessages(0);
    }
  }, [loadMessages, session.data]);

  useEffect(() => {
    if (!session.data) {
      return;
    }

    const intervalId = setInterval(() => {
      if (!providerClient.isChatConnected()) {
        void refreshLatestMessages();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refreshLatestMessages, session.data]);

  useEffect(() => {
    if (!session.data) {
      return;
    }

    const appStateSubscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        void refreshLatestMessages();
      }
    });

    return () => appStateSubscription.remove();
  }, [refreshLatestMessages, session.data]);

  useEffect(() => {
    if (!session.data) return;

    const setupSocket = async () => {
      if (!currentUserId) return;
      const handleNewMessage = (message: Message) => {
        setMessages(prev => mergeMessages(prev, [message]));
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      };

      const handleTyping = (data: { userId: string; bookingId: string; isTyping: boolean }) => {
        if (data.userId !== currentUserId) {
          setIsTyping(data.isTyping);
        }
      };

      const handleBookingDeclined = (data: { bookingId: string; requestId: string }) => {
        if (data.bookingId === bookingId) {
          Alert.alert('Booking Declined', 'The seeker has declined the booking.', [
            { text: 'OK', onPress: navigateToRequestsList },
          ]);
        }
      };

      const handleBookingCancelled = (data: { bookingId: string }) => {
        if (data.bookingId === bookingId) {
          Alert.alert('Booking Cancelled', 'The seeker has cancelled the booking.', [
            { text: 'OK', onPress: navigateToRequestsList },
          ]);
        }
      };

      providerClient.onNewMessage(handleNewMessage);
      providerClient.onTyping(handleTyping);
      providerClient.onBookingDeclined(handleBookingDeclined);
      providerClient.onBookingCancelled(handleBookingCancelled);

      await providerClient.connectChat(authClient.getCookie(), currentUserId, 'provider');
      providerClient.joinBooking(bookingId);

      return () => {
        providerClient.offNewMessage(handleNewMessage);
        providerClient.offTyping(handleTyping);
        providerClient.offBookingDeclined(handleBookingDeclined);
        providerClient.offBookingCancelled(handleBookingCancelled);
      };
    };

    let unregisterHandlers: (() => void) | undefined;
    setupSocket().then(cleanup => {
      unregisterHandlers = cleanup;
    });

    return () => {
      unregisterHandlers?.();
      providerClient.leaveBooking(bookingId);
    };
  }, [bookingId, currentUserId, mergeMessages, navigateToRequestsList, session.data]);

  const handleSendMessage = useCallback(async () => {
    if ((!inputText.trim() && selectedImages.length === 0) || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      let imageKeys: string[] = [];

      if (selectedImages.length > 0) {
        imageKeys = await providerClient.uploadMessageImages(bookingId, selectedImages);
        setSelectedImages([]);
      }

      providerClient.sendMessage(bookingId, messageText, imageKeys);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  }, [bookingId, inputText, isSending, selectedImages]);

  const handleDecline = useCallback(async () => {
    Alert.alert('Decline Booking', 'Are you sure you want to decline this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await providerClient.apiFetch(`/requests/${requestId}/status`, 'PATCH', {
              body: JSON.stringify({ status: 'pending' }),
            });

            if (response.ok) {
              providerClient.declineBooking(bookingId, requestId);
              Alert.alert('Declined', 'The booking has been declined.', [
                { text: 'OK', onPress: navigateToRequestsList },
              ]);
            }
          } catch (error) {
            console.error('Failed to decline request:', error);
            Alert.alert('Error', 'Failed to decline booking. Please try again.');
          }
        },
      },
    ]);
  }, [bookingId, navigateToRequestsList, requestId]);

  const handleFinalize = useCallback(() => {
    navigation.navigate('BookingFinalize', {
      bookingId,
      seekerLocation: address,
      otherUser,
      requestId,
    });
  }, [address, bookingId, navigation, otherUser, requestId]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreMessages && !isLoading) {
      loadMessages(offset);
    }
  }, [hasMoreMessages, isLoading, loadMessages, offset]);

  const handlePickImage = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to send images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4 - selectedImages.length,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
    }
  }, [selectedImages.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleReport = useCallback(() => {
    navigation.navigate('Report', {
      bookingId,
      reportedUser: otherUser,
    });
  }, [bookingId, navigation, otherUser]);

  return {
    otherUser,
    messages,
    inputText,
    setInputText,
    isLoading,
    isSending,
    isTyping,
    hasMoreMessages,
    selectedImages,
    selectedImage,
    setSelectedImage,
    currentUserId,
    handleSendMessage,
    handleDecline,
    handleFinalize,
    handleLoadMore,
    handlePickImage,
    handleRemoveImage,
    handleReport,
  };
}
