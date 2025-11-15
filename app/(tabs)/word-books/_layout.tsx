import { Stack } from "expo-router";

export default function WordBooksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "WordBook Detail",
        }}
      />
    </Stack>
  );
}

