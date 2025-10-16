<template>
  <button
    :class="{
      's-button': true,
      [`s-button--variant-${props.type}`]: props.type,
      's-button--disabled': props.disabled,
      's-button--icon-only': props.iconOnly,
    }"
  >
    <SIcon
      v-if="icon.length"
      class="s-button__icon"
      :icon-name="icon"
      :color="iconColor"
      :size="iconSize"
    />
    <span> <slot /></span>
  </button>
</template>

<script setup lang="ts">
enum EButtonVariants {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TEXT = "text",
}

const props = withDefaults(
  defineProps<{
    type?: `${EButtonVariants}`;
    disabled?: boolean;
    icon?: string;
    iconColor?: string;
    iconSize?: number;
    iconOnly?: boolean;
  }>(),
  {
    type: EButtonVariants.PRIMARY,
    disabled: false,
    iconOnly: false,
    icon: "",
    iconColor: "black",
  }
);
</script>

<style lang="scss">
.s-button {
  $self: &;
  font-size: 1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-family: "Avenir Next", sans-serif;
  font-weight: bold;
  position: relative;
  border: none;
  outline: none;
  padding: 0.5rem 1.5rem;
  width: 100%;

  &__icon {
  }

  &--disabled {
    pointer-events: none;
    opacity: 0.3;
    transform: scale(1);
  }

  &--icon-only {
    justify-content: center;
    margin-right: 0;
    width: 4rem;
    height: 4rem;
    #{$self}__icon {
      margin-right: 0 !important;
    }
  }

  &--variant-primary {
    min-height: 3rem;
    background-color: var(--green);
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.25);
    &:has(#{$self}__icon) {
      #{$self}__icon {
        color: var(--black);
        margin-right: 4px;
      }
    }

    &:hover {
      background-color: var(--green-highlight);
    }

    &:after {
      content: "";
      top: -6px;
      left: -6px;
      border: 3px solid var(--white);
      border-radius: 9999px;
      position: absolute;
      display: block;
      height: calc(100% + 12px);
      width: calc(100% + 12px);
      border-color: transparent;
      box-sizing: border-box;
    }

    &:focus-visible::after {
      border-color: var(--white);
    }

    &:active {
      background-color: var(--green-pressed);
    }
  }

  &--variant-secondary {
    background-color: var(--white);
    &:has(#{$self}__icon) {
      #{$self}__icon {
        color: var(--black);
        margin-right: 4px;
      }
    }

    &:hover {
      transform: scale(1.04);
    }
    &:active {
      transform: scale(1);
      background-color: var(--white-pressed);
    }
  }

  &--variant-text {
    color: var(--white-subdued);
    background: transparent;
    border: none;

    &:has(#{$self}__icon) {
      #{$self}__icon {
        color: currentColor;
        margin-right: 4px;
      }
    }

    &:hover {
      transform: scale(1.04);
      color: white;
    }
    &:active {
      transform: scale(1);
      opacity: 0.7;
    }
  }
}
</style>
