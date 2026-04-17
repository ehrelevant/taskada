import { ActivityIndicator, FlatList, Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, EmptyState, Header, ImageViewer, ScreenContainer, Typography } from '@repo/components';
import { Flag, Image as ImageIcon, Send, X } from 'lucide-react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import type { Message } from '@repo/shared';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingChat.styles';
import { useBookingChat } from './BookingChat.hooks';

function ChatHeaderCenter({
  avatarUrl,
  firstName,
  lastName,
  isTyping,
}: {
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  isTyping: boolean;
}) {
  const styles = createStyles(useTheme().colors);

  return (
    <View style={styles.headerCenter}>
      <Avatar source={avatarUrl ? { uri: avatarUrl } : null} name={`${firstName} ${lastName}`} size={36} />
      <View style={styles.headerCenterText}>
        <Typography variant="h5" weight="bold" numberOfLines={1}>
          {firstName} {lastName}
        </Typography>
        {isTyping && (
          <Typography variant="caption" color="textSecondary">
            Typing...
          </Typography>
        )}
      </View>
    </View>
  );
}

export function BookingChatScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const {
    otherUser,
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
    handleSendMessage,
    handleDecline,
    handleFinalize,
    handleLoadMore,
    handlePickImage,
    handleRemoveImage,
    handleReport,
  } = useBookingChat();

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
            <Typography variant="body2" color={isOwnMessage ? 'textInverse' : 'textPrimary'}>
              {item.message}
            </Typography>
          )}
          <Typography
            variant="caption"
            color={isOwnMessage ? 'textInverse' : 'textSecondary'}
            style={styles.messageTime}
          >
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <Header
        centerContent={
          <ChatHeaderCenter
            avatarUrl={otherUser.avatarUrl}
            firstName={otherUser.firstName}
            lastName={otherUser.lastName}
            isTyping={isTyping}
          />
        }
        rightContent={
          <TouchableOpacity onPress={handleReport}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
        style={styles.header}
      />

      <View style={styles.actionButtonsContainer}>
        <Button title="Decline" variant="outline" onPress={handleDecline} style={styles.actionButton} />
        <Button title="Finalize Cost & Details" onPress={handleFinalize} style={styles.actionButton} />
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <Typography variant="h3" color="textInverse">
              Service chat
            </Typography>
            <Typography variant="body2" color="textInverse">
              Confirm details, share photos, and finalize this booking with clear communication.
            </Typography>
          </View>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.emptyStateCard}>
              <EmptyState message="Start the conversation to align on service details." />
            </View>
          )
        }
        ListFooterComponent={isLoading ? <ActivityIndicator color={colors.actionPrimary} /> : null}
      />

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
    </ScreenContainer>
  );
}
