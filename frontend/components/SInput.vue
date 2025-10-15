<template>
  <div class="s-input" :class="{ 's-input--error': props.error }">
    <div v-if="props.label" class="s-input__label">{{ props.label }}</div>
    <input
      :value="props.modelValue"
      :type="props.type"
      :placeholder="props.placeholder"
      @input="
        $emit('update:modelValue', (<HTMLInputElement>$event.target).value)
      "
    />
    <div v-if="props.error" class="s-input__error">
      <SIcon icon-name="exclamation-circle" color="red" />
      {{ props.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InputTypeHTMLAttribute } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    error?: string;
    modelValue?: string;
    placeholder?: string;
    type?: InputTypeHTMLAttribute;
  }>(),
  {
    type: "text",
  }
);
</script>

<style lang="scss">
.s-input {
  width: 100%;
  input {
    width: 100%;
    font-size: 16px;
    height: 50px;
    background-color: var(--blackish);
    color: var(--white);
    font-family: "AvenirNext", sans-serif;
    padding: 15px 10px;
    outline: none;
    border: solid 1px var(--light-grey);
    border-radius: 4px;
    transition: 0.05s ease-in;
  }

  input::placeholder {
    font-family: "Avenir Next demi", sans-serif;
    color: var(--light-grey);
  }

  input:hover {
    box-shadow: inset 0 0 0 1px var(--white);
  }

  input:focus-within {
    box-shadow: inset 0 0 0 2.5px var(--white);
  }

  &__label {
    font-size: 14px;
    color: var(--white);
    font-family: "AvenirNext", sans-serif;
    font-weight: 600;
    padding-bottom: 8px;
  }

  &__error {
    display: flex;
    gap: 5px;
    padding-top: 8px;
    color: var(--white);
  }

  &--error {
    input {
      border: solid 1px red;
    }

    input:hover {
      box-shadow: inset 0 0 0 1px red;
    }

    input:focus-within {
      box-shadow: inset 0 0 0 2.5px red;
    }
  }
}
</style>
