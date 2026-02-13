import { Button } from "@/components/ui/button";
import { Stack } from "expo-router";
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';

const LOGO = {
    light: require('@/assets/images/react-native-reusables-light.png'),
    dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
    title: '',
    headerTransparent: true,
    headerRight: () => <ThemeToggle />,
};

const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
};

export default function Layout() {
    return (<>
        <Stack.Screen options={SCREEN_OPTIONS} />
        <Stack />
    </>)
}

function ThemeToggle() {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <Button
            onPressIn={toggleColorScheme}
            size="icon"
            variant="ghost"
            className="ios:size-9 rounded-full web:mx-4">
            <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
        </Button>
    );
}