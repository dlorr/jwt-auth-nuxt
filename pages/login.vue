<script setup lang="ts">
import { useForm } from "vee-validate";
import { loginFormSchema } from "~/utils/validation";

definePageMeta({ middleware: ["guest"] });

const { login } = useAuth();
const { errorMessage, setError, clearMessages } = useFormError();

const isLoading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: loginFormSchema,
});

const onSubmit = handleSubmit(async (values) => {
  clearMessages();
  isLoading.value = true;

  try {
    await login({ email: values.email, password: values.password });
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1 class="auth-card__title">Welcome back</h1>
        <p class="auth-card__subtitle">Sign in to your account</p>
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

        <BaseInput
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autocomplete="current-password"
        />

        <!-- Forgot password link -->
        <div class="auth-card__forgot">
          <NuxtLink to="/password/forgot">Forgot password?</NuxtLink>
        </div>

        <!-- API error -->
        <BaseAlert :message="errorMessage" type="error" />

        <BaseButton type="submit" :loading="isLoading" :full="true">
          {{ isLoading ? "Signing in…" : "Sign in" }}
        </BaseButton>
      </form>

      <!-- Footer -->
      <p class="auth-card__footer">
        Don't have an account?
        <NuxtLink to="/register">Create one</NuxtLink>
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
  }

  &__forgot {
    display: flex;
    justify-content: flex-end;
    margin-top: -$space-2;

    a {
      font-size: $font-size-sm;
      color: $text-secondary;

      &:hover {
        color: $color-primary;
      }
    }
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
