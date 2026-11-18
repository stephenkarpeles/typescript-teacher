import type { Monaco } from '@monaco-editor/react'

let configured = false

/** Match the teaching runner: no DOM globals (avoids false errors on names like `status`). */
export function configurePlaygroundMonaco(monaco: Monaco) {
  if (configured) return
  configured = true

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    esModuleInterop: true,
    strict: true,
    lib: ['es2020'],
  })

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })
}
