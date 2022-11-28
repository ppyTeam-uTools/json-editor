<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

interface IProps {
  modelValue: string
  options: monaco.editor.IStandaloneEditorConstructionOptions
  language?: string
}

const props = withDefaults(defineProps<IProps>(), {
  language: 'json',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'mounted', editor: monaco.editor.IStandaloneCodeEditor): void
  (e: 'disposed'): void
}>()

const elRef = ref<HTMLDivElement>()
let editor: monaco.editor.IStandaloneCodeEditor

onMounted(() => {
  // 实例化 editor
  editor = monaco.editor.create(elRef.value!, {
    ...props.options,
    value: props.modelValue,
    language: props.language,
  })

  // 监听内容变更
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()

    emit('update:modelValue', value)
    emit('change', value)
  })

  emit('mounted', editor)
})

onBeforeUnmount(() => {
  editor.dispose()

  emit('disposed')
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editor || newValue === editor.getValue()) return

    editor.setValue(newValue)
  }
)

watch(
  () => props.language,
  (newValue) => {
    if (!editor) return

    monaco.editor.setModelLanguage(editor.getModel()!, newValue)
  }
)

watch(
  () => props.options,
  (newValue) => {
    if (!editor) return

    editor.updateOptions(newValue)
  },
  { deep: true }
)

defineExpose({
  $el: elRef,
})
</script>

<template>
  <div class="monaco-editor-view" ref="elRef" />
</template>
