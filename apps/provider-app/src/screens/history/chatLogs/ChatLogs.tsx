import { ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Flag } from 'lucide-react-native';
import { Header, ImageViewer, Typography } from '@repo/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@repo/theme';

import { createStyles } from './ChatLogs.styles';
import { Message, useChatLogs } from './ChatLogs.hooks';

export function ChatLogsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { messages, isLoading, error, selectedImage, setSelectedImage, otherUser, handleGoBack, handleReport } =
    useChatLogs();

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
      <Header
        title={`${otherUser.firstName} ${otherUser.lastName}`}
        subtitle="Chat History"
        size="small"
        leftContent={
          <TouchableOpacity onPress={handleGoBack}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity onPress={handleReport}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

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
