<template>
  <div class="menu">
    <nav class="menu__nav">
      <div class="menu__primary-nav">
        <PrimaryNavItem
          v-for="item in primaryItems"
          :label="item.label"
          :icon="item.icon"
          :to="item.to"
          :icon-active="item.iconActive"
        />
      </div>
      <div class="menu__secondary-nav">
        <!-- <SecondaryNavItem
          v-for="item in props?.secondaryItems"
          :title="item.title"
          :subtitle="item.subtitle"
          :selected="item.selected"
        /> -->
        <div v-if="!props.secondaryItems?.length" class="menu__empty">
          NET NICHEGO
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import PrimaryNavItem from "./PrimaryNavItem.vue";
import SecondaryNavItem from "./SecondaryNavItem.vue";

const props = defineProps<{
  secondaryItems?: any[];
}>();

const primaryItems = ref([
  {
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
    to: "/",
  },
  // {
  //   label: "Search",
  //   icon: "search",
  //   iconActive: "search-fill",
  //   to: "/search",
  // },
  {
    label: "Profile",
    icon: "profile-outline",
    iconActive: "profile-fill",
    to: "/profile",
  },
  {
    label: "Playlists",
    icon: "playlist",
    iconActive: "playlist-fill",
    to: "/playlists",
  },
  {
    label: "Favourite Tracks",
    icon: "favourite",
    iconActive: "favourite-fill",
    to: "/tracks",
  },
]);
</script>

<style lang="scss">
.menu {
  resize: horizontal;
  width: 420px;

  &__nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;
    align-items: stretch;
  }

  &__primary-nav {
    background-color: var(--blackish);
    padding: 8px 12px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar {
    opacity: 0;
  }

  ::-webkit-scrollbar-thumb {
    opacity: 0;
    background: rgba(var(--white), 0.1);
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
  }

  &__secondary-nav {
    background-color: var(--blackish);
    padding: 8px 12px;
    border-radius: 10px;
    height: 80vh;
    overflow-y: scroll;
  }

  &__empty {
    color: var(--white);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
