import { EmptyState, ImageViewer, ScreenContainer, Typography } from '@repo/components';
import { FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './ChatLogs.styles';
import { useChatLogs } from './ChatLogs.hooks';

export function ChatLogsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { messages, isLoading, error, otherUser, selectedImage, setSelectedImage } = useChatLogs();

  if (isLoading) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading chat history..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <EmptyState message={error} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['left', 'right']} padding="none">
      <FlatList
        data={messages}
        renderItem={({ item }) => {
          const isOtherUser = item.userId === otherUser.id;

          return (
            <View style={[styles.messageRow, isOtherUser ? styles.rowStart : styles.rowEnd]}>
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
                  <Typography variant="body2" color={isOtherUser ? 'textPrimary' : 'textInverse'}>
                    {item.message}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color={isOtherUser ? 'textSecondary' : 'textInverse'}
                  style={styles.messageTime}
                >
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </View>
            </View>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <Typography variant="h3" color="textInverse">
              Conversation log
            </Typography>
            <Typography variant="body2" color="textInverse">
              Review the full chat timeline and any shared image evidence.
            </Typography>
          </View>
        }
        ListEmptyComponent={<EmptyState message="No messages in this conversation" />}
      />

      <ImageViewer
        visible={selectedImage !== null}
        imageUri={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
    </ScreenContainer>
  );
}
