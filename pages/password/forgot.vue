<script setup lang="ts">
import { useForm } from "vee-validate";
import { forgotPasswordFormSchema } from "~/utils/validation";

definePageMeta({ middleware: ["guest"] });

const { forgotPassword } = useAuth();
const { errorMessage, successMessage, setError, setSuccess, clearMessages } =
  useFormError();

const isLoading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: forgotPasswordFormSchema,
});

const onSubmit = handleSubmit(async (values) => {
  clearMessages();
  isLoading.value = true;

  try {
    const message = await forgotPassword({ email: values.email });
    setSuccess(message);
  } catch (err) {
    setError(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- Header -->
      <div class="auth-card__header">
        <div class="auth-card__logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 class="auth-card__title">Forgot password?</h1>
        <p class="auth-card__subtitle">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <!-- Form -->
      <form class="form" novalidate @submit.prevent="onSubmit">
        <BaseInput
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
        />

        <BaseAlert :message="errorMessage" type="error" />
        <BaseAlert :message="successMessage" type="success" />

        <BaseButton type="submit" :loading="isLoading" :full="true">
          {{ isLoading ? "Sending…" : "Send reset link" }}
        </BaseButton>
      </form>

      <!-- Footer -->
      <p class="auth-card__footer">
        Remember your password?
        <NuxtLink to="/login">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  @include auth-page;
}

.auth-card {
  @include auth-card;

  &__header {
    @include flex-col;
    align-items: center;
    text-align: center;
    margin-bottom: $space-8;
    gap: $space-2;
  }

  &__logo {
    @include flex-center;
    width: 52px;
    height: 52px;
    background: $color-primary-light;
    color: $color-primary;
    border-radius: $radius-xl;
    margin-bottom: $space-2;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }

  &__subtitle {
    font-size: $font-size-sm;
    color: $text-muted;
    max-width: 280px;
  }

  &__footer {
    text-align: center;
    font-size: $font-size-sm;
    color: $text-muted;
    margin-top: $space-6;

    a {
      font-weight: $font-weight-medium;
      color: $color-primary;
    }
  }
}
</style>
