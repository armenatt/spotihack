<template>
  <div class="s-dropdown">
    <div
      v-if="visible"
      class="s-dropdown__content"
      :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
      ref="dropdown"
      @click="visible = false"
    >
      <slot />
    </div>
    <div class="s-dropdown__target" ref="target" @click="onClick">
      <slot name="target" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

import {
  autoPlacement,
  computePosition,
  flip,
  type Placement,
} from "@floating-ui/dom";

const dropdown = useTemplateRef("dropdown");
const target = useTemplateRef("target");

const props = withDefaults(
  defineProps<{
    placement?: Placement;
  }>(),
  {
    placement: "right",
  }
);

const visible = ref(false);
const pos = ref({
  x: 0,
  y: 0,
});

onClickOutside(
  dropdown,
  () => {
    visible.value = false;
  },
  { ignore: [target] }
);

const onClick = async () => {
  if (visible.value) {
    visible.value = false;
    return;
  }

  visible.value = true;
  await nextTick();
  pos.value = await computePosition(target.value!, dropdown.value!, {
    placement: props.placement,
    middleware: [autoPlacement()],
  });
};
</script>

<style lang="scss">
.s-dropdown {
  &__content {
    position: absolute;
    width: 400px;

    background-color: var(--dark-grey);
    padding: 8px;
    border-radius: 5px;
  }
}
</style>
