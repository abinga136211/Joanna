<template>
  <div class="hero-account" aria-hidden="true">
    <span class="hero-account-glow"></span>
    <span class="hero-account-dots hero-account-dots--tl"></span>
    <span class="hero-account-dots hero-account-dots--br"></span>

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

    <article class="hero-account-card">
      <div class="hero-account-card__head">
        <div class="hero-account-card__titles">
          <h3
            class="hero-account-card__title"
            data-en="Multi-currency collection account"
            data-zh="多币种收款账户"
            data-tw="多幣種收款賬戶"
          >多币种收款账户</h3>
          <p
            class="hero-account-card__sub"
            data-en="Local collection · Settle to HKD"
            data-zh="本地收款 · 统一结算至 HKD"
            data-tw="本地收款 · 統一結算至 HKD"
          >本地收款 · 统一结算至 HKD</p>
        </div>
        <span class="hero-account-live">
          <i></i>
          <span data-en="Live credit" data-zh="实时入账" data-tw="實時入賬">实时入账</span>
        </span>
      </div>

      <ul class="hero-account-rows">
        <li style="--w: 78%; --d: 0ms">
          <span>USD</span>
          <i></i>
          <b>$42,180</b>
        </li>
        <li style="--w: 52%; --d: 80ms">
          <span>EUR</span>
          <i></i>
          <b>€18,640</b>
        </li>
        <li style="--w: 92%; --d: 160ms">
          <span>HKD</span>
          <i></i>
          <b>HK$286,400</b>
        </li>
      </ul>

      <div class="hero-account-card__foot">
        <span data-en="Net inflow today" data-zh="今日净流入" data-tw="今日淨流入">今日净流入</span>
        <strong>+ HK$96,820</strong>
      </div>
    </article>
  </div>
</template>
