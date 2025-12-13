import { Button, Typography } from '@repo/components';
import { colors, radius, shadows } from '@repo/theme';
import { FlatList, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';

type Service = {
  id: string;
  title: string;
  description?: string;
  price?: string;
  enabled?: boolean;
};

const SAMPLE_SERVICES: Service[] = [
  { id: '1', title: 'Car Mechanic', description: 'Cost starts at Php 420.00', price: '420', enabled: false },
  { id: '2', title: 'Plumbing', description: 'Cost starts at Php 240.00', price: '240', enabled: true },
  { id: '3', title: 'Carpentry', description: 'Cost starts at Php 340.00', price: '340', enabled: true },
];

export function ServiceListScreen() {
  const [services, setServices] = useState<Service[]>(SAMPLE_SERVICES);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');

  function onAddService() {
    if (!formTitle.trim()) return;
    const newService: Service = {
      id: String(Date.now()),
      title: formTitle.trim(),
      price: formPrice.trim(),
      description: formDescription.trim(),
      enabled: false,
    };
    setServices((s) => [newService, ...s]);
    setFormTitle('');
    setFormPrice('');
    setFormDescription('');
    setIsAddOpen(false);
  }

  const toggleServiceEnabled = (id: string) => {
    setServices((list) => list.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const ServiceCard = ({ item: service }: { item: Service }) => {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            {/* NOTE: Placeholder icon; replace with real icon later */}
            <Typography weight="bold" style={styles.iconText}>
              {service.title.slice(0, 1)}
            </Typography>
          </View>

          <View style={styles.info}>
            <Typography weight="bold" style={styles.cardTitle}>
              {service.title}
            </Typography>
            {service.description ? (
              <Typography style={styles.cardDesc} numberOfLines={2}>
                {service.description}
              </Typography>
            ) : null}
          </View>
        </View>

        <View style={styles.cardButtons}>
          <TouchableOpacity style={[styles.toggle, service.enabled ? styles.toggleEnabled : styles.toggleDisabled]} onPress={() => toggleServiceEnabled(service.id)}>
            <Typography style={service.enabled ? styles.toggleTextEnabled : styles.toggleTextDisabled}>
              {service.enabled ? 'Disable Getting Requests' : 'Allow Getting Requests'}
            </Typography>
          </TouchableOpacity>

          <Button title="View Details" onPress={() => { /* TODO: Add navigation to details screen */ }} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={ServiceCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddOpen(true)}>
        <View style={styles.addButtonInner}>
          <Plus size={32} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Add Service Modal */}
      <Modal visible={isAddOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <KeyboardAwareScrollView contentContainerStyle={styles.modalContent}>
              <Typography weight="bold" style={styles.modalTitle}>
                Add Service
              </Typography>

              <Typography style={styles.label}>Service Title</Typography>
              <TextInput
                value={formTitle}
                onChangeText={setFormTitle}
                placeholder="e.g. Plumbing"
                style={styles.input}
                placeholderTextColor="#999"
              />

              <Typography style={styles.label}>Initial Cost</Typography>
              <TextInput
                keyboardType="numeric"
                value={formPrice}
                onChangeText={setFormPrice}
                placeholder="Cost (ie. 320.00)"
                style={styles.input}
                placeholderTextColor="#999"
              />

              <Typography style={styles.label}>Description</Typography>
              <TextInput
                value={formDescription}
                onChangeText={setFormDescription}
                placeholder="A short description for the service"
                style={[styles.input, styles.textArea]}
                multiline
                placeholderTextColor="#999"
              />

              <Button title="Add this Service" onPress={onAddService} />
              <TouchableOpacity onPress={() => setIsAddOpen(false)} style={styles.modalClose}>
                <Typography>Close</Typography>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary ?? '#f7f7f7',
  },
  listContent: {
    padding: 8,
    paddingBottom: 80,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    ...shadows.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
  },
  cardDesc: {
    marginTop: 6,
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },
  cardButtons: {
    marginTop: 14,
  },
  toggle: {
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  toggleEnabled: {
    borderWidth: 1,
    borderColor: colors.border ?? '#333',
    backgroundColor: 'transparent',
  },
  toggleDisabled: {
    borderWidth: 1,
    borderColor: '#2e7d32',
    backgroundColor: 'transparent',
  },
  toggleTextEnabled: {
    color: '#666',
  },
  toggleTextDisabled: {
    color: '#2e7d32',
  },

  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  addButtonInner: {
    width: 64,
    height: 64,
    borderRadius: radius.l,
    backgroundColor: colors.actionPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.m,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface ?? '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 6,
    color: '#666',
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background ?? '#fafafa',
    borderWidth: 1,
    borderColor: colors.border ?? '#e3e3e3',
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalClose: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
