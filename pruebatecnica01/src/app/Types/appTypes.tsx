import { ApiConstants } from "@/app/utils/constants/ApiConstants"

export interface articleInterface{
    author: string,
    articleId: string,
    content: string,
    imageUrl: string,
    publicationDate: string,
    title: string
}

export type ApiEndpointType = typeof  ApiConstants[keyof typeof ApiConstants]


export interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    readOnly:boolean
}

export type FiltersNamesType = {
    name: string;
    type: string;
    id: string;
  }[];
  