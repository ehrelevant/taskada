import { EmptyState, Header, ImageViewer, ScreenContainer, Typography } from '@repo/components';
import { Flag } from 'lucide-react-native';
import { FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './ChatLogs.styles';
import { useChatLogs } from './ChatLogs.hooks';

export function ChatLogsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { messages, isLoading, error, otherUser, selectedImage, setSelectedImage, handleGoBack, handleReport } =
    useChatLogs();

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
    <ScreenContainer padding="none">
      <Header
        title={`${otherUser.firstName} ${otherUser.lastName}`}
        subtitle="Chat History"
        size="small"
        onBack={handleGoBack}
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={messages}
        renderItem={({ item }) => {
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
