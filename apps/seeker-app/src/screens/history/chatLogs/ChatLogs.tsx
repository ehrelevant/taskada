import { ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '@repo/theme';
import { ImageViewer, Typography } from '@repo/components';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './ChatLogs.styles';
import { useChatLogs } from './ChatLogs.hooks';

export function ChatLogsScreen() {
  const { messages, isLoading, error, otherUser, selectedImage, setSelectedImage, handleGoBack } = useChatLogs();

  const renderMessage = ({
    item,
  }: {
    item: {
      id: string;
      userId: string;
      message: string | null;
      createdAt: string;
      sender: { avatarUrl: string | null };
      imageUrls: string[];
    };
  }) => {
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
