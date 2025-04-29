// eslint-disable-next-line @typescript-eslint/no-require-imports
// const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import LucideIcon from '@sk-web-gui/lucide-icon';
import { cx, useForkRef } from '@sk-web-gui/react';
import { DeltaStatic, Sources } from 'quill';
import React, { useEffect, useRef } from 'react';
import ReactQuill, { UnprivilegedEditor, Value } from 'react-quill';

// FOR CUSTOM TOOLBAR LOOK AT:
// https://medium.com/@mircea.calugaru/react-quill-editor-with-full-toolbar-options-and-custom-buttons-undo-redo-176d79f8d375

export const RichTextEditor = React.forwardRef<
  UnprivilegedEditor,
  {
    value: Value;
    onChange: ((value: string, delta?: DeltaStatic, source?: Sources, editor?: UnprivilegedEditor) => void) | undefined;
    toggleModal?: () => void;
    isMaximizable?: boolean;
    readOnly?: boolean;
    advanced?: boolean;
    errors?: boolean;
    containerLabel?: string;
  }
>(
  (
    {
      value,
      onChange,
      toggleModal = () => {},
      isMaximizable = false,
      readOnly = false,
      // advanced = false,
      // errors = false,
      containerLabel = '',
    },
    ref
  ) => {
    const simpleOptions = [
      [{ header: 1 }],
      [{ header: 2 }],
      ['bold'],
      ['italic'],
      [{ list: 'bullet' }],
      [{ list: 'ordered' }],
    ];

    // const advancedOptions = [
    //   [{ header: 1 }, { header: 2 }], // custom button values
    //   ['bold', 'italic', 'underline', 'strike'],
    //   ['blockquote', 'code-block'],
    //   [{ list: 'bullet' }],
    //   [{ list: 'ordered' }],
    //   [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    //   [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    //   [{ direction: 'rtl' }], // text direction
    //   [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //   [{ font: [] }],
    //   [{ align: [] }],
    //   ['clean'], // remove formatting button
    // ];

    const internalRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
      if (internalRef.current) {
        const editor = internalRef.current.getEditor();
        if (editor?.keyboard) {
          editor.keyboard.addBinding({ key: '9' }, () => null);
        }
      }
    }, [internalRef]);

    const modules = {
      toolbar:
        isMaximizable ?
          {
            container: `#toolbar-${containerLabel}`,
          }
        : simpleOptions,
    };

    return (
      <div className="h-full ">
        {isMaximizable && (
          <>
            <div id={`toolbar-${containerLabel}`} className="!border-b-0 w-full flex justify-between">
              <div>
                <span className="ql-formats">
                  <button aria-label="Välj rubriknivå 1" className="ql-header" value="1" />
                </span>
                <span className="ql-formats">
                  <button aria-label="Välj rubriknivå 2" className="ql-header" value="2" />
                </span>
                <span className="ql-formats">
                  <button aria-label="Välj fetstil" className="ql-bold" />
                </span>
                <span className="ql-formats">
                  <button aria-label="Välj kursiv" className="ql-italic" />
                </span>
                <span className="ql-formats">
                  <button aria-label="Välj punktlista" className="ql-list" value="bullet" />
                </span>
                <span className="ql-formats">
                  <button aria-label="Välj ordnad lista" className="ql-list" value="ordered" />
                </span>
              </div>
              <div className="grow"></div>
              <div className="grow-0">
                <span className="ql-formats !mr-0">
                  <button
                    aria-label="Förstora textredigerare"
                    data-cy={`${containerLabel}-rich-text-modal-button`}
                    onClick={() => {
                      toggleModal();
                    }}
                    className="ql-maximize"
                  >
                    {/* <OpenInFullIcon fontSize="large" className="material-icon mr-sm" aria-hidden="true" /> */}
                    <LucideIcon name="move-diagonal" />
                  </button>
                </span>
              </div>
            </div>
          </>
        )}

        <div role="textbox">
          <ReactQuill
            preserveWhitespace={true}
            ref={useForkRef(ref as React.Ref<ReactQuill>, internalRef)}
            readOnly={readOnly}
            className={cx(`mb-md h-[80%]`)}
            value={value}
            onChange={(val, delta, source, editor) => {
              return onChange?.(val, delta, source, editor);
            }}
            modules={modules}
          />
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
