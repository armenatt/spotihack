<template>
  <div
    :class="{ 'progress-bar': true, 'progress-bar--disabled': disabled }"
    ref="progressBar"
    @mousedown="onClick"
  >
    <div class="progress-bar__background"></div>
    <div
      v-if="!disabled"
      class="progress-bar__active"
      :style="{
        width: activeWidth + 'px',
        background: mouseDown ? 'var(--green)' : '',
      }"
    >
      <div v-if="!disabled" class="progress-bar__thumb"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["mousepressed", "mousereleased"]);
const progressBar = useTemplateRef("progressBar");

const percentage = defineModel<number>({
  required: true,
  validator: (value: number) => value > -1 && value <= 100,
});

const progressBarWidth = ref(0);
const mouseDown = ref(false);
const mousePosition = ref();

const props = defineProps<{
  disabled?: boolean;
}>();

const observer = new ResizeObserver(() => {
  progressBarWidth.value =
    progressBar.value?.getBoundingClientRect()?.width || 1;
});

onMounted(() => {
  observer.observe(progressBar.value!);
});

const activeWidth = computed(() => {
  return percentage.value * widthUnit.value;
});

const widthUnit = computed(() => {
  return progressBarWidth.value / 100;
});

const calculateDirectionAndDiff = (event: MouseEvent) => {
  const diff = Math.round(
    event.x -
      (progressBar.value?.getBoundingClientRect()?.x! +
        percentage.value * widthUnit.value)
  );
  const normalizedWidth = Math.abs(percentage.value * widthUnit.value);
  const normalizedDiff = Math.round(
    Math.abs((normalizedWidth + diff) / progressBarWidth.value) * 100
  );

  if (normalizedDiff > 100) {
    return 100;
  }

  if (event.x <= progressBar.value?.getBoundingClientRect()?.x!) {
    return 0;
  }

  return normalizedDiff;
};

window.addEventListener("mouseup", () => {
  mouseDown.value = false;
  emit("mousereleased");
});

window.addEventListener("mousemove", (event) => {
  if (mouseDown.value) {
    mousePosition.value = Math.abs(event.pageX);
    percentage.value = calculateDirectionAndDiff(event);
  }
});

const onClick = (event: MouseEvent) => {
  if (props.disabled) return;
  mouseDown.value = true;
  emit("mousepressed");
  percentage.value = calculateDirectionAndDiff(event);
};

onBeforeUnmount(() => {
  window.removeEventListener("mouseup", () => {});
  window.removeEventListener("mousemove", () => {});
});

watch(
  () => mouseDown.value,
  () => {
    if (mouseDown.value) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "initial";
    }
  }
);
</script>

<style lang="scss">
.progress-bar {
  $self: &;
  height: 4px;
  width: 100%;
  position: relative;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    #{$self}__active {
      background-color: var(--green);
    }
    #{$self}__thumb {
      display: block;
    }
  }

  &--disabled {
    user-select: none;
    pointer-events: none;
  }

  &__background {
    position: absolute;
    height: 4px;
    left: 0;
    width: 100%;
    border-radius: 5px;

    background-color: hsla(0, 0%, 100%, 0.3);
  }

  &__active {
    position: absolute;
    left: 0;
    height: 4px;
    border-radius: 5px;

    background-color: var(--white);
  }

  &__thumb {
    display: none;
    position: absolute;
    right: -5px;
    bottom: -4px;
    height: 12px;
    width: 12px;
    background-color: var(--white);
    border-radius: 50%;
  }
}
</style>
