import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../components/screen-shell";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../components/mobile-ui";
import { useAuth } from "../lib/auth-context";
import { colors } from "../lib/theme";

export default function ProfileScreen() {
  const { apiReady, initializing, login, logout, register, user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        await login({ email, password });
        setSuccess("Signed in.");
      } else {
        await register({ email, username, password });
        setSuccess("Account created.");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenShell>
      <SectionLabel>Profile</SectionLabel>
      <PageTitle>Account access on the same API.</PageTitle>
      <PageIntro>
        Mobile auth now uses the live Next.js endpoints. This first pass keeps the token in memory for the current app session.
      </PageIntro>
      {!apiReady ? (
        <View style={styles.panel}>
          <GhostBadge>API offline</GhostBadge>
          <Text style={styles.heading}>Set `EXPO_PUBLIC_API_URL` to enable mobile auth.</Text>
          <Text style={styles.copy}>
            Point it at the deployed or local web API, for example `http://localhost:3000/api`.
          </Text>
        </View>
      ) : null}
      {initializing ? (
        <View style={styles.panel}>
          <Text style={styles.copy}>Loading session state…</Text>
        </View>
      ) : null}
      {user ? (
        <View style={styles.panel}>
          <GhostBadge>{user.role}</GhostBadge>
          <Text style={styles.heading}>{user.username}</Text>
          <Text style={styles.copy}>{user.email}</Text>
          <Pressable style={styles.secondaryButton} onPress={logout}>
            <Text style={styles.secondaryButtonText}>Log out</Text>
          </Pressable>
        </View>
      ) : null}
      {!user && apiReady ? (
        <View style={styles.panel}>
          <View style={styles.modeRow}>
            <Pressable
              style={[styles.tabButton, mode === "login" ? styles.tabButtonActive : null]}
              onPress={() => setMode("login")}
            >
              <Text style={[styles.tabText, mode === "login" ? styles.tabTextActive : null]}>
                Log In
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabButton, mode === "register" ? styles.tabButtonActive : null]}
              onPress={() => setMode("register")}
            >
              <Text style={[styles.tabText, mode === "register" ? styles.tabTextActive : null]}>
                Register
              </Text>
            </Pressable>
          </View>
          {error ? (
            <View style={[styles.notice, styles.noticeError]}>
              <Text style={styles.noticeText}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={[styles.notice, styles.noticeSuccess]}>
              <Text style={styles.noticeText}>{success}</Text>
            </View>
          ) : null}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="user@example.com"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={email}
            />
          </View>
          {mode === "register" ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Username</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setUsername}
                placeholder="ladder-scout"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={username}
              />
            </View>
          ) : null}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="demo123"
              placeholderTextColor={colors.muted}
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>
          <Pressable
            disabled={submitting}
            onPress={submit}
            style={[styles.primaryButton, submitting ? styles.primaryButtonDisabled : null]}
          >
            <Text style={styles.primaryButtonText}>
              {submitting ? "Submitting…" : mode === "login" ? "Log in" : "Create account"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  heading: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  copy: {
    color: colors.muted,
    lineHeight: 22,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  tabButton: {
    flex: 1,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: colors.bgSoft,
  },
  tabButtonActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  tabText: {
    color: colors.muted,
    fontWeight: "700",
  },
  tabTextActive: {
    color: colors.gold,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: colors.text,
    fontWeight: "600",
  },
  input: {
    color: colors.text,
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.bg,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: colors.bgSoft,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
  notice: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noticeError: {
    backgroundColor: "rgba(230, 124, 116, 0.16)",
    borderColor: "rgba(230, 124, 116, 0.35)",
    borderWidth: 1,
  },
  noticeSuccess: {
    backgroundColor: "rgba(120, 199, 140, 0.16)",
    borderColor: "rgba(120, 199, 140, 0.35)",
    borderWidth: 1,
  },
  noticeText: {
    color: colors.text,
  },
});
