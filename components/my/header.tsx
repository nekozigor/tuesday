import { Link, Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cssInterop, useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native';
import { useHelp } from '@/providers/HelpProvider';

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

export default function Header({ title }: { title?: string }) {
    const SCREEN_OPTIONS = {
        title: title ?? '',
        headerTransparent: false,
        // SafeAreaView: SafeAreaView,
        // headerStyle: { backgroundColor: 'var(--card)' },
        // headerTitleStyle: { color: 'var(--text)' },
        headerRight: () => <ThemeToggle />,
    };

    return (
        <Stack.Screen options={SCREEN_OPTIONS} />
    );
}

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { isHelpCalled, setIsHelpCalled } = useHelp();

  cssInterop(FontAwesome5, {
      className: {
          target: "style",
          nativeStyleToProp: { color: "color" },
      },
  })  

  return (<SafeAreaView style={{flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'center'}}>
    <TouchableOpacity onPress={() => setIsHelpCalled(!isHelpCalled)}>
      <FontAwesome5 name="question-circle" size={24} className="color-[--question-blue]" />
    </TouchableOpacity>
    <Button
      style={{position: 'relative', right: 10}}
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  </SafeAreaView>);
}