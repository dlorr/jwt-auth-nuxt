<script setup lang="ts">
defineProps<{
  type?: "error" | "success" | "warning" | "info";
  message: string;
}>();
</script>

<template>
  <Transition name="alert">
    <div
      v-if="message"
      :class="['alert', `alert--${type ?? 'error'}`]"
      role="alert"
    >
      <!-- Icon -->
      <span class="alert__icon" aria-hidden="true">
        <!-- Error / Danger -->
        <svg
          v-if="!type || type === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <!-- Success -->
        <svg
          v-else-if="type === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <!-- Warning -->
        <svg
          v-else-if="type === 'warning'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
          />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
        <!-- Info -->
        <svg
          v-else-if="type === 'info'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="8" />
          <line x1="12" x2="12" y1="12" y2="16" />
        </svg>
      </span>

      <span class="alert__message">{{ message }}</span>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: $space-2;
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  line-height: $line-height-normal;
  border: 1px solid transparent;

  &__icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__message {
    flex: 1;
  }

  // ─── Variants ───────────────────────────────────────────────────────────────

  &--error {
    background: $color-danger-bg;
    color: $color-danger;
    border-color: rgba($color-danger, 0.2);
  }

  &--success {
    background: $color-success-bg;
    color: $color-success;
    border-color: rgba($color-success, 0.2);
  }

  &--warning {
    background: $color-warning-bg;
    color: $color-warning;
    border-color: rgba($color-warning, 0.2);
  }

  &--info {
    background: $color-info-bg;
    color: $color-info;
    border-color: rgba($color-info, 0.2);
  }
}

// Transition
.alert-enter-active,
.alert-leave-active {
  transition:
    opacity $transition-base,
    transform $transition-base;
}
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
