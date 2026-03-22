import { Image, Modal, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';
import { X } from 'lucide-react-native';

import { styles } from './ImageViewer.styles';

type Props = {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
};

export function ImageViewer({ visible, imageUri, onClose }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <X size={28} color={colors.white} />
        </TouchableOpacity>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      </View>
    </Modal>
  );
}
