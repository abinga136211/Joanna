import { computed, ref } from 'vue'
import { apiFetch } from '@/api/client'
import { DEFAULT_FAQ_TOPICS } from '@/data/faqTopicDefaults'
import { useAutoRefresh } from '@/composables/useAutoRefresh'

const topics = ref([])
const hasLoadedOnce = ref(false)

async function fetchFaqTopics() {
  try {
    const data = await apiFetch('/api/faq-topics')
    // Trust API even when empty — do not re-inject hardcoded defaults after clear.
    topics.value = Array.isArray(data.items) ? data.items : []
    hasLoadedOnce.value = true
  } catch {
    // Network/API failure only: use defaults until first successful response.
    if (!hasLoadedOnce.value) {
      topics.value = [...DEFAULT_FAQ_TOPICS]
    }
  }
}

/** Shared help-center topics; call from component setup to enable auto-refresh. */
export function useFaqTopics(options = {}) {
  useAutoRefresh(fetchFaqTopics, { intervalMs: options.intervalMs ?? 3000 })

  const navChildren = computed(() =>
    topics.value.map((topic) => ({
      to: `/faq#${topic.slug}`,
      zh: topic.title_zh,
      en: topic.title_en,
      tw: topic.title_tw,
    })),
  )

  return { topics, navChildren, refreshFaqTopics: fetchFaqTopics }
}
