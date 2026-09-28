<template>
  <div class="hero-visual" aria-hidden="true">
    <span class="hero-visual-dotgrid hero-visual-dotgrid--tl"></span>
    <span class="hero-visual-dotgrid hero-visual-dotgrid--br"></span>
    <span class="hero-visual-blob hero-visual-blob--a"></span>
    <span class="hero-visual-blob hero-visual-blob--b"></span>

    <svg class="hero-visual-routes" viewBox="0 0 440 440" fill="none">
      <path
        class="hero-route"
        d="M88 120 C140 120, 160 200, 220 220"
        stroke="url(#hero-route-grad)"
        stroke-width="2"
        stroke-dasharray="6 8"
      />
      <path
        class="hero-route hero-route--delay"
        d="M360 110 C300 130, 280 190, 220 220"
        stroke="url(#hero-route-grad)"
        stroke-width="2"
        stroke-dasharray="6 8"
      />
      <path
        class="hero-route"
        d="M70 320 C130 300, 170 250, 220 220"
        stroke="url(#hero-route-grad)"
        stroke-width="2"
        stroke-dasharray="6 8"
      />
      <defs>
        <linearGradient id="hero-route-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E1251B" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#E1251B" stop-opacity="0.55" />
        </linearGradient>
      </defs>
    </svg>

    <div class="hero-fx hero-fx--usd">
      <span class="hero-fx-code">USD</span>
      <span class="hero-fx-amt">+12,480</span>
    </div>
    <div class="hero-fx hero-fx--eur">
      <span class="hero-fx-code">EUR</span>
      <span class="hero-fx-amt">+8,260</span>
    </div>
    <div class="hero-fx hero-fx--sgd">
      <span class="hero-fx-code">SGD</span>
      <span class="hero-fx-amt">+5,120</span>
    </div>

    <div class="hero-settle">
      <div class="hero-settle-head">
        <span class="hero-settle-badge" data-en="Cross-border Settlement" data-zh="跨境结算" data-tw="跨境結算">跨境结算</span>
        <span class="hero-settle-live" data-en="Real-time credit" data-zh="实时入账" data-tw="實時入賬">实时入账</span>
      </div>
      <div class="hero-settle-title" data-en="Multi-currency collection account" data-zh="多币种收款账户" data-tw="多幣種收款賬戶">多币种收款账户</div>
      <div class="hero-settle-sub" data-en="Local collection · Settle to HKD" data-zh="本地收款 · 统一结算至 HKD" data-tw="本地收款 · 統一結算至 HKD">本地收款 · 统一结算至 HKD</div>

      <div class="hero-settle-rows">
        <div class="hero-settle-row">
          <span class="hero-settle-ccy">USD</span>
          <span class="hero-settle-bar"><i style="--w:78%"></i></span>
          <span class="hero-settle-val">$42,180</span>
        </div>
        <div class="hero-settle-row">
          <span class="hero-settle-ccy">EUR</span>
          <span class="hero-settle-bar"><i style="--w:56%"></i></span>
          <span class="hero-settle-val">€18,640</span>
        </div>
        <div class="hero-settle-row">
          <span class="hero-settle-ccy">HKD</span>
          <span class="hero-settle-bar hero-settle-bar--active"><i style="--w:92%"></i></span>
          <span class="hero-settle-val">HK$286,400</span>
        </div>
      </div>

      <div class="hero-settle-foot">
        <span data-en="Today's net inflow" data-zh="今日净流入" data-tw="今日淨流入">今日净流入</span>
        <strong>+ HK$96,820</strong>
      </div>
    </div>
  </div>
</template>
