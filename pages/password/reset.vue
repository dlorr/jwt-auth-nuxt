<script setup lang="ts">
definePageMeta({ middleware: ["guest"] });

const route = useRoute();
const { resetPassword } = useAuth();

const code = computed(() => (route.query.code as string) ?? "");
const exp = computed(() => parseInt((route.query.exp as string) ?? "0"));

const isExpired = computed(() => exp.value > 0 && Date.now() > exp.value);
const isInvalid = computed(() => !code.value || code.value.length !== 24);

const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    const message = await resetPassword({
      password: password.value,
      verificationCode: code.value,
    });
    successMessage.value = message;
    setTimeout(() => navigateTo("/login"), 2000);
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error
        ? err.message
        : "Failed to reset password. Please request a new link.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="reset-page">
    <div class="reset-card">
      <h1 class="reset-card__title">Reset password</h1>

      <!-- Invalid / expired link -->
      <div v-if="isInvalid || isExpired" class="reset-card__invalid">
        <p>
          {{
            isExpired ? "This reset link has expired." : "Invalid reset link."
          }}
        </p>
        <NuxtLink to="/forgot-password" class="btn btn--primary btn--full">
          Request a new link
        </NuxtLink>
      </div>

      <!-- Reset form -->
      <form v-else class="form" @submit.prevent="handleSubmit">
        <div class="form__group">
          <label class="form__label" for="password">New password</label>
          <input
            id="password"
            v-model="password"
            class="form__input"
            type="password"
            placeholder="Min 8 chars, upper, lower, number, special"
            autocomplete="new-password"
          />
        </div>

        <div class="form__group">
          <label class="form__label" for="confirmPassword"
            >Confirm new password</label
          >
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            class="form__input"
            type="password"
            placeholder="Repeat your new password"
            autocomplete="new-password"
          />
        </div>

        <p v-if="errorMessage" class="form__error-global">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form__success">{{ successMessage }}</p>

        <button
          type="submit"
          class="btn btn--primary btn--full"
          :class="{ 'btn--loading': isLoading }"
          :disabled="isLoading"
        >
          <span class="btn__spinner" />
          {{ isLoading ? "Resetting…" : "Reset password" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reset-page {
  @include auth-page;
}

.reset-card {
  @include auth-card;

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $space-6;
    text-align: center;
  }

  &__invalid {
    @include flex-col;
    gap: $space-4;
    text-align: center;
    color: $text-secondary;
  }
}

.form__error-global {
  font-size: $font-size-sm;
  color: $color-danger;
  text-align: center;
}

.form__success {
  font-size: $font-size-sm;
  color: $color-success;
  text-align: center;
}
</style>
