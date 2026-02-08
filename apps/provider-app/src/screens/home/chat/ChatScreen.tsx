import { ActivityIndicator, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { Button, Typography } from '@repo/components';
import { chatSocket, Message } from '@lib/chatSocket';
import { colors, spacing } from '@repo/theme';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
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
      await chatSocket.connect(currentUserId, 'provider');
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
          // Navigate back to request list
          navigation.replace('RequestList');
        }
      });
    };

    setupSocket();

    return () => {
      chatSocket.leaveBooking(bookingId);
      chatSocket.removeAllListeners();
      chatSocket.disconnect();
    };
  }, [bookingId, currentUserId, navigation, session.data]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      // Send via WebSocket for real-time delivery
      chatSocket.sendMessage(bookingId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDecline = async () => {
    try {
      // Update request status back to pending
      const response = await apiFetch(`/requests/${requestId}/status`, 'PATCH', {
        body: JSON.stringify({ status: 'pending' }),
      });

      if (response.ok) {
        // Notify seeker via WebSocket
        chatSocket.declineBooking(bookingId, requestId);
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

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.userId === currentUserId;

    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        {!isOwnMessage && item.sender.avatarUrl && (
          <Image source={{ uri: item.sender.avatarUrl }} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
          <Typography variant="body2" color={isOwnMessage ? colors.textInverse : colors.textPrimary}>
            {item.message}
          </Typography>
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
        {otherUser.avatarUrl && <Image source={{ uri: otherUser.avatarUrl }} style={styles.headerAvatar} />}
        <View style={styles.headerInfo}>
          <Typography variant="h6" numberOfLines={1}>
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

        <View style={styles.inputContainer}>
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
            disabled={!inputText.trim() || isSending}
            style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
          >
            <Send size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardStickyView>
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
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.s,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: spacing.s,
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
    fontSize: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: spacing.m,
    gap: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  declineButton: {
    flex: 1,
  },
  finalizeButton: {
    flex: 2,
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
