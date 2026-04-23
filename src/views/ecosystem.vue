<template>
  <section id="engo-ecosystem" class="engo-ecosystem-section">
    <div class="engo-ecosystem-content-container">
      <h2 class="section-title text-color-white">{{ $t('ecosystemTitle') }}</h2>
      <div class="horizontal-strip"></div>

      <div class="video-container">
        <div class="video-wrap">
          <iframe
            src="https://www.youtube.com/embed/sKjo04dGmfg"
            :title="$t('ecosystemTitle')"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>
