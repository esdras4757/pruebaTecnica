import { Chip, Drawer, TextField } from '@mui/material'
import { Button, Spin, Upload, message } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { articleInterface } from '../Types/appTypes';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import type { GetProp, UploadProps } from 'antd';
import Editor from './Editor';
import { useApi } from '@/customHooks/useApi';
import { ApiConstants } from '../utils/constants/ApiConstants';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { isEmpty, isNil } from 'lodash';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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



interface DrawerInterface {
    isDrawerOpen: boolean
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
    id: string
    onSuccess: () => void
}

const DraweEditArticle = (props: DrawerInterface) => {
    const { isDrawerOpen, setIsDrawerOpen, id, onSuccess } = props
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<null | articleInterface>(null);
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

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {fileList && fileList[0] ? <i className='fas fs-3 fa-circle-check text-success'></i> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>
                {fileList ? fileList[0]?.name : 'Subir imagen'}
            </div>
        </button>
    );

    useEffect(() => {
        if (data && isEmpty(data) == false) {
            setFileList([{ name: data.imageUrl }])
            setDataForm(
                {
                    author: data.author,
                    articleId: data.articleId,
                    content: data.content,
                    imageUrl: data.imageUrl,
                    publicationDate: data.publicationDate,
                    title: data.title
                }
            )
        }
    }, [data])


    const addArticlefn = async () => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = dataForm.content;

        if (dataForm.content.trim() == '' || tempElement.innerText.trim() == '' || !dataForm.content) {
            SetErrorContent(true)
        }
        else {
            SetErrorContent(false)
        }
        if (dataForm.author.trim() == '' || dataForm.author == '' || !dataForm.author) {
            setErrorAuthor(true)
        }
        else {
            setErrorAuthor(false)
        }
        if (dataForm.title.trim() == '' || dataForm.title == '' || !dataForm.title) {
            setErrorTitle(true)
            return
        }
        else {
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

            const response = await useApi(ApiConstants.POST_APP_UPDATEARTICLESBYID + '/' + dataForm.articleId, 'put', formData)

            if (response && response.data) {
                onSuccess()
            }

        } catch (error) {
        } finally {
            setLoaderAdd(false)
        }
    }

    useEffect(() => {
        if (isDrawerOpen && id != '' && id) {
            getAllArticlesFn(id);
        }
        setErrorData(true)

    }, [isDrawerOpen]);


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

    const getAllArticlesFn = async (id: string) => {
        setData(null);
        setLoading(true);
        setErrorData(false);
        try {
            const response = await useApi(ApiConstants.POST_APP_GETARTICLESBYID + '/' + id, 'get', {});
            if (response && response.data) {
                setData(response.data);
                resetValues()
            }
        } catch (error) {
            setErrorData(true);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (info: any) => {
        let fileList: any = [...info.fileList];

        // Limitar el número de archivos a 1
        fileList = fileList.slice(-1);

        // Actualizar la lista de archivos
        setFileList(fileList);
    };

    return (
        <div>
            <Drawer
                anchor={'right'}
                open={isDrawerOpen}
                onClose={() => {
                    resetValues()
                    setIsDrawerOpen(false)
                }}
            >
                <Spin spinning={loading}>
                    <div className='p-4' style={{ width: '100%', maxWidth: 700 }}>
                        <div className='d-flex justify-content-between w-100'><div>Editar articulo</div> <div>
                            <i onClick={() => {
                                setIsDrawerOpen(false)
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
                                <Button onClick={() => { addArticlefn() }} type='primary'><i className='fas fa-save me-1'></i> Guardar</Button>
                            </div>

                        </div>
                    </div>
                </Spin>
            </Drawer>
        </div>
    )
}

export default DraweEditArticle
