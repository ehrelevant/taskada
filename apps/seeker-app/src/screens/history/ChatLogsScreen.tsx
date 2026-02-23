import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing } from '@repo/theme';
import { ImageViewer, Typography } from '@repo/components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useEffect, useState } from 'react';

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

export function ChatLogsScreen() {
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
      const response = await apiFetch(`/bookings/${bookingId}/chat-logs`, 'GET');

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOtherUser = item.userId === otherUser.id;

    return (
      <View style={[styles.messageContainer, isOtherUser ? styles.otherMessage : styles.ownMessage]}>
        {isOtherUser && item.sender.avatarUrl && (
          <Image source={{ uri: item.sender.avatarUrl }} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isOtherUser ? styles.otherBubble : styles.ownBubble]}>
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
            <Typography variant="body2" color={isOtherUser ? colors.textPrimary : colors.textInverse}>
              {item.message}
            </Typography>
          )}
          <Typography
            variant="caption"
            color={isOtherUser ? colors.textSecondary : colors.textInverse}
            style={styles.messageTime}
          >
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
          <Typography variant="body1" style={styles.loadingText}>
            Loading chat history...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Typography variant="h6" numberOfLines={1}>
            {otherUser.firstName} {otherUser.lastName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Chat History
          </Typography>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body1" color="textSecondary">
              No messages in this conversation
            </Typography>
          </View>
        }
      />

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
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.m,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
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
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
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
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.actionSecondary,
    borderBottomLeftRadius: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});
