<template>
  <div class="progress-bar">
    <div class="progress-bar__background"></div>
    <div class="progress-bar__active"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.progress-bar {
  height: 4px;
  width: 100%;
  position: relative;

  &__background {
    position: absolute;
    height: 4px;
    left: 0;
    width: 100%;
    background-color: hsla(0, 0%, 100%, 0.3);
  }

  &__active {
    position: absolute;
    left: 0;
    height: 4px;

    background-color: var(--white);
  }
}
</style>
