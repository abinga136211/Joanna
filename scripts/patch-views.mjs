import fs from 'node:fs'
import path from 'node:path'

const dir = 'src/views'

const scripts = {
  'HomeView.vue': '<script setup>\n</script>\n',
  'AboutView.vue': '<script setup>\n</script>\n',
  'ComplianceView.vue': '<script setup>\n</script>\n',
  'PrivacyView.vue': '<script setup>\n</script>\n',
  'ProductsView.vue': `<script setup>
import { ref } from 'vue'
import { useProductTabs } from '@/composables/useInteractions'

const root = ref(null)
useProductTabs(root)
</script>
`,
  'FaqView.vue': `<script setup>
import { ref } from 'vue'
import { useAccordion } from '@/composables/useInteractions'

const root = ref(null)
useAccordion(root)
</script>
`,
}

for (const [file, script] of Object.entries(scripts)) {
  const p = path.join(dir, file)
  let s = fs.readFileSync(p, 'utf8')
  s = s.replace(/<script setup>[\s\S]*?<\/script>\s*/, script + '\n')
  if (file === 'ProductsView.vue' || file === 'FaqView.vue') {
    if (!s.includes('ref="root"')) {
      s = s.replace('<template>\n', '<template>\n<div ref="root">\n')
      s = s.replace(/\n<\/template>\s*$/, '\n</div>\n</template>\n')
    }
  }
  fs.writeFileSync(p, s)
  console.log('patched', file)
}
