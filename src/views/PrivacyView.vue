<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useLocaleStore } from '@/stores/locale'
import { apiFetch } from '@/api/client'
import { useAutoRefresh } from '@/composables/useAutoRefresh'

const locale = useLocaleStore()
const careerHeroSrc = `${import.meta.env.BASE_URL}images/career-hero.jpg`
const careerHeroWebp = `${import.meta.env.BASE_URL}images/career-hero.webp`

const jobs = ref([])
const jobsLoading = ref(true)
const jobsError = ref('')
const expandedId = ref(null)
const applyOpen = ref(false)
const applyJobId = ref(null)
const applySubmitting = ref(false)
const applyMsg = ref({ show: false, text: '', ok: true })
const resumeInputRef = ref(null)
const resumeFile = ref(null)

const emptyApplyForm = () => ({
  name: '',
  gender: '',
  phone: '',
  email: '',
  school: '',
  location: '',
  bio: '',
  resumeName: '',
})

const applyForm = ref(emptyApplyForm())

const lang = computed(() => locale.language)

const LABEL_PACKS = {
  zh: {
    responsibilities: '岗位职责',
    requirements: '岗位要求',
    apply: '投递意向',
    empty: '当前暂无开放职位。欢迎稍后再来，或通过联系页与我们沟通。',
    count: '个职位空缺',
    experience: '经验',
    formTitle: '招聘信息表',
    formJob: '应聘职位',
    formName: '姓名',
    formGender: '性别',
    formGenderMale: '男',
    formGenderFemale: '女',
    formPhone: '手机号',
    formEmail: '邮箱',
    formSchool: '毕业院校',
    formLocation: '现居地',
    formBio: '个人简介',
    formBioHint: '限 200 字',
    formResume: '简历',
    formResumeHint: '仅 PDF，限 5MB',
    formResumePick: '选择文件',
    formResumeEmpty: '未选择文件',
    formResumeType: '请上传 PDF 格式简历。',
    formSubmit: '提交投递',
    formSubmitting: '提交中…',
    formCancel: '取消',
    formClose: '关闭',
    formRequired: '请完整填写必填项。',
    formEmailInvalid: '请输入正确的邮箱格式。',
    formBioTooLong: '个人简介不能超过 200 字。',
    formResumeTooLarge: '简历文件不能超过 5MB。',
    formSuccess: '已收到您的投递，我们会尽快与您联系。',
    formFail: '提交失败，请稍后重试。',
    loadFail: '职位加载失败，请刷新重试。',
    phName: '请输入姓名',
    phPhone: '请输入手机号',
    phEmail: 'name@example.com',
    phSchool: '请输入毕业院校',
    phLocation: '请输入现居地',
    phBio: '请简要介绍自己（限 200 字）',
  },
  tw: {
    responsibilities: '崗位職責',
    requirements: '崗位要求',
    apply: '投遞意向',
    empty: '當前暫無開放職位。歡迎稍後再來，或通過聯繫頁與我們溝通。',
    count: '個職位空缺',
    experience: '經驗',
    formTitle: '招聘信息表',
    formJob: '應聘職位',
    formName: '姓名',
    formGender: '性別',
    formGenderMale: '男',
    formGenderFemale: '女',
    formPhone: '手機號',
    formEmail: '郵箱',
    formSchool: '畢業院校',
    formLocation: '現居地',
    formBio: '個人簡介',
    formBioHint: '限 200 字',
    formResume: '簡歷',
    formResumeHint: '僅 PDF，限 5MB',
    formResumePick: '選擇文件',
    formResumeEmpty: '未選擇文件',
    formResumeType: '請上傳 PDF 格式簡歷。',
    formSubmit: '提交投遞',
    formSubmitting: '提交中…',
    formCancel: '取消',
    formClose: '關閉',
    formRequired: '請完整填寫必填項。',
    formEmailInvalid: '請輸入正確的郵箱格式。',
    formBioTooLong: '個人簡介不能超過 200 字。',
    formResumeTooLarge: '簡歷文件不能超過 5MB。',
    formSuccess: '已收到您的投遞，我們會盡快與您聯繫。',
    formFail: '提交失敗，請稍後重試。',
    loadFail: '職位加載失敗，請刷新重試。',
    phName: '請輸入姓名',
    phPhone: '請輸入手機號',
    phEmail: 'name@example.com',
    phSchool: '請輸入畢業院校',
    phLocation: '請輸入現居地',
    phBio: '請簡要介紹自己（限 200 字）',
  },
  en: {
    responsibilities: 'Responsibilities',
    requirements: 'Requirements',
    apply: 'Apply / Express interest',
    empty: 'No open roles right now. Please check back later or contact us.',
    count: 'open roles',
    experience: 'Experience',
    formTitle: 'Application Form',
    formJob: 'Position',
    formName: 'Full name',
    formGender: 'Gender',
    formGenderMale: 'Male',
    formGenderFemale: 'Female',
    formPhone: 'Phone',
    formEmail: 'Email',
    formSchool: 'Graduation school',
    formLocation: 'Current city',
    formBio: 'About you',
    formBioHint: 'Max 200 characters',
    formResume: 'Resume',
    formResumeHint: 'PDF only, max 5MB',
    formResumePick: 'Choose file',
    formResumeEmpty: 'No file selected',
    formResumeType: 'Please upload a PDF resume.',
    formSubmit: 'Submit application',
    formSubmitting: 'Submitting…',
    formCancel: 'Cancel',
    formClose: 'Close',
    formRequired: 'Please complete all required fields.',
    formEmailInvalid: 'Please enter a valid email address.',
    formBioTooLong: 'About you must be 200 characters or fewer.',
    formResumeTooLarge: 'Resume must be 5MB or smaller.',
    formSuccess: 'Application received. We will contact you soon.',
    formFail: 'Submission failed. Please try again later.',
    loadFail: 'Failed to load roles. Please refresh.',
    phName: 'Your name',
    phPhone: 'Phone number',
    phEmail: 'name@example.com',
    phSchool: 'School / university',
    phLocation: 'City / region',
    phBio: 'Brief intro (max 200 characters)',
  },
}

const labels = computed(() => LABEL_PACKS[lang.value] || LABEL_PACKS.zh)

function jobField(job, field) {
  if (!job) return ''
  const code = lang.value
  const preferred = job[`${field}_${code}`]
  if (Array.isArray(preferred) && preferred.length) return preferred
  if (typeof preferred === 'string' && preferred.trim()) return preferred
  const zh = job[`${field}_zh`] ?? job[field]
  return zh ?? (field === 'responsibilities' || field === 'requirements' ? [] : '')
}

const applyJobTitle = computed(() => {
  if (!applyJobId.value) return ''
  const job = jobs.value.find((j) => j.id === applyJobId.value)
  return jobField(job, 'title') || ''
})

const bioLen = computed(() => applyForm.value.bio.length)

async function loadJobs() {
  try {
    const data = await apiFetch('/api/jobs')
    jobs.value = data.items || []
    jobsError.value = ''
  } catch {
    if (jobsLoading.value) jobsError.value = labels.value.loadFail
  } finally {
    jobsLoading.value = false
  }
}

useAutoRefresh(loadJobs, {
  intervalMs: 2000,
  paused: computed(() => applyOpen.value),
})

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function openApply(jobId) {
  applyJobId.value = jobId ?? null
  applyForm.value = emptyApplyForm()
  resumeFile.value = null
  applyMsg.value = { show: false, text: '', ok: true }
  if (resumeInputRef.value) resumeInputRef.value.value = ''
  applyOpen.value = true
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onApplyKeydown)
}

function closeApply() {
  if (!applyOpen.value) return
  applyOpen.value = false
  applySubmitting.value = false
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onApplyKeydown)
}

function onApplyKeydown(e) {
  if (e.key === 'Escape') closeApply()
}

onUnmounted(() => {
  window.removeEventListener('keydown', onApplyKeydown)
  document.body.style.overflow = ''
})

function onResumeChange(e) {
  const input = e.target
  const file = input.files?.[0]
  applyMsg.value = { show: false, text: '', ok: true }
  if (!file) {
    resumeFile.value = null
    applyForm.value.resumeName = ''
    return
  }
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    resumeFile.value = null
    applyForm.value.resumeName = ''
    input.value = ''
    applyMsg.value = { show: true, text: labels.value.formResumeType, ok: false }
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    resumeFile.value = null
    applyForm.value.resumeName = ''
    input.value = ''
    applyMsg.value = { show: true, text: labels.value.formResumeTooLarge, ok: false }
    return
  }
  resumeFile.value = file
  applyForm.value.resumeName = file.name
}

async function onApplySubmit(e) {
  e.preventDefault()
  const f = applyForm.value
  if (
    !applyJobId.value ||
    !f.name.trim() ||
    !f.gender ||
    !f.phone.trim() ||
    !f.email.trim() ||
    !f.school.trim() ||
    !f.location.trim() ||
    !f.bio.trim() ||
    !resumeFile.value
  ) {
    applyMsg.value = { show: true, text: labels.value.formRequired, ok: false }
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    applyMsg.value = { show: true, text: labels.value.formEmailInvalid, ok: false }
    return
  }
  if (f.bio.length > 200) {
    applyMsg.value = { show: true, text: labels.value.formBioTooLong, ok: false }
    return
  }
  applySubmitting.value = true
  try {
    const body = new FormData()
    body.set('job_id', String(applyJobId.value))
    body.set('name', f.name.trim())
    body.set('gender', f.gender)
    body.set('phone', f.phone.trim())
    body.set('email', f.email.trim())
    body.set('school', f.school.trim())
    body.set('residence', f.location.trim())
    body.set('bio', f.bio.trim())
    body.set('resume', resumeFile.value)
    await apiFetch('/api/applications', { method: 'POST', body })
    applyMsg.value = { show: true, text: labels.value.formSuccess, ok: true }
    window.setTimeout(() => closeApply(), 800)
  } catch (err) {
    applyMsg.value = {
      show: true,
      text: err.message || labels.value.formFail,
      ok: false,
    }
  } finally {
    applySubmitting.value = false
  }
}
</script>

<template>
<!-- 加入我们页根节点：整页连续背景，柔化深色 Hero 与白/灰硬切 -->
<div class="privacy-page">
<section class="hero hero-page hero-page--cover">
  <div class="hero-page-media" aria-hidden="true">
    <picture>
      <source :srcset="careerHeroWebp" type="image/webp" />
      <img
        class="hero-page-img"
        :src="careerHeroSrc"
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
      <h1 data-en="Join Us" data-zh="加入我们" data-tw="加入我們">加入我们</h1>
      <div class="career-hero-cta">
        <a class="btn btn-primary btn-lg" href="#openings" data-en="Open Roles" data-zh="职位空缺" data-tw="職位空缺">职位空缺</a>
        <a class="btn btn-outline-white btn-lg" href="/contact" data-en="Contact Us" data-zh="联系我们" data-tw="聯繫我們">联系我们</a>
      </div>
    </div>
  </div>
</section>

<section class="section career-section" id="values">
<div class="container">
<div class="career-intro career-intro--left">
<h2 data-en="Corporate Values" data-zh="企业价值观" data-tw="企業價值觀">企业价值观</h2>
<p data-en="Grounded in payments and compliance expertise, we match real cross-border business scenarios and deliver practical, innovative solutions—empowering SMEs to strengthen market competitiveness, advancing together toward shared, win-win value." data-zh="以支付与合规专业能力为基石，匹配跨境企业真实业务场景，输出务实创新解决方案，赋能中小企业强化市场竞争力，同心致远，共创价值双赢。" data-tw="以支付與合規專業能力為基石，匹配跨境企業真實業務場景，輸出務實創新解決方案，賦能中小企業強化市場競爭力，同心致遠，共創價值雙贏。">以支付与合规专业能力为基石，匹配跨境企业真实业务场景，输出务实创新解决方案，赋能中小企业强化市场竞争力，同心致远，共创价值双赢。</p>
</div>
</div>
</section>

<section class="section career-section career-section--soft" id="benefits">
<div class="container">
<div class="career-package">
<div class="career-package-copy">
<span class="career-package-kicker" data-en="Join Us" data-zh="加入我们" data-tw="加入我們">加入我们</span>
<h2 data-en="Career Package" data-zh="职业待遇" data-tw="職業待遇">职业待遇</h2>
<p data-en="We invest in people with clear benefits, competitive pay and a focused workplace." data-zh="以清晰福利、有竞争力的薪酬与专注的办公环境，持续投入人才发展。" data-tw="以清晰福利、有競爭力的薪酬與專注的辦公環境，持續投入人才發展。">以清晰福利、有竞争力的薪酬与专注的办公环境，持续投入人才发展。</p>
</div>
<ol class="career-package-grid">
<li>
<span class="career-package-index" aria-hidden="true">01</span>
<strong data-en="Leave &amp; Benefits" data-zh="假期与福利" data-tw="假期與福利">假期与福利</strong>
<p data-en="Aligned with leading multinational standards, with a comprehensive leave and benefits system." data-zh="对标大型外企标准，提供完善假期与福利体系" data-tw="對標大型外企標準，提供完善假期與福利體系">对标大型外企标准，提供完善假期与福利体系</p>
</li>
<li>
<span class="career-package-index" aria-hidden="true">02</span>
<strong data-en="Pay &amp; Incentives" data-zh="薪酬激励" data-tw="薪酬激勵">薪酬激励</strong>
<p data-en="Competitive compensation and performance incentives." data-zh="配备富有市场竞争力的薪酬与绩效激励机制" data-tw="配備富有市場競爭力的薪酬與績效激勵機制">配备富有市场竞争力的薪酬与绩效激励机制</p>
</li>
<li>
<span class="career-package-index" aria-hidden="true">03</span>
<strong data-en="Workplace" data-zh="办公环境" data-tw="辦公環境">办公环境</strong>
<p data-en="Premium office space for a comfortable, efficient work environment." data-zh="高端写字楼办公，营造舒适高效的工作环境" data-tw="高端寫字樓辦公，營造舒適高效的工作環境">高端写字楼办公，营造舒适高效的工作环境</p>
</li>
</ol>
</div>
</div>
</section>

<section class="section career-section career-section--soft" id="openings">
<div class="container">
<div class="career-head career-head--left">
<h2 data-en="Open Roles" data-zh="现有职位空缺" data-tw="現有職位空缺">现有职位空缺</h2>
</div>
<div class="career-openings">
<p v-if="jobsLoading" class="career-openings-empty">Loading…</p>
<p v-else-if="jobsError" class="career-openings-empty">{{ jobsError }}</p>
<template v-else>
<p class="career-openings-count">
<strong>{{ jobs.length }}</strong>
<span>{{ labels.count }}</span>
</p>

<template v-if="jobs.length">
<ul class="career-job-list">
<li
  v-for="job in jobs"
  :key="job.id"
  class="career-job"
  :class="{ 'is-open': expandedId === job.id }"
>
<button type="button" class="career-job-toggle" @click="toggleExpand(job.id)">
<span class="career-job-main">
<span class="career-job-title">{{ jobField(job, 'title') }}</span>
<span class="career-job-meta">
<span>{{ jobField(job, 'work_location') }}</span>
<span v-if="jobField(job, 'job_type')" aria-hidden="true">·</span>
<span v-if="jobField(job, 'job_type')">{{ jobField(job, 'job_type') }}</span>
<span v-if="jobField(job, 'experience')" aria-hidden="true">·</span>
<span v-if="jobField(job, 'experience')">{{ labels.experience }} {{ jobField(job, 'experience') }}</span>
</span>
</span>
<span class="career-job-chevron" aria-hidden="true"></span>
</button>
<div v-show="expandedId === job.id" class="career-job-body">
<div class="career-job-block">
<h4>{{ labels.responsibilities }}</h4>
<ul>
<li v-for="(item, i) in jobField(job, 'responsibilities')" :key="'r-' + job.id + '-' + i">{{ item }}</li>
</ul>
</div>
<div class="career-job-block">
<h4>{{ labels.requirements }}</h4>
<ul>
<li v-for="(item, i) in jobField(job, 'requirements')" :key="'q-' + job.id + '-' + i">{{ item }}</li>
</ul>
</div>
<a class="btn btn-primary" href="#" @click.prevent="openApply(job.id)">{{ labels.apply }}</a>
</div>
</li>
</ul>
</template>

<template v-else>
<p class="career-openings-empty">{{ labels.empty }}</p>
</template>
</template>
</div>
</div>
</section>
</div>

<Teleport to="body">
<div
  v-if="applyOpen"
  class="career-apply-overlay"
  role="presentation"
  @click.self="closeApply"
>
  <div
    class="career-apply-modal"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="'career-apply-title'"
  >
    <div class="career-apply-modal__head">
      <h2 id="career-apply-title">{{ labels.formTitle }}</h2>
      <button
        type="button"
        class="career-apply-modal__close"
        :aria-label="labels.formClose"
        @click="closeApply"
      >
        ×
      </button>
    </div>

    <form class="form career-apply-form" novalidate @submit="onApplySubmit">
      <div class="career-apply-form__body">
        <div v-if="applyJobTitle" class="career-apply-job">
          <span class="career-apply-job__label">{{ labels.formJob }}</span>
          <strong>{{ applyJobTitle }}</strong>
        </div>

        <div class="career-apply-grid">
          <div class="field">
            <label for="apply-name">{{ labels.formName }} <span class="req">*</span></label>
            <input
              id="apply-name"
              v-model="applyForm.name"
              type="text"
              :placeholder="labels.phName"
              required
              autocomplete="name"
            />
          </div>

          <div class="field">
            <span class="career-apply-label">{{ labels.formGender }} <span class="req">*</span></span>
            <div class="career-apply-gender" role="radiogroup" :aria-label="labels.formGender">
              <label class="career-apply-radio">
                <input v-model="applyForm.gender" type="radio" name="apply-gender" value="male" />
                <span>{{ labels.formGenderMale }}</span>
              </label>
              <label class="career-apply-radio">
                <input v-model="applyForm.gender" type="radio" name="apply-gender" value="female" />
                <span>{{ labels.formGenderFemale }}</span>
              </label>
            </div>
          </div>

          <div class="field">
            <label for="apply-phone">{{ labels.formPhone }} <span class="req">*</span></label>
            <input
              id="apply-phone"
              v-model="applyForm.phone"
              type="tel"
              :placeholder="labels.phPhone"
              required
              autocomplete="tel"
            />
          </div>

          <div class="field">
            <label for="apply-email">{{ labels.formEmail }} <span class="req">*</span></label>
            <input
              id="apply-email"
              v-model="applyForm.email"
              type="email"
              :placeholder="labels.phEmail"
              required
              autocomplete="email"
            />
          </div>

          <div class="field">
            <label for="apply-school">{{ labels.formSchool }} <span class="req">*</span></label>
            <input
              id="apply-school"
              v-model="applyForm.school"
              type="text"
              :placeholder="labels.phSchool"
              required
            />
          </div>

          <div class="field">
            <label for="apply-location">{{ labels.formLocation }} <span class="req">*</span></label>
            <input
              id="apply-location"
              v-model="applyForm.location"
              type="text"
              :placeholder="labels.phLocation"
              required
              autocomplete="address-level2"
            />
          </div>

          <div class="field career-apply-grid__full">
            <label for="apply-bio">
              {{ labels.formBio }} <span class="req">*</span>
              <span class="career-apply-hint">（{{ labels.formBioHint }}）</span>
            </label>
            <textarea
              id="apply-bio"
              v-model="applyForm.bio"
              :placeholder="labels.phBio"
              maxlength="200"
              rows="3"
              required
            />
            <p class="career-apply-counter" :class="{ 'is-full': bioLen >= 200 }">{{ bioLen }} / 200</p>
          </div>

          <div class="field career-apply-grid__full">
            <label for="apply-resume">
              {{ labels.formResume }} <span class="req">*</span>
              <span class="career-apply-hint">（{{ labels.formResumeHint }}）</span>
            </label>
            <div class="career-apply-resume">
              <input
                id="apply-resume"
                ref="resumeInputRef"
                class="career-apply-resume__input"
                type="file"
                accept="application/pdf,.pdf"
                @change="onResumeChange"
              />
              <label for="apply-resume" class="btn btn-outline career-apply-resume__btn">{{ labels.formResumePick }}</label>
              <span class="career-apply-resume__path" :title="applyForm.resumeName || undefined">
                {{ applyForm.resumeName || labels.formResumeEmpty }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="career-apply-form__foot">
        <div
          class="form-msg"
          :class="{ show: applyMsg.show }"
          :style="applyMsg.ok
            ? { background: '#e7f6ec', color: 'var(--green-500)' }
            : { background: '#fdecec', color: 'var(--red-500)' }"
        >
          {{ applyMsg.text }}
        </div>
        <div class="career-apply-actions">
          <button class="btn btn-outline" type="button" @click="closeApply">{{ labels.formCancel }}</button>
          <button class="btn btn-primary" type="submit" :disabled="applySubmitting">
            {{ applySubmitting ? labels.formSubmitting : labels.formSubmit }}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
</Teleport>

</template>
