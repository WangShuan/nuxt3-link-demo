<template>
  <div v-interpolate v-html="data.content"></div>
</template>

<script setup>
import { vInterpolate } from "@/directives/v-interpolate";
const { data } = await useAsyncData('test', () => $fetch('/api/test'))
</script>
