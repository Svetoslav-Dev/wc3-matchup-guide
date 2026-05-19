import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";
import { MobileNav } from "./mobile-nav";
import { colors } from "../lib/theme";

type Props = {
  children: ReactNode;
};

export function ScreenShell({ children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <MobileNav />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  inner: {
    padding: 20,
    gap: 16,
  },
});
