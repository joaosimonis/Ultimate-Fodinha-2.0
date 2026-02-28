<template>
  <v-app-bar flat density="comfortable" class="px-2">
    <v-container class="d-flex align-center py-0">
      <v-btn icon variant="text" size="large" aria-label="Voltar" @click="goBack">
        <v-icon icon="mdi-arrow-left" size="28" />
      </v-btn>
      <h3 class="font-weight-bold text-center flex-grow-1">{{ title }}</h3>
      <div style="width: 56px" />
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

interface Props {
  title: string;
  backRouteName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  backRouteName: "home",
});

const router = useRouter();

const goBack = () => {
  router.push({ name: props.backRouteName });
};
</script>
