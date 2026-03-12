import {
  TextInput,
  TextInputRef,
  Button,
  Host,
  Icon,
  IconButton,
  Text as ExpoText,
} from '@expo/ui/jetpack-compose';
import * as React from 'react';
import { Text } from 'react-native';

import { ScrollPage, Section } from '../../components/Page';

const searchIcon = require('../../../assets/icons/search.xml');
const closeIcon = require('../../../assets/icons/close.xml');
const visibilityIcon = require('../../../assets/icons/visibility.xml');
const visibilityOffIcon = require('../../../assets/icons/visibility_off.xml');

export default function TextInputScreen() {
  const [value, setValue] = React.useState<string>('');
  const textRef = React.useRef<TextInputRef>(null);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [secure, setSecure] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

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
          Set text imperatively
        </Button>
      </Host>

      {/* ---- Filled (default) ---- */}

      <Section title="Label and placeholder">
        <Host matchContents>
          {/* Per M3 spec: use a label to identify the field; use placeholder only for
              additional hints alongside a label, not as a substitute for it. */}
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
          {/* Leading icon: decorative, communicates field purpose.
              Trailing icon: interactive action — use IconButton per M3 spec. */}
          <TextInput
            onChangeText={(text) => {
              setValue(text);
              setSearchQuery(text);
            }}>
            <TextInput.Label>
              <ExpoText>Search</ExpoText>
            </TextInput.Label>
            <TextInput.LeadingIcon>
              <Icon source={searchIcon} size={24} contentDescription="Search" />
            </TextInput.LeadingIcon>
            {searchQuery.length > 0 && (
              <TextInput.TrailingIcon>
                <IconButton onPress={() => setSearchQuery('')}>
                  <Icon source={closeIcon} size={24} contentDescription="Clear" />
                </IconButton>
              </TextInput.TrailingIcon>
            )}
          </TextInput>
        </Host>
      </Section>

      <Section title="Password field with show/hide toggle">
        <Host matchContents>
          {/* secureTextEntry applies PasswordVisualTransformation (bullet masking).
              Toggle it via the trailing IconButton to show/hide the password. */}
          <TextInput secureTextEntry={secure} onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Password</ExpoText>
            </TextInput.Label>
            <TextInput.TrailingIcon>
              <IconButton onPress={() => setSecure((v) => !v)}>
                <Icon
                  source={secure ? visibilityOffIcon : visibilityIcon}
                  size={24}
                  contentDescription={secure ? 'Show password' : 'Hide password'}
                />
              </IconButton>
            </TextInput.TrailingIcon>
          </TextInput>
        </Host>
      </Section>

      <Section title="Prefix and suffix">
        <Host matchContents>
          {/* Prefix/suffix are rendered inside the text area, flanking the typed text. */}
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
          {/* isError tints the indicator, label, and supporting text in the error color.
              The supporting text message should change to describe the error. */}
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
          <TextInput enabled={false} defaultValue="Not interactive" onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Disabled</ExpoText>
            </TextInput.Label>
          </TextInput>
          <TextInput readOnly defaultValue="Selectable but not editable" onChangeText={setValue}>
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

      <Section title="Capitalization">
        <Host matchContents>
          <TextInput autocorrection={false} autoCapitalize="characters" onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Characters</ExpoText>
            </TextInput.Label>
            <TextInput.Placeholder>
              <ExpoText>ALL CAPS</ExpoText>
            </TextInput.Placeholder>
          </TextInput>
          <TextInput autocorrection={false} autoCapitalize="words" onChangeText={setValue}>
            <TextInput.Label>
              <ExpoText>Words</ExpoText>
            </TextInput.Label>
            <TextInput.Placeholder>
              <ExpoText>Capitalize Every Word</ExpoText>
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

      <Section title="Outlined — leading icon + error state">
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
            <TextInput.Outlined.LeadingIcon>
              <Icon source={searchIcon} size={24} contentDescription="Email" />
            </TextInput.Outlined.LeadingIcon>
            <TextInput.Outlined.SupportingText>
              <ExpoText>
                {isEmailValid
                  ? 'We will send a confirmation here.'
                  : 'Enter a valid email address.'}
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
