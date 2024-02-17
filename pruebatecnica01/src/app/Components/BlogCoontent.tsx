import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Header from './Header';
import { Fab, Drawer, TextField, Chip } from '@mui/material';
import Article from './Article';
import Recents from './Recents';
import Filters from './Filters';
import Editor from './Editor';
import { useApi } from '@/customHooks/useApi';
import { ApiConstants } from '../utils/constants/ApiConstants';
import styled from 'styled-components';
import { Button, Spin, Upload, message } from 'antd';
import ErrorPlaceHolder from '../placeholders/ErrorPlaceHolder';
import NoDataPlaceholder from '../placeholders/NoDataPlaceholder';
import { isEmpty, isNil } from 'lodash';
import { articleInterface } from '../Types/appTypes';
import type { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import OfflineArticles from './OfflineArticles';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};



const filtersNames = [
    {
        name: 'Titulo',
        type: 'text',
        id: 'title',
    },
    {
        name: 'Contenido',
        type: 'text',
        id: 'content',
    },
    {
        name: 'Autor',
        type: 'text',
        id: 'author',
    },
    // {
    //     name: 'Fecha',  ??????????????
    //     type: 'text',
    //     id: 'publicationDate',
    // },
];

type mainProps={
    offlineMode:boolean
    setOfflineMode:Dispatch<SetStateAction<boolean>>
}

const BlogContent = (props:mainProps) => {
    const {offlineMode,setOfflineMode} = props
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<null | articleInterface[]>(null);
    const [errorData, setErrorData] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [loaderAdd, setLoaderAdd] = useState(false)
    const [dataForm, setDataForm] = useState<articleInterface>({
        author: '',
        articleId: '',
        content: '',
        imageUrl: '',
        publicationDate: '',
        title: ''
    })
    const [fileList, setFileList] = useState<any>(null);
    const [errorAuthor, setErrorAuthor] = useState(false)
    const [errorTitle, setErrorTitle] = useState(false)
    const [errorContent, SetErrorContent] = useState(false)

    const handleFileChange = (info: any) => {
        let fileList: any = [...info.fileList];

        // Limitar el número de archivos a 1
        fileList = fileList.slice(-1);

        // Actualizar la lista de archivos
        setFileList(fileList);
    };

    const resetValues = () => {
        setDataForm(
            {
                author: '',
                articleId: '',
                content: '',
                imageUrl: '',
                publicationDate: '',
                title: ''
            }
        )
    }




    const addArticlefn = async () => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = dataForm.content;

        if (dataForm.content.trim() == '' || tempElement.innerText.trim() == '' || !dataForm.content) {
            SetErrorContent(true)
        }
        else{
            SetErrorContent(false)
        }
        if (dataForm.author.trim() == '' || dataForm.author == '' || !dataForm.author) {
            setErrorAuthor(true)
        }
        else{
            setErrorAuthor(false)
        }
        if (dataForm.title.trim() == '' || dataForm.title == '' || !dataForm.title) {
            setErrorTitle(true)
            return
        }
        else{
            setErrorTitle(false)
        }
        setLoaderAdd(true)
        try {
            const formData = new FormData();

            // Agregar el archivo al objeto FormData
            if (fileList && fileList.length > 0) {
                formData.append('imageUrl', fileList[0].originFileObj);
            }
            formData.append('title', dataForm.title)
            formData.append('author', dataForm.author)
            formData.append('publicationDate', (dayjs().format('DD/MM/YYYY H:mm')))
            formData.append('content', dataForm.content)

            const response = await useApi(ApiConstants.POST_APP_ADDARTICLES, 'post', formData)

            if (response && response.data) {
                setIsDrawerOpen(false)
                resetValues()
                getAllArticlesFn()
            }

        } catch (error) {
        } finally {
            setLoaderAdd(false)
        }
    }
useEffect(() => {
  if (isDrawerOpen==false) {
    resetValues()
    
  }
}, [isDrawerOpen])


    useEffect(() => {
        getAllArticlesFn();
    }, []);

    const getAllArticlesFn = async () => {
        setData(null);
        setLoading(true);
        setErrorData(false);
        try {
            const data = JSON.parse(localStorage.getItem('editvalues') ?? '')
            const response = await useApi(ApiConstants.POST_APP_GETALLARTICLES, 'post', data);
            if (response && response.data && response.data.articles) {
                setData(response.data.articles);
            }
        } catch (error) {
            setErrorData(true);
        } finally {
            setLoading(false);
        }
    };



    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {fileList && fileList[0] ? <i className='fas fs-3 fa-circle-check text-success'></i> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>
                {fileList ? fileList[0]?.name : 'Subir imagen'}
            </div>
        </button>
    );


    return (
        <BlogContentContainer className='d-flex m-auto px-0 px-md-4'>
            <div className='col-12 col-md-9 pe-0 pe-md-4 br' style={{ position: 'relative' }}>
                <div className='col-12 d-none d-md-block'>
                    <Filters filtersNames={filtersNames} getAllArticlesFn={getAllArticlesFn}/>
                </div>

                <div className='pb-5' style={{ overflow: 'auto', height: '82vh' }}>
                    <div className='col-12 d-block d-md-none'>
                        <Filters filtersNames={filtersNames} getAllArticlesFn={getAllArticlesFn} />
                    </div>

                    {isNil(data) === true && loading === true && errorData === false && (
                        <div className='col-12 d-flex justify-content-center'>
                            <Spin className='pt-5 mt-5' size='large' />
                        </div>
                    )}

                    {isNil(data) === true && loading === false && errorData === true && <ErrorPlaceHolder />}

                    {isNil(data) === false && isEmpty(data) === true && loading === false && errorData === false && <NoDataPlaceholder />}

                    {isNil(data) === false && isEmpty(data) === false && loading === false && errorData === false && (
                        <>
                            {data?.map((element: articleInterface) => (
                                <Article onSuccess={getAllArticlesFn} key={element.articleId} article={element} />
                            ))}
                        </>
                    )}
                </div>
                <Fab
                    variant='extended'
                    onClick={(e) => {
                        setIsDrawerOpen(!isDrawerOpen);
                    }}
                    style={{ position: 'absolute', bottom: '5%', right: '5%', color: 'white' }}
                    color='success'
                >
                    <i className='fas fa-plus fs-6 me-0'></i>
                </Fab>
            </div>
            <div className='col-3 d-none d-md-block'>
                <Recents />
                <div className='pointer' onClick={e=>setOfflineMode(true)}>
                <OfflineArticles/>
                </div>
            </div>

            <Drawer
                anchor={'right'}
                open={isDrawerOpen}
                onClose={() => {setIsDrawerOpen(false)
                resetValues()
            }}
            >
                <div className='p-4' style={{ width: '100vw', maxWidth: 700 }}>
                    <div className='d-flex justify-content-between w-100'><div>Agregar articulo</div> <div>
                        <i onClick={() => { setIsDrawerOpen(false)
                        resetValues()
                        }} className='pointer fas fs-5 fa-xmark'></i></div></div>
                    <div className='mt-4'>
                        <Spin spinning={loaderAdd}>
                            <div className='mb-2'>
                                <label className='mb-2 mt-0' htmlFor="">Autor</label>
                                <TextField className='col-12' onChange={(e) => {
                                    setDataForm(data => {
                                        if (!data) {
                                            return data
                                        }
                                        return { ...data, author: e.target.value }
                                    })
                                }} value={dataForm.author} placeholder='Ingresa tu nombre' id="standard-basic" variant="standard" />
                                {errorAuthor && <span className='col-auto text-danger fs-6'>'El nombre del autor es un campo obligatorio'</span>}
                            </div>
                            <label className='mb-2 mt-4' htmlFor="">Ingresa una imagen para el articulo</label>
                            <div style={{ height: 120, overflow: 'hidden' }}>
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="m-auto avatar-uploader"
                                    showUploadList={false}
                                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                    beforeUpload={beforeUpload}
                                    onChange={(e) => {
                                        handleFileChange(e)
                                    }}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            </div>
                            <div className='mb-4'>
                                <label className='mb-2 mt-4' htmlFor="">Titulo</label>
                                <TextField onChange={(e) => {
                                    setDataForm(data => {
                                        if (!data) {
                                            return data
                                        }
                                        return { ...data, title: e.target.value }
                                    })
                                }} value={dataForm.title} placeholder='Ingresa el titulo del Articulo' className='col-12' id="standard-basic" variant="standard" />
                                {errorTitle && <span className=' col-auto text-danger fs-6'>'El campo titulo es obligatorio'</span>}

                            </div>
                            <div className='mb-4'>
                                <label className='mb-2 mt-4' htmlFor="">Contenido</label>
                                <Editor value={dataForm.content} onChange={(e) => {
                                    setDataForm(data => {
                                        if (!data) {
                                            return data
                                        }
                                        return { ...data, content: e }
                                    })
                                }} />
                                {errorContent && <span className=' col-auto text-danger fs-6'>'El contenido es obligatorio'</span>}

                            </div>
                            <div className='mb-4'>
                                {/* Etiquetas */}
                                <div className='d-flex column-gap-4 mt-3 row-gap-2' style={{ flexWrap: 'wrap' }}>
                                    {/* <Chip label="Chip Filled" />
                                    <Chip label="Chip Filled" />
                                    <Chip label="Chip Filled" />
                                    <Chip label="Chip +" /> */}
                                </div>
                            </div>
                        </Spin>

                        <div className='d-flex col-12 justify-content-between mt-4'>
                            <Button onClick={() => setIsDrawerOpen(false)} danger type='primary'><i className='fas fa-xmark me-1'></i>Cancelar</Button>
                            <Button onClick={() => { addArticlefn() }} type='primary'><i className='fas fa-paper-plane me-1'></i> Agregar</Button>
                        </div>

                    </div>
                </div>
            </Drawer>

        </BlogContentContainer>
    );
};

const BlogContentContainer = styled.div`
padding-bottom: 5px;
  @media (min-width: 768px) {
    .br {
      border-right: 1px solid #7e7e7e;
    }
  }
`;

export default BlogContent;
