<template>
  <section class="success-container">
    <div class="container">
      <img class="checkbox" src="../assets/images/success_checkbox.svg" alt="success checkbox" />
      <div class="message-container">
        <div class="title">{{ $t('submitSuccess') }}</div>
        <div class="content">{{ $t('successMessage') }}</div>
        <router-link class="btn" to="/">
          <span>{{ $t('backToHome') }}</span>
        </router-link>
      </div>
    </div>
  </section>
</template>
