import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  // https://github.com/microsoft/monaco-editor/blob/415b279fa04c40447ebb5bbbde50dbc078fffe9f/samples/browser-esm-vite-react/src/userWorker.ts
  getWorker(_, label): Worker {
    if (label === 'json') {
      return new JsonWorker()
    }

    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker()
    }

    return new EditorWorker()
  },
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
