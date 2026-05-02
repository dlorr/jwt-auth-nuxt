<script setup lang="ts">
import { useField } from "vee-validate";

const props = defineProps<{
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  autocomplete?: string;
}>();

const type = ref(props.type ?? "text");
const isPasswordType = props.type === "password";

const { value, errorMessage, meta } = useField<string>(() => props.name);

const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
  type.value = showPassword.value ? "text" : "password";
}

const inputClasses = computed(() => ({
  form__input: true,
  "is-invalid": meta.touched && !!errorMessage.value,
}));
</script>

<template>
  <div class="form__group">
    <label v-if="label" class="form__label" :for="name">
      {{ label }}
    </label>

    <div class="input-wrapper">
      <input
        :id="name"
        v-model="value"
        :class="inputClasses"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
      />

      <!-- Password visibility toggle -->
      <button
        v-if="isPasswordType"
        type="button"
        class="input-wrapper__toggle"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="togglePassword"
      >
        <!-- Eye icon -->
        <svg
          v-if="!showPassword"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <!-- Eye-off icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path
            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
          />
          <path
            d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
          />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      </button>
    </div>

    <!-- Hint text (only shown when no error) -->
    <p v-if="hint && !errorMessage" class="form__hint">
      {{ hint }}
    </p>

    <!-- Validation error -->
    <Transition name="fade-error">
      <p v-if="meta.touched && errorMessage" class="form__error">
        {{ errorMessage }}
      </p>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.fade-error-enter-active,
.fade-error-leave-active {
  transition:
    opacity $transition-base,
    transform $transition-base;
}
.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
