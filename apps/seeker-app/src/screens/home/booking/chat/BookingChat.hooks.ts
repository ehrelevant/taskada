import * as ImagePicker from 'expo-image-picker';
import { Alert, FlatList } from 'react-native';
import { authClient } from '@lib/authClient';
import { HomeStackParamList } from '@navigation/HomeStack';
import type { Message } from '@repo/shared';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type ChatRouteProp = RouteProp<HomeStackParamList, 'Chat'>;
type ChatNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Chat'>;

interface ChatScreenParams {
  bookingId: string;
  providerInfo: {
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
  const { bookingId, providerInfo, requestId } = route.params as ChatScreenParams;

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

  const loadMessages = useCallback(
    async (loadOffset = 0) => {
      try {
        const response = await seekerClient.apiFetch(
          `/bookings/${bookingId}/messages?limit=50&offset=${loadOffset}`,
          'GET',
        );
        if (response.ok) {
          const data = await response.json();
          if (loadOffset === 0) {
            setMessages(data.messages);
          } else {
            setMessages(prev => [...data.messages, ...prev]);
          }
          setHasMoreMessages(data.hasMore);
          setOffset(loadOffset + data.messages.length);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookingId],
  );

  useEffect(() => {
    if (session.data) {
      loadMessages(0);
    }
  }, [loadMessages, session.data]);

  useEffect(() => {
    if (!session.data) return;

    const setupSocket = async () => {
      if (!currentUserId) return;
      await seekerClient.connectChat(authClient.getCookie(), currentUserId, 'seeker');
      seekerClient.joinBooking(bookingId);

      seekerClient.onNewMessage(message => {
        setMessages(prev => [...prev, message]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      seekerClient.onTyping(data => {
        if (data.userId !== currentUserId) {
          setIsTyping(data.isTyping);
        }
      });

      seekerClient.onBookingDeclined(data => {
        if (data.bookingId === bookingId) {
          Alert.alert('Booking Declined', 'The provider has declined the booking.');
          navigation.goBack();
        }
      });

      seekerClient.onProposalSubmitted(data => {
        if (data.bookingId === bookingId) {
          navigation.navigate('ViewProposal', {
            bookingId,
            providerInfo,
            proposal: data.proposal,
            requestId,
          });
        }
      });
    };

    setupSocket();

    return () => {
      seekerClient.leaveBooking(bookingId);
      seekerClient.removeAllListeners();
      seekerClient.disconnectChat();
    };
  }, [bookingId, currentUserId, navigation, providerInfo, requestId, session.data]);

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

  const handleReport = useCallback(() => {
    navigation.navigate('Report', {
      bookingId,
      reportedUser: providerInfo,
    });
  }, [bookingId, navigation, providerInfo]);

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
    providerInfo,
    flatListRef,
    handleSendMessage,
    handleLoadMore,
    handlePickImage,
    handleRemoveImage,
    handleReport,
  };
}
