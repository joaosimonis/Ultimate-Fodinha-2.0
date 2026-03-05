<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <MiniPlayer />
  </v-app>
</template>

<script lang="ts" setup>
  import MiniPlayer from './modules/music/components/MiniPlayer.vue';
</script>
