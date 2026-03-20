import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { authClient } from '@lib/authClient';
import { FlatList } from 'react-native';
import type { Message } from '@repo/shared';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';

type ChatRouteProp = RouteProp<RequestsStackParamList, 'Chat'>;
type ChatNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'Chat'>;

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

interface UseBookingChatReturn {
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  isSending: boolean;
  isTyping: boolean;
  hasMoreMessages: boolean;
  selectedImages: string[];
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  currentUserId: string | undefined;
  handleSendMessage: () => Promise<void>;
  handleDecline: () => Promise<void>;
  handleFinalize: () => void;
  handleLoadMore: () => void;
  handlePickImage: () => Promise<void>;
  handleRemoveImage: (index: number) => void;
}

export function useBookingChat(): UseBookingChatReturn {
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

  const loadMessages = useCallback(
    async (loadOffset = 0) => {
      try {
        const response = await providerClient.apiFetch(
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
      await providerClient.connectChat(authClient.getCookie(), currentUserId, 'provider');
      providerClient.joinBooking(bookingId);

      providerClient.onNewMessage(message => {
        setMessages(prev => [...prev, message]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      providerClient.onTyping(data => {
        if (data.userId !== currentUserId) {
          setIsTyping(data.isTyping);
        }
      });

      providerClient.onBookingDeclined(data => {
        if (data.bookingId === bookingId) {
          navigation.replace('RequestList');
        }
      });
    };

    setupSocket();

    return () => {
      providerClient.leaveBooking(bookingId);
      providerClient.removeAllListeners();
      providerClient.disconnectChat();
    };
  }, [bookingId, currentUserId, navigation, session.data]);

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
    try {
      const response = await providerClient.apiFetch(`/requests/${requestId}/status`, 'PATCH', {
        body: JSON.stringify({ status: 'pending' }),
      });

      if (response.ok) {
        providerClient.declineBooking(bookingId, requestId);
        navigation.replace('RequestList');
      }
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  }, [bookingId, navigation, requestId]);

  const handleFinalize = useCallback(() => {
    navigation.navigate('FinalizeDetails', {
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
  };
}
