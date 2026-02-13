import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { HelpProvider } from '@/providers/HelpProvider';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { verifyInstallation } from 'nativewind';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorDialogProvider } from '@/providers/ErrorDialogProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  verifyInstallation();
  const { colorScheme } = useColorScheme();
  const queryClient = new QueryClient();


  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <ErrorDialogProvider>
          <HelpProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack />
            <PortalHost />
          </HelpProvider>
        </ErrorDialogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
