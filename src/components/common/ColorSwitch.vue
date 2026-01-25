<template>
  <button
    @click="toggleDark()"
    aria-label="Toggle color scheme"
    class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm0-1.5v-17a8.5 8.5 0 0 1 0 17Z"
      />
    </svg>
  </button>
</template>

<script setup>
const toggleDark = () => {
  const theme =
    localStorage.getItem("color-scheme") === "dark" ? "light" : "dark";

  localStorage.setItem("color-scheme", theme);
  document.querySelector("html").dataset.theme = theme;
};
</script>

<style scoped>
button {
  color: inherit;
  transition: all 0.2s;
}

button:hover,
button:focus-visible {
  background-color: rgb(var(--nav-hover) / 0.12);
}

button:focus-visible {
  outline: 2px solid rgb(var(--color-primary) / 0.5);
  outline-offset: 2px;
}
</style>
