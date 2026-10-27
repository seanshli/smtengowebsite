<template>
  <section class="ap-page success-container">
    <div class="ap-tile ap-tile-first ap-white success-tile">
      <div class="ap-wrap ap-wrap-text ap-center">
        <svg class="checkbox" viewBox="0 0 64 64" role="img" aria-label="success checkbox">
          <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="3" />
          <path d="M19 33l9 9 17-19" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="message-container">
          <h1 class="ap-h2 title">{{ $t('submitSuccess') }}</h1>
          <p class="ap-lead content">{{ $t('successMessage') }}</p>
          <div class="ap-cta-row">
            <router-link class="ap-pill ap-pill-primary btn" to="/">
              <span>{{ $t('backToHome') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
