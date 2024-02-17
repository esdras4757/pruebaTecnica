import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { EditorProps } from '../Types/appTypes';
import ReactQuill from 'react-quill';

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {

    return (
        <>
            {<EditorContainer>
                {typeof window !== 'undefined' && window.document &&
                    <ReactQuill value={value} onChange={onChange} />
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
