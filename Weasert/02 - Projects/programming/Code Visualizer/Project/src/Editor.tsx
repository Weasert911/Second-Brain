import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
}

const EditorPane: React.FC<EditorProps> = ({ code, setCode }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorMount = (editor: any) => {
    setIsEditorReady(true);
    // Set up language-specific configuration
    editor.getModel()?.updateOptions({
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
    });
  };

  return (
    <div className="relative h-full">
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      )}
      <MonacoEditor
        height="100%"
        defaultLanguage="rust"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value ?? '')}
        onMount={handleEditorMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderWhitespace: 'boundary',
        }}
      />
      <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
        Rust
      </div>
    </div>
  );
};

export default EditorPane;
