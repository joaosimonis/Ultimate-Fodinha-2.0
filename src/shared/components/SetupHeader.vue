<template>
  <v-app-bar flat density="comfortable" class="px-2">
    <v-container class="header-content py-0">
      <v-btn icon variant="text" size="large" aria-label="Voltar" @click="goBack">
        <v-icon icon="mdi-arrow-left" size="28" />
      </v-btn>
      <h3 class="header-title font-weight-bold text-center">
        <v-icon v-if="titleIcon" :icon="titleIcon" size="24" class="mr-2" />
        <span>{{ title }}</span>
      </h3>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

interface SetupPageHeaderProps {
  title: string;
  titleIcon?: string;
  backRouteName?: string;
}

const props = withDefaults(defineProps<SetupPageHeaderProps>(), {
  backRouteName: "home",
});

const router = useRouter();

const goBack = () => {
  router.push({ name: props.backRouteName });
};
</script>

<style scoped>
.header-content {
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
