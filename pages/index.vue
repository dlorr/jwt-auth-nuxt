<script setup lang="ts">
const store = useAuthStore();

// Redirect immediately based on auth state.
// By the time this runs, 2.auth.init.ts has already called /user
// so isAuthenticated is accurate.
if (store.isAuthenticated) {
  await navigateTo("/dashboard", { replace: true });
} else {
  await navigateTo("/login", { replace: true });
}
</script>

<template><div></div></template>
