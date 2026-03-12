import { TextInput, TextInputRef, Button, Host, Text as ExpoText } from '@expo/ui/jetpack-compose';
import * as React from 'react';
import { Text } from 'react-native';

import { ScrollPage, Section } from '../../components/Page';

export default function TextInputScreen() {
  const [value, setValue] = React.useState<string>('');
  const textRef = React.useRef<TextInputRef>(null);
  const [isEmailValid, setIsEmailValid] = React.useState(true);

  return (
    <ScrollPage>
      <Section title="Current value">
        <Text>{JSON.stringify(value)}</Text>
      </Section>

      <Host matchContents>
        <Button
          onPress={async () => {
            textRef.current?.setText('Hello there!');
          }}>
          Set text
        </Button>
      </Host>

      {/* ---- Filled (default) ---- */}

      <Section title="Label and placeholder">
        <Host matchContents>
          <TextInput ref={textRef} onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Username</ExpoText>
            </TextInput.Label>
            <TextInput.Placeholder>
              <ExpoText>e.g. johndoe</ExpoText>
            </TextInput.Placeholder>
          </TextInput>
        </Host>
      </Section>

      <Section title="Leading and trailing icons">
        <Host matchContents>
          <TextInput onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Search</ExpoText>
            </TextInput.Label>
            <TextInput.LeadingIcon>
              <ExpoText>🔍</ExpoText>
            </TextInput.LeadingIcon>
            <TextInput.TrailingIcon>
              <ExpoText>✕</ExpoText>
            </TextInput.TrailingIcon>
          </TextInput>
        </Host>
      </Section>

      <Section title="Prefix and suffix">
        <Host matchContents>
          <TextInput keyboardType="decimal-pad" onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Amount</ExpoText>
            </TextInput.Label>
            <TextInput.Prefix>
              <ExpoText>€</ExpoText>
            </TextInput.Prefix>
            <TextInput.Suffix>
              <ExpoText>EUR</ExpoText>
            </TextInput.Suffix>
          </TextInput>
        </Host>
      </Section>

      <Section title="Error state with supporting text">
        <Host matchContents>
          <TextInput
            keyboardType="email-address"
            isError={!isEmailValid}
            onChangeText={(text) => {
              setValue(text);
              setIsEmailValid(text.length === 0 || text.includes('@'));
            }}>
            <TextInput.Label>
              <ExpoText>Email</ExpoText>
            </TextInput.Label>
            <TextInput.SupportingText>
              <ExpoText>
                {isEmailValid ? 'Enter your email address.' : 'Invalid email address.'}
              </ExpoText>
            </TextInput.SupportingText>
          </TextInput>
        </Host>
      </Section>

      <Section title="Disabled and read-only">
        <Host matchContents>
          <TextInput enabled={false} defaultValue="Disabled field" onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Disabled</ExpoText>
            </TextInput.Label>
          </TextInput>
          <TextInput readOnly defaultValue="Read-only field" onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Read-only</ExpoText>
            </TextInput.Label>
          </TextInput>
        </Host>
      </Section>

      <Section title="Custom colors">
        <Host matchContents>
          <TextInput
            onChangeText={setValue}
            colors={{
              focusedIndicatorColor: '#6200EE',
              unfocusedIndicatorColor: '#AAAAAA',
              focusedLabelColor: '#6200EE',
              unfocusedLabelColor: '#888888',
              cursorColor: '#6200EE',
            }}>
            <TextInput.Label>
              <ExpoText>Custom brand color</ExpoText>
            </TextInput.Label>
          </TextInput>
        </Host>
      </Section>

      <Section title="Multiline">
        <Host matchContents>
          <TextInput multiline numberOfLines={5} autocorrection={false} onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Notes</ExpoText>
            </TextInput.Label>
          </TextInput>
        </Host>
      </Section>

      <Section title="Phone number">
        <Host matchContents>
          <TextInput keyboardType="phone-pad" defaultValue="324342324" onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Phone</ExpoText>
            </TextInput.Label>
          </TextInput>
        </Host>
      </Section>

      <Section title="Capitalization">
        <Host matchContents>
          <TextInput autocorrection={false} autoCapitalize="characters" onChangeText={setValue}>
            <TextInput.Placeholder>
              <ExpoText>ALL CAPS</ExpoText>
            </TextInput.Placeholder>
          </TextInput>
          <TextInput autocorrection={false} autoCapitalize="words" onChangeText={setValue}>
            <TextInput.Placeholder>
              <ExpoText>Capitalize Words</ExpoText>
            </TextInput.Placeholder>
          </TextInput>
          <TextInput autocorrection={false} autoCapitalize="sentences" onChangeText={setValue}>
            <TextInput.Placeholder>
              <ExpoText>Capitalize sentences.</ExpoText>
            </TextInput.Placeholder>
          </TextInput>
        </Host>
      </Section>

      {/* ---- Outlined variant ---- */}

      <Section title="Outlined — label and placeholder">
        <Host matchContents>
          <TextInput.Outlined onChangeText={setValue}>
            <TextInput.Outlined.Label>
              <ExpoText>Full name</ExpoText>
            </TextInput.Outlined.Label>
            <TextInput.Outlined.Placeholder>
              <ExpoText>e.g. Jane Doe</ExpoText>
            </TextInput.Outlined.Placeholder>
          </TextInput.Outlined>
        </Host>
      </Section>

      <Section title="Outlined — prefix and suffix">
        <Host matchContents>
          <TextInput.Outlined keyboardType="decimal-pad" onChangeText={setValue}>
            <TextInput.Outlined.Label>
              <ExpoText>Amount</ExpoText>
            </TextInput.Outlined.Label>
            <TextInput.Outlined.Prefix>
              <ExpoText>$</ExpoText>
            </TextInput.Outlined.Prefix>
            <TextInput.Outlined.Suffix>
              <ExpoText>USD</ExpoText>
            </TextInput.Outlined.Suffix>
          </TextInput.Outlined>
        </Host>
      </Section>

      <Section title="Outlined — error state">
        <Host matchContents>
          <TextInput.Outlined
            keyboardType="email-address"
            isError={!isEmailValid}
            onChangeText={(text) => {
              setValue(text);
              setIsEmailValid(text.length === 0 || text.includes('@'));
            }}>
            <TextInput.Outlined.Label>
              <ExpoText>Email</ExpoText>
            </TextInput.Outlined.Label>
            <TextInput.Outlined.SupportingText>
              <ExpoText>
                {isEmailValid ? 'We will send a confirmation here.' : 'Enter a valid email address.'}
              </ExpoText>
            </TextInput.Outlined.SupportingText>
          </TextInput.Outlined>
        </Host>
      </Section>
    </ScrollPage>
  );
}

TextInputScreen.navigationOptions = {
  title: 'TextInput',
};
