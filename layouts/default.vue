<template>
  <div class="space-y-10">
    <sections-navigation-component />
    <main>
      <slot />
    </main>
    <sections-footer-component />
  </div>
</template>

<style scoped lang="scss">
main {
  @apply container mx-auto relative isolate px-8 lg:px-0;
}
</style>