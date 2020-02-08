<template>
  <div id="app">
    <el-scrollbar class="scrollbar">
      <div class="markdown-body">
        <VueMarkdown :source="readme" :toc="true" :postrender="afterRender"></VueMarkdown>
        <el-backtop target=".el-scrollbar__wrap"></el-backtop>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import "whatwg-fetch";
import template from "../../template/README.handlebars";
import data from "../../data/non-fiction.csv";
import generateReadmeFromCsv from "./utils/generateReadmeFromCsv";
import VueMarkdown from "vue-markdown";

export default {
  name: "App",
  components: {
    VueMarkdown
  },
  data: () => {
    return {
      readme: undefined,
      watch: ["readme"]
    };
  },
  methods: {
    generateMarkdown: async function() {
      this.readme = await generateReadmeFromCsv(data, template);
    },
    afterRender(string) {
      console.log(string);
      return string;
    }
  },
  mounted: function() {
    this.generateMarkdown();
  }
};
</script>

<style>
body,
html,
#app,
.scrollbar {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.markdown-body {
  width: 100vw;
  padding: 50px 15vw;
  box-sizing: border-box;
}
tr :first-child {
  white-space: nowrap;
}
@media only screen and (max-width: 600px) {
  .markdown-body {
    padding: 15px 15px;
    box-sizing: border-box;
    font-size: 0.8em !important;
  }
}
.markdown-body,
.markdown-body blockquote {
  color: #24292e;
  word-wrap: break-word;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.5;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

.markdown-body a {
  border-bottom: none !important;
  background-color: transparent;
  color: #0366d6 !important;
  text-decoration: none;
}

.markdown-body a:hover {
  border-bottom: 1px solid #0366d6 !important;
}

.markdown-body a:active,
.markdown-body a:hover {
  outline-width: 0;
}

.markdown-body strong {
  font-weight: bolder;
}

.markdown-body h1 {
  margin: 0.67em 0;
  font-size: 2em;
}

.markdown-body img {
  border-style: none;
}

.markdown-body code,
.markdown-body kbd,
.markdown-body pre {
  font-size: 1em;
  font-family: monospace, monospace;
  overflow: scroll;
}

.markdown-body hr {
  overflow: visible;
  box-sizing: content-box;
  height: 0;
}

.markdown-body input {
  margin: 0;
  font: inherit;
}

.markdown-body input {
  overflow: visible;
}

.markdown-body [type="checkbox"] {
  box-sizing: border-box;
  padding: 0;
}

.markdown-body * {
  box-sizing: border-box;
}

.markdown-body input {
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
}

.markdown-body hr {
  overflow: hidden;
  margin: 15px 0;
  height: 0;
  border: 0;
  border-bottom: 1px solid #dfe2e5;
  background: 0 0;
}

.markdown-body hr::before {
  display: table;
  content: "";
}

.markdown-body hr::after {
  clear: both;
  display: table;
  content: "";
}

.markdown-body table {
  border-collapse: collapse;
  word-break: keep-all;
  border-spacing: 0;
}

.markdown-body td,
.markdown-body th {
  padding: 0;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body h1 {
  font-weight: 600;
  font-size: 32px;
}

.markdown-body h2 {
  font-weight: 600;
  font-size: 24px;
}

.markdown-body h3 {
  font-weight: 600;
  font-size: 20px;
}

.markdown-body h4 {
  font-weight: 600;
  font-size: 16px;
}

.markdown-body h5 {
  font-weight: 600;
  font-size: 14px;
}

.markdown-body h6 {
  font-weight: 600;
  font-size: 12px;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 10px;
}

.markdown-body blockquote {
  margin: 0;
}

.markdown-body ol,
.markdown-body ul {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
}

.markdown-body ol ol,
.markdown-body ul ol {
  list-style-type: lower-roman;
}

.markdown-body ol ol ol,
.markdown-body ol ul ol,
.markdown-body ul ol ol,
.markdown-body ul ul ol {
  list-style-type: lower-alpha;
}

.markdown-body dd {
  margin-left: 0;
}

.markdown-body code {
  font-size: 14px;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 12px;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
}

.markdown-body::before {
  display: table;
  content: "";
}

.markdown-body::after {
  clear: both;
  display: table;
  content: "";
}

.markdown-body > :first-child {
  margin-top: 0 !important;
}

.markdown-body > :last-child {
  margin-bottom: 0 !important;
}

.markdown-body a:not([href]) {
  color: inherit;
  text-decoration: none;
}

.markdown-body blockquote,
.markdown-body dl,
.markdown-body ol,
.markdown-body p,
.markdown-body pre,
.markdown-body table,
.markdown-body ul {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body hr {
  margin: 24px 0;
  padding: 0;
  height: 0.25em;
  border: 0;
  background-color: #e1e4e8;
}

.markdown-body blockquote {
  padding: 0 1em;
  border-left: 0.25em solid #dfe2e5;
  color: #6a737d;
}

.markdown-body blockquote > :first-child {
  margin-top: 0;
}

.markdown-body blockquote > :last-child {
  margin-bottom: 0;
}

.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  border: solid 1px #c6cbd1;
  border-radius: 3px;
  background-color: #fafbfc;
  box-shadow: inset 0 -1px 0 #959da5;
  color: #444d56;
  vertical-align: middle;
  font-size: 11px;
  line-height: 10px;
  border-bottom-color: #959da5;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid #bbb;
  font-size: 2em;
}

.markdown-body h2 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid #bbb;
  font-size: 1.5em;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5 {
  font-size: 0.875em;
}

.markdown-body h6 {
  color: #6a737d;
  font-size: 0.85em;
}

.markdown-body ol,
.markdown-body ul {
  padding-left: 2em;
}

.markdown-body ol ol,
.markdown-body ol ul,
.markdown-body ul ol,
.markdown-body ul ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body li {
  word-wrap: break-all;
}

.markdown-body li > p {
  margin-top: 16px;
}

.markdown-body li + li {
  margin-top: 0.25em;
}

.markdown-body dl {
  padding: 0;
}

.markdown-body dl dt {
  margin-top: 16px;
  padding: 0;
  font-weight: 600;
  font-style: italic;
  font-size: 1em;
}

.markdown-body dl dd {
  margin-bottom: 16px;
  padding: 0 16px;
}

.markdown-body table {
  display: block;
  overflow: auto;
  width: 100%;
}

.markdown-body table th {
  font-weight: 600;
}

.markdown-body table td,
.markdown-body table th {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr {
  border-top: 1px solid #c6cbd1;
  background-color: #fff;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body img {
  box-sizing: content-box;
  max-width: 100%;
  background-color: #fff;
}

.markdown-body img[align="right"] {
  padding-left: 20px;
}

.markdown-body img[align="left"] {
  padding-right: 20px;
}

.markdown-body code {
  margin: 0;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  background-color: rgba(27, 31, 35, 0.05);
}

.markdown-body pre {
  word-wrap: normal;
}

.markdown-body pre > code {
  margin: 0;
  padding: 0;
  border: 0;
  background: 0 0;
  white-space: pre;
  font-size: 100%;
  word-break: normal;
}

.markdown-body pre code {
  display: inline;
  overflow: visible;
  margin: 0;
  padding: 0;
  max-width: auto;
  border: 0;
  background-color: transparent;
  word-wrap: normal;
  line-height: inherit;
}

.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  border: solid 1px #d1d5da;
  border-radius: 3px;
  background-color: #fafbfc;
  box-shadow: inset 0 -1px 0 #c6cbd1;
  color: #444d56;
  vertical-align: middle;
  font: 11px SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
  line-height: 10px;
  border-bottom-color: #c6cbd1;
}

.markdown-body hr {
  border-bottom-color: #bbb;
}

.markdown-body li > pre {
  margin-top: 5px;
}
</style>
