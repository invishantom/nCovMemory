<template>
  <div id="app">
    <VueMarkdown :watches="readme">{{this.readme}}</VueMarkdown>
  </div>
</template>

<script>
import "whatwg-fetch";
import template from "../../template/README.handlebars";
import generateReadmeFromCsv from "./utils/generateReadmeFromCsv";
import VueMarkdown from "vue-markdown";
const DATA_URL =
  "https://github.com/2019ncovmemory/nCovMemory/blob/master/data/non-fiction.csv";

export default {
  name: "App",
  components: {
    VueMarkdown
  },
  data: () => {
    return {
      readme: undefined
    };
  },
  methods: {
    generateMarkdown: async function() {
      let data = await window.fetch(DATA_URL);
      this.readme = await generateReadmeFromCsv(data, template);
      console.log(this.readme);
    }
  },
  mounted: function() {
    this.generateMarkdown();
  }
};
</script>

<style>
</style>
