<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <main>
    <h1>This is a home page</h1>
    <span>{{ t("i18n_test") }}</span>
  </main>
</template>
