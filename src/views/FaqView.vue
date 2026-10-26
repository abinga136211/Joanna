<script setup>
import { computed, ref } from 'vue'
import { useAccordion } from '@/composables/useInteractions'
import { useLocaleStore } from '@/stores/locale'
import { useFaqTopics } from '@/composables/useFaqTopics'

const root = ref(null)
useAccordion(root)
const locale = useLocaleStore()
const t = (...args) => locale.t(...args)
const { topics } = useFaqTopics()

const faqHeroSrc = `${import.meta.env.BASE_URL}images/faq-hero.jpg`
const faqHeroWebp = `${import.meta.env.BASE_URL}images/faq-hero.webp`

const faqTopics = computed(() =>
  topics.value.map((topic) => ({
    id: topic.slug,
    titleZh: topic.title_zh,
    titleTw: topic.title_tw,
    titleEn: topic.title_en,
    descriptionZh: topic.description_zh,
    descriptionTw: topic.description_tw,
    descriptionEn: topic.description_en,
    articles: Array.isArray(topic.articles) ? topic.articles : [],
  })),
)

const topicLinks = computed(() =>
  faqTopics.value.map((topic) => ({
    href: `#${topic.id}`,
    title: t(topic.titleZh, topic.titleEn, topic.titleTw),
    desc: t(
      topic.descriptionZh || '相关说明将在此更新。',
      topic.descriptionEn || 'Details will be published here.',
      topic.descriptionTw || topic.descriptionZh || '相關說明將在此更新。',
    ),
  })),
)
</script>

<template>
<!-- 帮助中心根节点：整页连续背景，柔化 Hero 与区块硬切 -->
<div ref="root" class="faq-page">
<section class="hero hero-page hero-page--cover">
  <div class="hero-page-media" aria-hidden="true">
    <picture>
      <source :srcset="faqHeroWebp" type="image/webp" />
      <img
        class="hero-page-img"
        :src="faqHeroSrc"
        alt=""
        width="960"
        height="720"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
    </picture>
  </div>
  <div class="hero-page-veil" aria-hidden="true"></div>
  <div class="container">
    <div class="hero-page-copy">
      <h1 data-en="Help Center" data-zh="帮助中心" data-tw="幫助中心">帮助中心</h1>
      <p class="lead" data-en="Guides, FAQs, technical docs and privacy policy—find what you need here." data-zh="使用指南、常见问题、产品技术文档与隐私政策，按主题快速查阅。" data-tw="使用指南、常見問題、產品技術文檔與隱私政策，按主題快速查閱。">使用指南、常见问题、产品技术文档与隐私政策，按主题快速查阅。</p>
      <a class="btn btn-primary btn-lg" data-en="Contact Support" data-zh="联系客服" data-tw="聯繫客服" href="/contact">联系客服</a>
    </div>
  </div>
</section>

<section class="section faq-guide-section" id="topics">
<div class="container">
<div class="faq-guide-layout">
<div class="faq-guide-copy">
<h2 data-en="Browse by topic" data-zh="按主题浏览" data-tw="按主題瀏覽">按主题浏览</h2>
<p data-en="Jump to the Help Center topic you need." data-zh="跳转到你关心的帮助中心主题。" data-tw="跳轉到你關心的幫助中心主題。">跳转到你关心的帮助中心主题。</p>
</div>
<div class="faq-guide-list">
<a
  v-for="link in topicLinks"
  :key="link.href"
  class="faq-guide-item"
  :href="link.href"
>
  <strong>{{ link.title }}</strong>
  <span>{{ link.desc }}</span>
</a>
</div>
</div>
</div>
</section>

<section class="section faq-main-section" id="help-articles">
<div class="container faq-main">
<div
  v-for="topic in faqTopics"
  :id="topic.id"
  :key="topic.id"
  class="faq-cat"
>
  <h3>{{ t(topic.titleZh, topic.titleEn, topic.titleTw) }}</h3>
  <div v-if="topic.articles.length" class="accordion faq-accordion">
    <div
      v-for="article in topic.articles"
      :key="article.id"
      class="acc-item"
    >
      <button class="acc-trigger" type="button">
        {{ t(article.title_zh, article.title_en, article.title_tw) }}
        <span class="plus" aria-hidden="true">
          <svg fill="none" height="18" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </button>
      <div class="acc-body">
        <div class="acc-body-inner">
          {{ t(article.body_zh, article.body_en, article.body_tw) }}
        </div>
      </div>
    </div>
  </div>
  <p v-else style="color: var(--muted, #64748b); margin-top: 0.5rem">
    {{ t('内容即将更新，如有需要请联系客服。', 'Content coming soon. Contact support if you need help.', '內容即將更新，如有需要請聯繫客服。') }}
  </p>
</div>
</div>
</section>
</div>
</template>
