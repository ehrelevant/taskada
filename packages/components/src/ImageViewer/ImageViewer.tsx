import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { spacing, useTheme } from '@repo/theme';
import { X } from 'lucide-react-native';

export interface ImageViewerProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

export function ImageViewer({ visible, imageUri, onClose }: ImageViewerProps) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay.dark }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <X size={28} color={colors.white} />
        </TouchableOpacity>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xl + spacing.l,
    right: spacing.m,
    zIndex: 1,
    padding: spacing.s,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
