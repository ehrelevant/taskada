import * as ImagePicker from 'expo-image-picker';
import { Alert, AppState, BackHandler, FlatList } from 'react-native';
import { authClient } from '@lib/authClient';
import { BookingStackParamList } from '@navigation/BookingStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabsParamList } from '@navigation/DashboardTabs';
import type { Message } from '@repo/shared';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

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
}

export function useBookingChat() {
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<ChatNavigationProp>();
  const { bookingId, otherUser, requestId } = route.params as ChatScreenParams;

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

  const navigateToHome = useCallback(() => {
    const tabsNavigation = navigation.getParent<BottomTabNavigationProp<DashboardTabsParamList>>();
    tabsNavigation?.navigate('HomeStack', {
      screen: 'Home',
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        navigateToHome();
        return true;
      });

      return () => {
        subscription.remove();
      };
    }, [navigateToHome]),
  );

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
        const response = await seekerClient.apiFetch(
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
      const response = await seekerClient.apiFetch(`/bookings/${bookingId}/messages?limit=50&offset=0`, 'GET');
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
      if (!seekerClient.isChatConnected()) {
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
          seekerClient.unwatchRequest(requestId);
          Alert.alert('Booking Declined', 'The provider has declined the booking.', [
            { text: 'OK', onPress: navigateToHome },
          ]);
        }
      };

      const handleBookingCancelled = (data: { bookingId: string }) => {
        if (data.bookingId === bookingId) {
          Alert.alert('Booking Cancelled', 'The booking has been cancelled.', [
            { text: 'OK', onPress: navigateToHome },
          ]);
        }
      };

      const handleProposalSubmitted = (data: {
        bookingId: string;
        proposal: {
          cost: number;
          specifications: string;
          serviceTypeName: string;
          address:
            | {
                label: string | null;
                coordinates: [number, number];
              }
            | undefined;
        };
      }) => {
        if (data.bookingId === bookingId) {
          navigation.navigate('BookingProposal', {
            bookingId,
            otherUser,
            proposal: data.proposal,
            requestId,
          });
        }
      };

      seekerClient.onNewMessage(handleNewMessage);
      seekerClient.onTyping(handleTyping);
      seekerClient.onBookingDeclined(handleBookingDeclined);
      seekerClient.onBookingCancelled(handleBookingCancelled);
      seekerClient.onProposalSubmitted(handleProposalSubmitted);

      await seekerClient.connectChat(authClient.getCookie(), currentUserId, 'seeker');
      seekerClient.joinBooking(bookingId);

      return () => {
        seekerClient.offNewMessage(handleNewMessage);
        seekerClient.offTyping(handleTyping);
        seekerClient.offBookingDeclined(handleBookingDeclined);
        seekerClient.offBookingCancelled(handleBookingCancelled);
        seekerClient.offProposalSubmitted(handleProposalSubmitted);
      };
    };

    let unregisterHandlers: (() => void) | undefined;
    setupSocket().then(cleanup => {
      unregisterHandlers = cleanup;
    });

    return () => {
      unregisterHandlers?.();
      seekerClient.leaveBooking(bookingId);
    };
  }, [bookingId, currentUserId, mergeMessages, navigateToHome, navigation, otherUser, requestId, session.data]);

  const handleSendMessage = useCallback(async () => {
    if ((!inputText.trim() && selectedImages.length === 0) || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      let imageKeys: string[] = [];

      if (selectedImages.length > 0) {
        imageKeys = await seekerClient.uploadMessageImages(bookingId, selectedImages);
        setSelectedImages([]);
      }

      seekerClient.sendMessage(bookingId, messageText, imageKeys);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  }, [bookingId, inputText, isSending, selectedImages]);

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

  const handleCancel = useCallback(async () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await seekerClient.apiFetch(`/requests/${requestId}/status`, 'PATCH', {
              body: JSON.stringify({ status: 'pending' }),
            });

            if (response.ok) {
              seekerClient.cancelBooking(bookingId);
              Alert.alert('Cancelled', 'The booking has been cancelled.', [
                { text: 'OK', onPress: navigateToHome },
              ]);
            }
          } catch (error) {
            console.error('Failed to cancel booking:', error);
            Alert.alert('Error', 'Failed to cancel booking. Please try again.');
          }
        },
      },
    ]);
  }, [bookingId, navigateToHome, requestId]);

  return {
    messages,
    inputText,
    setInputText,
    isLoading,
    isSending,
    isTyping,
    selectedImages,
    selectedImage,
    setSelectedImage,
    currentUserId,
    flatListRef,
    handleSendMessage,
    handleLoadMore,
    handlePickImage,
    handleRemoveImage,
    handleCancel,
  };
}
