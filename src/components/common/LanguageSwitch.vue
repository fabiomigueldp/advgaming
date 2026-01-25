<template>
  <div class="lang-switch relative">
    <button
      @click="toggleDropdown"
      aria-label="Select language"
      class="lang-trigger flex h-8 cursor-pointer items-center justify-center gap-1 rounded-full px-2 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.008 8.008 0 0 0 5.648 6.667ZM10.03 13c.151 2.439.848 4.73 1.97 6.752A15.905 15.905 0 0 0 13.97 13h-3.94Zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.008 8.008 0 0 0 19.938 13ZM4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.008 8.008 0 0 0 4.062 11Zm5.969 0h3.938A15.905 15.905 0 0 0 12 4.248A15.905 15.905 0 0 0 10.03 11Zm4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.008 8.008 0 0 0-5.648-6.667Z"
        />
      </svg>
      <span class="text-sm font-medium uppercase">{{ currentLocale }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="m12 15l-5-5h10l-5 5Z" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="lang-dropdown absolute right-0 top-full z-50 mt-2 min-w-[140px] rounded-lg border py-1 shadow-xl"
    >
      <a
        v-for="locale in locales"
        :key="locale.code"
        :href="getLocalizedPath(locale.code)"
        class="lang-item flex items-center gap-2 px-4 py-2 text-sm transition-colors"
        :class="{ active: locale.code === currentLocale }"
        @click="isOpen = false"
      >
        <span class="font-medium uppercase">{{ locale.code }}</span>
        <span class="text-xs opacity-70">{{ locale.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  currentLocale: {
    type: String,
    default: "en",
  },
  currentPath: {
    type: String,
    default: "/",
  },
});

const isOpen = ref(false);

const locales = [{ code: "pt", name: "Português" }];

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const getLocalizedPath = (targetLocale) => {
  // Get the current path without the locale prefix
  const pathParts = props.currentPath.split("/").filter(Boolean);
  const supportedLocales = ["pt"];

  // Check if the first segment is a locale
  if (pathParts.length > 0 && supportedLocales.includes(pathParts[0])) {
    // Remove the current locale
    pathParts.shift();
  }

  // Build the new path with the target locale
  const newPath =
    pathParts.length > 0
      ? `/${targetLocale}/${pathParts.join("/")}`
      : `/${targetLocale}/`;

  return newPath;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.lang-trigger {
  background-color: transparent;
  color: inherit;
}

.lang-trigger:hover {
  background-color: rgb(var(--nav-hover) / 0.12);
}

.lang-trigger:focus-visible {
  background-color: rgb(var(--nav-hover) / 0.12);
  outline: 2px solid rgb(var(--color-primary) / 0.4);
  outline-offset: 2px;
}

.lang-dropdown {
  background-color: rgb(var(--card-bg));
  border-color: rgb(var(--card-border));
  color: rgb(var(--card-fg));
}

.lang-item:hover {
  background-color: rgb(var(--muted-bg));
}

.lang-item.active {
  font-weight: bold;
  color: rgb(var(--color-primary));
}
</style>
