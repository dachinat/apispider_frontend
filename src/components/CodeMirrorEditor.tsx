import { useEffect, useRef, useState } from "preact/hooks";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
} from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { completionKeymap } from "@codemirror/autocomplete";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { javascript } from "@codemirror/lang-javascript";
import { basicDark } from "@fsegurai/codemirror-theme-basic-dark";
import { basicLight } from "@fsegurai/codemirror-theme-basic-light";

const isDarkTheme = () =>
  getComputedStyle(document.documentElement).colorScheme.includes("dark") ||
  document.documentElement.getAttribute("data-theme")?.includes("dark");

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  placeholder?: string;
  readOnly?: boolean;
  forceHeight?: number;
}

export default function CodeMirrorEditor({
  value,
  onChange,
  language,
  readOnly = false,
  forceHeight = 0,
}: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [theme, setTheme] = useState(isDarkTheme() ? "dark" : "light");

  const programmaticValueRef = useRef(value);
  const ignoreNextChangeRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

    let languageExtension: Extension;
    switch (language) {
      case "json":
        languageExtension = json();
        break;
      case "xml":
      case "markup":
        languageExtension = xml();
        break;
      case "javascript":
      case "text":
        languageExtension = javascript();
        break;
      default:
        languageExtension = [];
        break;
    }

    const startState = EditorState.create({
      doc: value || "",
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        foldGutter(),
        bracketMatching(),
        highlightSelectionMatches(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...searchKeymap,
        ]),
        languageExtension,
        ...(theme === "dark" ? [basicDark] : [basicLight]),
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
        ...(!readOnly
          ? [
              EditorView.updateListener.of((update) => {
                if (update.docChanged && !ignoreNextChangeRef.current) {
                  const newValue = update.state.doc.toString();
                  programmaticValueRef.current = newValue;
                  if (onChange) {
                    onChange(newValue);
                  }
                }
                ignoreNextChangeRef.current = false;
              }),
            ]
          : []),
        EditorView.theme({
          "&": {
            height: (forceHeight && `${forceHeight}px`) || "520px",
            fontSize: "14px",
          },
          ".cm-scroller": {
            overflow: "auto",
            fontFamily: "monospace",
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;
    programmaticValueRef.current = value || "";

    return () => {
      view.destroy();
    };
  }, [language, theme, readOnly]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = isDarkTheme() ? "dark" : "light";
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [theme]);

  useEffect(() => {
    if (!viewRef.current) return;

    const currentDoc = viewRef.current.state.doc.toString();

    if (value !== currentDoc && value !== programmaticValueRef.current) {
      ignoreNextChangeRef.current = true;
      programmaticValueRef.current = value;

      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value || "",
        },
      });
      viewRef.current.dispatch(transaction);
    }
  }, [value]);

  return (
    <div className="border border-base-300 rounded-lg overflow-hidden">
      <div ref={editorRef} />
    </div>
  );
}
