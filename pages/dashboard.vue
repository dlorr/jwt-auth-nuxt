<script setup lang="ts">
import { sessionService } from "~/services/auth.service";
import type { Session } from "~/types/auth.types";

definePageMeta({ middleware: ["auth"] });

const { user, isVerified, logout } = useAuth();
const { errorMessage, setError } = useFormError();

// ─── Sessions ─────────────────────────────────────────────────────────────────

const sessions = ref<Session[]>([]);
const sessionsLoading = ref(true);
const revokingId = ref<string | null>(null);

async function fetchSessions() {
  try {
    sessions.value = await sessionService.getSessions();
  } catch (err) {
    setError(err);
  } finally {
    sessionsLoading.value = false;
  }
}

async function revokeSession(id: string) {
  revokingId.value = id;
  try {
    await sessionService.deleteSession(id);
    sessions.value = sessions.value.filter((s) => s._id !== id);
  } catch (err) {
    setError(err);
  } finally {
    revokingId.value = null;
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

const isLoggingOut = ref(false);

async function handleLogout() {
  isLoggingOut.value = true;
  await logout();
}

// ─── Resend verification ───────────────────────────────────────────────────────

const { successMessage, setSuccess, clearMessages } = useFormError();
const resendLoading = ref(false);

async function resendVerification() {
  clearMessages();
  resendLoading.value = true;
  try {
    const { userService } = await import("~/services/auth.service");
    const { message } = await userService.resendVerification();
    setSuccess(message);
  } catch (err) {
    setError(err);
  } finally {
    resendLoading.value = false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function formatUserAgent(ua?: string) {
  if (!ua) return "Unknown device";
  if (ua.includes("Chrome")) return "🌐 Chrome";
  if (ua.includes("Firefox")) return "🦊 Firefox";
  if (ua.includes("Safari")) return "🧭 Safari";
  if (ua.includes("Edge")) return "🔷 Edge";
  return "💻 Browser";
}

onMounted(fetchSessions);
</script>

<template>
  <div class="dashboard">
    <!-- Top Nav -->
    <header class="dashboard__nav">
      <div class="dashboard__nav-inner">
        <div class="dashboard__brand">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Aegis</span>
        </div>

        <BaseButton
          variant="secondary"
          size="sm"
          :loading="isLoggingOut"
          @click="handleLogout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          {{ isLoggingOut ? "Signing out…" : "Sign out" }}
        </BaseButton>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard__main">
      <!-- Email verification banner -->
      <div v-if="!isVerified" class="dashboard__banner">
        <div class="dashboard__banner-content">
          <svg
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p>Please verify your email address to access all features.</p>
        </div>
        <BaseButton
          variant="ghost"
          size="sm"
          :loading="resendLoading"
          @click="resendVerification"
        >
          {{ resendLoading ? "Sending…" : "Resend email" }}
        </BaseButton>
      </div>

      <!-- Alerts -->
      <BaseAlert :message="errorMessage" type="error" />
      <BaseAlert :message="successMessage" type="success" />

      <!-- User card -->
      <div class="dashboard__card">
        <div class="dashboard__card-header">
          <h2 class="dashboard__section-title">Account</h2>
        </div>

        <div class="dashboard__user">
          <div class="dashboard__avatar">
            {{ user?.email?.[0]?.toUpperCase() }}
          </div>
          <div class="dashboard__user-info">
            <p class="dashboard__user-email">{{ user?.email }}</p>
            <span
              class="dashboard__badge"
              :class="
                isVerified
                  ? 'dashboard__badge--success'
                  : 'dashboard__badge--warning'
              "
            >
              {{ isVerified ? "✓ Verified" : "⚠ Unverified" }}
            </span>
          </div>
        </div>

        <div class="dashboard__meta">
          <div class="dashboard__meta-item">
            <span class="dashboard__meta-label">User ID</span>
            <span class="dashboard__meta-value dashboard__meta-value--mono">{{
              user?._id
            }}</span>
          </div>
          <div class="dashboard__meta-item">
            <span class="dashboard__meta-label">Member since</span>
            <span class="dashboard__meta-value">{{
              user?.createdAt ? formatDate(user.createdAt) : "—"
            }}</span>
          </div>
        </div>
      </div>

      <!-- Sessions card -->
      <div class="dashboard__card">
        <div class="dashboard__card-header">
          <h2 class="dashboard__section-title">Active sessions</h2>
          <p class="dashboard__section-subtitle">
            Devices currently signed in to your account.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="sessionsLoading" class="dashboard__sessions-loading">
          <span class="dashboard__spinner" />
          <p>Loading sessions…</p>
        </div>

        <!-- Session list -->
        <ul v-else-if="sessions.length" class="dashboard__sessions">
          <li
            v-for="session in sessions"
            :key="session._id"
            class="dashboard__session"
            :class="{ 'dashboard__session--current': session.isCurrent }"
          >
            <div class="dashboard__session-info">
              <p class="dashboard__session-device">
                {{ formatUserAgent(session.userAgent) }}
                <span v-if="session.isCurrent" class="dashboard__current-tag"
                  >Current</span
                >
              </p>
              <p class="dashboard__session-date">
                {{ formatDate(session.createdAt) }}
              </p>
            </div>

            <BaseButton
              v-if="!session.isCurrent"
              variant="danger"
              size="sm"
              :loading="revokingId === session._id"
              @click="revokeSession(session._id)"
            >
              Revoke
            </BaseButton>
          </li>
        </ul>

        <p v-else class="dashboard__empty">No active sessions found.</p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  min-height: 100dvh;
  background: $bg-page;

  // ─── Nav ────────────────────────────────────────────────────────────────────

  &__nav {
    background: $bg-surface;
    border-bottom: 1px solid $border-default;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  &__nav-inner {
    @include flex-between;
    max-width: 720px;
    margin: 0 auto;
    padding: $space-4 $space-6;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    font-size: $font-size-lg;

    svg {
      color: $color-primary;
    }
  }

  // ─── Main ───────────────────────────────────────────────────────────────────

  &__main {
    max-width: 720px;
    margin: 0 auto;
    padding: $space-8 $space-6;
    @include flex-col;
    gap: $space-6;
  }

  // ─── Verification Banner ────────────────────────────────────────────────────

  &__banner {
    @include flex-between;
    gap: $space-4;
    padding: $space-4 $space-5;
    background: $color-warning-bg;
    border: 1px solid rgba($color-warning, 0.3);
    border-radius: $radius-lg;
    color: $color-warning;
    flex-wrap: wrap;
  }

  &__banner-content {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }

  // ─── Cards ──────────────────────────────────────────────────────────────────

  &__card {
    @include card;
    @include flex-col;
    gap: $space-6;
  }

  &__card-header {
    @include flex-col;
    gap: $space-1;
  }

  &__section-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }

  &__section-subtitle {
    font-size: $font-size-sm;
    color: $text-muted;
  }

  // ─── User ───────────────────────────────────────────────────────────────────

  &__user {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  &__avatar {
    @include flex-center;
    width: 52px;
    height: 52px;
    border-radius: $radius-full;
    background: $color-primary-light;
    color: $color-primary;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    flex-shrink: 0;
  }

  &__user-info {
    @include flex-col;
    gap: $space-1;
  }

  &__user-email {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    padding: 2px $space-2;
    border-radius: $radius-full;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    width: fit-content;

    &--success {
      background: $color-success-bg;
      color: $color-success;
    }

    &--warning {
      background: $color-warning-bg;
      color: $color-warning;
    }
  }

  // ─── Meta ───────────────────────────────────────────────────────────────────

  &__meta {
    @include flex-col;
    gap: $space-3;
    padding-top: $space-4;
    border-top: 1px solid $border-default;
  }

  &__meta-item {
    display: flex;
    align-items: baseline;
    gap: $space-4;

    @include respond-down($bp-sm) {
      flex-direction: column;
      gap: $space-1;
    }
  }

  &__meta-label {
    font-size: $font-size-sm;
    color: $text-muted;
    min-width: 110px;
    flex-shrink: 0;
  }

  &__meta-value {
    font-size: $font-size-sm;
    color: $text-primary;

    &--mono {
      font-family: $font-mono;
      font-size: $font-size-xs;
      color: $text-secondary;
      word-break: break-all;
    }
  }

  // ─── Sessions ───────────────────────────────────────────────────────────────

  &__sessions-loading {
    @include flex-center;
    gap: $space-3;
    padding: $space-8;
    color: $text-muted;
    font-size: $font-size-sm;
  }

  &__spinner {
    display: block;
    width: 18px;
    height: 18px;
    border: 2px solid $border-default;
    border-top-color: $color-primary;
    border-radius: $radius-full;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  &__sessions {
    @include flex-col;
    gap: 0;
    border: 1px solid $border-default;
    border-radius: $radius-lg;
    overflow: hidden;
  }

  &__session {
    @include flex-between;
    gap: $space-4;
    padding: $space-4 $space-5;
    border-bottom: 1px solid $border-default;
    transition: background $transition-base;

    &:last-child {
      border-bottom: none;
    }

    &--current {
      background: $color-primary-light;
    }
  }

  &__session-info {
    @include flex-col;
    gap: $space-1;
  }

  &__session-device {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $text-primary;
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__current-tag {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-primary;
    background: rgba($color-primary, 0.1);
    padding: 2px $space-2;
    border-radius: $radius-full;
  }

  &__session-date {
    font-size: $font-size-xs;
    color: $text-muted;
  }

  &__empty {
    font-size: $font-size-sm;
    color: $text-muted;
    text-align: center;
    padding: $space-8;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
