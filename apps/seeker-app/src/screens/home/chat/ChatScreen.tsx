import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiFetch, uploadMessageImages } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { Avatar, ImageViewer, Typography } from '@repo/components';
import { chatSocket, Message } from '@lib/chatSocket';
import { colors, spacing } from '@repo/theme';
import { HomeStackParamList } from '@navigation/HomeStack';
import { Image as ImageIcon, Send, X } from 'lucide-react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useRef, useState } from 'react';

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

export function ChatScreen() {
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

  // Load messages
  const loadMessages = useCallback(
    async (loadOffset = 0) => {
      try {
        const response = await apiFetch(`/bookings/${bookingId}/messages?limit=50&offset=${loadOffset}`, 'GET');
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
      await chatSocket.connect(currentUserId, 'seeker');
      chatSocket.joinBooking(bookingId);

      chatSocket.onNewMessage(message => {
        setMessages(prev => [...prev, message]);
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      chatSocket.onTyping(data => {
        if (data.userId !== currentUserId) {
          setIsTyping(data.isTyping);
        }
      });

      chatSocket.onBookingDeclined(data => {
        if (data.bookingId === bookingId) {
          // Navigate back to standby screen
          navigation.replace('Standby', { requestId });
        }
      });

      chatSocket.onProposalSubmitted(data => {
        if (data.bookingId === bookingId) {
          // Navigate to ViewProposal screen
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
      chatSocket.leaveBooking(bookingId);
      chatSocket.removeAllListeners();
      chatSocket.disconnect();
    };
  }, [bookingId, currentUserId, navigation, providerInfo, requestId, session.data]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && selectedImages.length === 0) || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      let imageKeys: string[] = [];

      if (selectedImages.length > 0) {
        imageKeys = await uploadMessageImages(bookingId, selectedImages);
        setSelectedImages([]);
      }

      chatSocket.sendMessage(bookingId, messageText, imageKeys);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
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
          source={providerInfo.avatarUrl ? { uri: providerInfo.avatarUrl } : null}
          name={`${providerInfo.firstName} ${providerInfo.lastName}`}
          size={56}
        />
        <View style={styles.headerInfo}>
          <Typography variant="h5" weight="bold" numberOfLines={1}>
            {providerInfo.firstName} {providerInfo.lastName}
          </Typography>
          {isTyping && (
            <Typography variant="caption" color={colors.textPrimary}>
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

      {/* Input Area - Sticky to Keyboard */}
      <KeyboardStickyView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.s,
  },
  headerInfo: {
    marginLeft: spacing.m,
    flex: 1,
  },
  messagesList: {
    padding: spacing.m,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.m,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-start',
  },
  otherMessage: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.s,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: spacing.m,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: colors.actionPrimary,
    borderBottomLeftRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.actionSecondary,
    borderBottomRightRadius: 4,
  },
  messageTime: {
    marginTop: spacing.xs,
  },
  imageContainer: {
    marginBottom: spacing.xs,
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: spacing.xs,
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    maxHeight: 100,
  },
  selectedImageWrapper: {
    marginRight: spacing.s,
    position: 'relative',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error.base,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButton: {
    padding: spacing.s,
    marginRight: spacing.s,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    maxHeight: 100,
    color: colors.textPrimary,
  },
  sendButton: {
    marginLeft: spacing.m,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.actionPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.actionDisabled,
  },
});
