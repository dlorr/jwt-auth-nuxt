<script setup lang="ts">
const route = useRoute();
const { verifyEmail } = useAuth();

const status = ref<"loading" | "success" | "error">("loading");
const message = ref("");

onMounted(async () => {
  const code = route.params.code as string;

  if (!code || code.length !== 24) {
    status.value = "error";
    message.value = "Invalid or expired verification link.";
    return;
  }

  try {
    message.value = await verifyEmail(code);
    status.value = "success";

    setTimeout(() => navigateTo("/dashboard"), 2000);
  } catch (err: unknown) {
    status.value = "error";
    message.value =
      err instanceof Error
        ? err.message
        : "Invalid or expired verification code.";
  }
});
</script>

<template>
  <div class="verify-page">
    <div class="verify-card">
      <div v-if="status === 'loading'" class="verify-card__state">
        <span class="verify-card__spinner" />
        <p>Verifying your email…</p>
      </div>

      <div
        v-else-if="status === 'success'"
        class="verify-card__state verify-card__state--success"
      >
        <span class="verify-card__icon">✓</span>
        <h2>Email verified!</h2>
        <p>{{ message }}</p>
        <p class="verify-card__redirect">Redirecting to dashboard…</p>
      </div>

      <div v-else class="verify-card__state verify-card__state--error">
        <span class="verify-card__icon">✕</span>
        <h2>Verification failed</h2>
        <p>{{ message }}</p>
        <NuxtLink to="/login" class="btn btn--primary btn--full">
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.verify-page {
  @include auth-page;
}

.verify-card {
  @include auth-card;
  text-align: center;

  &__state {
    @include flex-col;
    align-items: center;
    gap: $space-4;
  }

  &__spinner {
    display: block;
    width: 40px;
    height: 40px;
    border: 3px solid $border-default;
    border-top-color: $color-primary;
    border-radius: $radius-full;
    animation: spin 0.7s linear infinite;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: $radius-full;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
  }

  &__state--success &__icon {
    background: $color-success-bg;
    color: $color-success;
  }

  &__state--error &__icon {
    background: $color-danger-bg;
    color: $color-danger;
  }

  &__redirect {
    font-size: $font-size-sm;
    color: $text-muted;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
