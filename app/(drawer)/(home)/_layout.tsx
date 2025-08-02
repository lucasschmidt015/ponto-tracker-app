import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This will wrap all screens inside (auth) */}
    </Stack>
  );
}