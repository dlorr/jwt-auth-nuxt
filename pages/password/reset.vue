<script setup lang="ts">
import { useForm } from "vee-validate";
import { resetPasswordFormSchema } from "~/utils/validation";

definePageMeta({ middleware: ["guest"] });

const route = useRoute();
const { resetPassword } = useAuth();
const { errorMessage, successMessage, setError, setSuccess, clearMessages } =
  useFormError();

const code = computed(() => (route.query.code as string) ?? "");
const exp = computed(() => parseInt((route.query.exp as string) ?? "0"));

const isExpired = computed(() => exp.value > 0 && Date.now() > exp.value);
const isInvalid = computed(() => !code.value || code.value.length !== 24);

const isLoading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: resetPasswordFormSchema,
});

const onSubmit = handleSubmit(async (values) => {
  clearMessages();
  isLoading.value = true;

  try {
    const message = await resetPassword({
      password: values.password,
      verificationCode: code.value,
    });
    setSuccess(message);
    setTimeout(() => navigateTo("/login"), 2000);
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
        <h1 class="auth-card__title">Reset password</h1>
        <p class="auth-card__subtitle">Enter and confirm your new password.</p>
      </div>

      <!-- Invalid / expired link -->
      <div v-if="isInvalid || isExpired" class="auth-card__invalid">
        <BaseAlert
          :message="
            isExpired ? 'This reset link has expired.' : 'Invalid reset link.'
          "
          type="error"
        />
        <NuxtLink to="/password/forgot" class="btn btn--primary btn--full">
          Request a new link
        </NuxtLink>
      </div>

      <!-- Reset form -->
      <form v-else class="form" novalidate @submit.prevent="onSubmit">
        <BaseInput
          name="password"
          label="New password"
          type="password"
          placeholder="Min 8 chars, upper, lower, number, special"
          autocomplete="new-password"
        />

        <BaseInput
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          placeholder="Repeat your new password"
          autocomplete="new-password"
        />

        <BaseAlert :message="errorMessage" type="error" />
        <BaseAlert :message="successMessage" type="success" />

        <BaseButton type="submit" :loading="isLoading" :full="true">
          {{ isLoading ? "Resetting…" : "Reset password" }}
        </BaseButton>
      </form>

      <p class="auth-card__footer">
        <NuxtLink to="/login">← Back to sign in</NuxtLink>
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

  &__invalid {
    @include flex-col;
    gap: $space-4;
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
