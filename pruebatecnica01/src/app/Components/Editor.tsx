import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { EditorProps } from '../Types/appTypes';
const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });


const Editor: React.FC<EditorProps> = ({ value, onChange }) => {

    return (
        <>
            {<EditorContainer>
                {typeof window !== 'undefined' && window.document &&
                    <QuillEditor value={value} onChange={onChange} />
                }
            </EditorContainer>}
        </>
    );
}

export default Editor;

const EditorContainer = styled.div`
    .ql-snow .ql-stroke {
        stroke: white;
    }

    .ql-picker-label {
        color: white;
    }
`;
