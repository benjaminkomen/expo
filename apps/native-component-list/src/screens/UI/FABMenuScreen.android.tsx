import { FABMenu, Host } from '@expo/ui/jetpack-compose';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Page, Section } from '../../components/Page';

const ADD_ICON = require('../../../assets/icons/ui/add.xml');
const CAMERA_ICON = require('../../../assets/icons/ui/camera.xml');
const EDIT_ICON = require('../../../assets/icons/ui/edit.xml');
const SHARE_ICON = require('../../../assets/icons/ui/share.xml');

function DemoContainer({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.demoContainer}>
      <Text style={styles.placeholderText}>Content area</Text>
      {/* Host fills the container so the FABMenu positions its FAB at the bottom-right. */}
      <Host style={StyleSheet.absoluteFillObject}>{children}</Host>
    </View>
  );
}

export default function FABMenuScreen() {
  // Controlled open state for the second demo
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Page>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── 1. Uncontrolled (default primary variant) ─────────────────── */}
        <Section title="Uncontrolled (primary)">
          <Text style={styles.description}>
            Tap the FAB to expand the speed-dial. State is managed internally.
          </Text>
          <DemoContainer>
            <FABMenu icon={ADD_ICON}>
              <FABMenu.Item
                icon={CAMERA_ICON}
                label="Photo"
                onPress={() => Alert.alert('FABMenu', 'Photo tapped')}
              />
              <FABMenu.Item
                icon={EDIT_ICON}
                label="Write"
                onPress={() => Alert.alert('FABMenu', 'Write tapped')}
              />
              <FABMenu.Item
                icon={SHARE_ICON}
                label="Share"
                onPress={() => Alert.alert('FABMenu', 'Share tapped')}
              />
            </FABMenu>
          </DemoContainer>
        </Section>

        {/* ── 2. Controlled ──────────────────────────────────────────────── */}
        <Section title="Controlled">
          <Text style={styles.description}>
            The open state is owned by React. Status:{' '}
            <Text style={styles.bold}>{controlledOpen ? 'Open' : 'Closed'}</Text>
          </Text>
          <DemoContainer>
            <FABMenu
              icon={ADD_ICON}
              open={controlledOpen}
              onOpenChange={(open) => {
                setControlledOpen(open);
              }}>
              <FABMenu.Item
                icon={CAMERA_ICON}
                label="Camera"
                onPress={() => Alert.alert('FABMenu', 'Camera tapped')}
              />
              <FABMenu.Item
                icon={EDIT_ICON}
                label="Edit"
                onPress={() => Alert.alert('FABMenu', 'Edit tapped')}
              />
            </FABMenu>
          </DemoContainer>
        </Section>

        {/* ── 3. Variants ────────────────────────────────────────────────── */}
        <Section title="Variants">
          <Text style={styles.description}>
            The four Material 3 container colour roles: primary (default), secondary, tertiary, and
            surface.
          </Text>

          <View style={styles.variantsRow}>
            {(['primary', 'secondary', 'tertiary', 'surface'] as const).map((variant) => (
              <View key={variant} style={styles.variantCell}>
                <Text style={styles.variantLabel}>{variant}</Text>
                <View style={styles.smallContainer}>
                  <Host style={StyleSheet.absoluteFillObject}>
                    <FABMenu icon={ADD_ICON} variant={variant}>
                      <FABMenu.Item icon={EDIT_ICON} label="Edit" onPress={() => {}} />
                      <FABMenu.Item icon={CAMERA_ICON} label="Photo" onPress={() => {}} />
                    </FABMenu>
                  </Host>
                </View>
              </View>
            ))}
          </View>
        </Section>

        {/* ── 4. Items without labels ────────────────────────────────────── */}
        <Section title="Items without labels">
          <Text style={styles.description}>
            Omit the `label` prop on FABMenu.Item for a compact icon-only layout.
          </Text>
          <DemoContainer>
            <FABMenu icon={ADD_ICON} variant="secondary">
              <FABMenu.Item icon={CAMERA_ICON} onPress={() => Alert.alert('FABMenu', 'Camera')} />
              <FABMenu.Item icon={EDIT_ICON} onPress={() => Alert.alert('FABMenu', 'Edit')} />
              <FABMenu.Item icon={SHARE_ICON} onPress={() => Alert.alert('FABMenu', 'Share')} />
            </FABMenu>
          </DemoContainer>
        </Section>
      </ScrollView>
    </Page>
  );
}

FABMenuScreen.navigationOptions = {
  title: 'FABMenu (Speed Dial)',
};

const styles = StyleSheet.create({
  demoContainer: {
    height: 220,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
  },
  variantsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  variantCell: {
    flex: 1,
    minWidth: 130,
    alignItems: 'center',
  },
  variantLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  smallContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
