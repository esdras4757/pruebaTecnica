import axios, { Axios, AxiosPromise, AxiosResponse } from 'axios';
import openNotification from '../app/Components/notify';
import { useDispatch, useSelector } from 'react-redux';
import { appState } from '@/app/redux/types';
import { useEffect } from 'react';
import { changeIsLoading } from '@/app/redux/actions/appActions';
import store from '../app/redux/store/store';
import { ApiEndpointType } from '@/app/Types/appTypes';

type MethodType = 'post' | 'get' | 'update' | 'delete' |'put';


export const useApi = <T>(constant: ApiEndpointType, method: MethodType, data: T):AxiosPromise => {
   
    return axios({
        method,
        url: constant,
        data, 
        withCredentials: true,
    })
    .catch(error=>{
        openNotification('error',error.response?.data??'Ah ocurrido un error intentalo nuevamente',5)
        throw error;
    })
};
