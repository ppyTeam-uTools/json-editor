<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import json5 from 'json5'
import { stringify } from '@/utils/json-parser'
import * as monaco from 'monaco-editor'
import {
  monacoDefaultOptions,
  outputViewOptions,
  filterViewOptions,
  inputOptions,
} from '@/utils/monacoOptions'
import MonacoEditor from '@/components/MonacoEditor.vue'

// mainView
let mainEditor: monaco.editor.IStandaloneCodeEditor
const mainViewValue = ref('')
const mainViewOptions = ref<monaco.editor.IStandaloneEditorConstructionOptions>({
  ...monacoDefaultOptions,
  selectOnLineNumbers: true,
})

// outputView
let outputEditor: monaco.editor.IStandaloneCodeEditor
const outputViewValue = ref('')

// filterView
let filterEditor: monaco.editor.IStandaloneCodeEditor
const filterViewValue = computed(() => {
  if (!mainViewValue.value) return ''

  const parsed = json5.parse(mainViewValue.value)

  // eslint-disable-next-line no-new-func
  const ret = new Function('parsed', `return parsed${inputValue.value}`)(parsed)

  if (ret !== undefined) {
    return JSON.stringify(ret, null, 4)
  }

  return '// error'
})

let inputEditor: monaco.editor.IStandaloneCodeEditor
const inputValue = ref('')

onMounted(() => {
  console.log('onMounted')

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    comments: 'ignore',
    trailingCommas: 'ignore',
  })

  mainEditor.onDidPaste(async () => {
    mainViewValue.value = mainEditor.getValue()

    await mainEditor.getAction('editor.action.formatDocument').run()

    const layoutInfo = mainEditor.getLayoutInfo()

    mainEditor.layout({ width: layoutInfo.width - 1, height: layoutInfo.height - 1 })
    mainEditor.layout({ width: layoutInfo.width, height: layoutInfo.height })
  })
})

async function onFormat() {
  await mainEditor.getAction('editor.action.formatDocument').run()

  const layoutInfo = mainEditor.getLayoutInfo()

  mainEditor.layout({ width: layoutInfo.width - 1, height: layoutInfo.height - 1 })
  mainEditor.layout({ width: layoutInfo.width, height: layoutInfo.height })
}

function onStringify() {
  outputViewValue.value = JSON.stringify(json5.parse(mainViewValue.value))
}

function onClearComment() {
  mainEditor.setValue(JSON.stringify(json5.parse(mainViewValue.value), null, 4))

  inputEditor.getAction('editor.action.formatDocument').run()
}
</script>

<template>
  <main class="editor-panel">
    <div class="input-editor-panel" :style="{ width: filterViewValue ? '50%' : '100%' }">
      <MonacoEditor
        class="editor main-editor"
        v-model="mainViewValue"
        :options="mainViewOptions"
        @mounted="(editor) => (mainEditor = editor)"
      />
    </div>

    <div class="output-editor-panel" v-show="filterViewValue">
      <MonacoEditor
        class="editor"
        v-model="outputViewValue"
        :options="outputViewOptions"
        language="text"
        @mounted="(editor) => (outputEditor = editor)"
        v-show="outputViewValue"
      />
      <MonacoEditor
        class="editor"
        :model-value="filterViewValue"
        :options="filterViewOptions"
        @mounted="(editor) => (filterEditor = editor)"
        v-show="filterViewValue"
      />
    </div>
  </main>
  <aside class="control-panel">
    <div class="filter-mode-panel">JSON</div>
    <div class="input-editor-panel">
      <MonacoEditor
        class="editor"
        v-model="inputValue"
        :options="inputOptions"
        @mounted="(editor) => (inputEditor = editor)"
      />
    </div>
    <div class="button-panel">
      <div class="button" @click="onFormat">格</div>
      <div class="button" @click="onClearComment">NC</div>
      <div class="button" @click="onStringify">M</div>
    </div>
  </aside>
</template>

<style lang="scss" scoped></style>
