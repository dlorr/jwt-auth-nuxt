<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
}>();
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn--${variant ?? 'primary'}`,
      size && size !== 'md' ? `btn--${size}` : '',
      full ? 'btn--full' : '',
      loading ? 'btn--loading' : '',
    ]"
  >
    <span class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>
