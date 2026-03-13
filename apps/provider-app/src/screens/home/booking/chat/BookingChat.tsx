import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { authClient } from '@lib/authClient';
import { Avatar, Button, ImageViewer, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { Image as ImageIcon, Send, X } from 'lucide-react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import type { Message } from '@repo/shared';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useRef, useState } from 'react';

import { styles } from './BookingChat.styles';

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

export function ChatScreen() {
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

  // Load messages
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

  // Initial load
  useEffect(() => {
    if (session.data) {
      loadMessages(0);
    }
  }, [loadMessages, session.data]);

  // Setup WebSocket
  useEffect(() => {
    if (!session.data) return;

    // Connect socket
    const setupSocket = async () => {
      if (!currentUserId) return;
      await providerClient.connectChat(authClient.getCookie(), currentUserId, 'provider');
      providerClient.joinBooking(bookingId);

      providerClient.onNewMessage(message => {
        setMessages(prev => [...prev, message]);
        // Scroll to bottom
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
          // Navigate back to request list
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

  const handleSendMessage = async () => {
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
  };

  const handleDecline = async () => {
    try {
      // Update request status back to pending
      const response = await providerClient.apiFetch(`/requests/${requestId}/status`, 'PATCH', {
        body: JSON.stringify({ status: 'pending' }),
      });

      if (response.ok) {
        // Notify seeker via WebSocket
        providerClient.declineBooking(bookingId, requestId);
        // Navigate back to request list
        navigation.replace('RequestList');
      }
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  };

  const handleFinalize = () => {
    navigation.navigate('FinalizeDetails', {
      bookingId,
      seekerLocation: address,
      otherUser,
      requestId,
    });
  };

  const handleLoadMore = () => {
    if (hasMoreMessages && !isLoading) {
      loadMessages(offset);
    }
  };

  const handlePickImage = async () => {
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
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.userId === currentUserId;

    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        {!isOwnMessage && item.sender.avatarUrl && (
          <Image source={{ uri: item.sender.avatarUrl }} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
          {item.imageUrls && item.imageUrls.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
              {item.imageUrls.map((imageUrl, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImage(imageUrl)}>
                  <Image source={{ uri: imageUrl }} style={styles.messageImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {item.message && (
            <Typography variant="body2" color={isOwnMessage ? colors.textInverse : colors.textPrimary}>
              {item.message}
            </Typography>
          )}
          <Typography
            variant="caption"
            color={isOwnMessage ? colors.textInverse : colors.textPrimary}
            style={styles.messageTime}
          >
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar
          source={otherUser.avatarUrl ? { uri: otherUser.avatarUrl } : null}
          name={`${otherUser.firstName} ${otherUser.lastName}`}
          size={56}
        />
        <View style={styles.headerInfo}>
          <Typography variant="h5" weight="bold" numberOfLines={1}>
            {otherUser.firstName} {otherUser.lastName}
          </Typography>
          {isTyping && (
            <Typography variant="caption" color={colors.textSecondary}>
              Typing...
            </Typography>
          )}
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <ActivityIndicator color={colors.actionPrimary} /> : null}
      />

      {/* Provider Action Buttons + Input - Sticky to Keyboard */}
      <KeyboardStickyView>
        <View style={styles.actionButtonsContainer}>
          <Button title="Decline" variant="outline" onPress={handleDecline} style={styles.declineButton} />
          <Button title="Finalize Cost & Details" onPress={handleFinalize} style={styles.finalizeButton} />
        </View>

        {selectedImages.length > 0 && (
          <ScrollView horizontal style={styles.selectedImagesContainer} showsHorizontalScrollIndicator={false}>
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.selectedImageWrapper}>
                <Image source={{ uri }} style={styles.selectedImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                  <X size={16} color={colors.textInverse} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.imagePickerButton}
            disabled={selectedImages.length >= 4}
          >
            <ImageIcon size={20} color={selectedImages.length >= 4 ? colors.actionDisabled : colors.actionPrimary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={(!inputText.trim() && selectedImages.length === 0) || isSending}
            style={[
              styles.sendButton,
              ((!inputText.trim() && selectedImages.length === 0) || isSending) && styles.sendButtonDisabled,
            ]}
          >
            <Send size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardStickyView>

      <ImageViewer
        visible={selectedImage !== null}
        imageUri={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
    </SafeAreaView>
  );
}
