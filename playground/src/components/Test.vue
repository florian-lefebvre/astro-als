<script setup lang="ts">
import { getAlsData } from "als:astro";

const data = getAlsData();
</script>

<template>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
</template>