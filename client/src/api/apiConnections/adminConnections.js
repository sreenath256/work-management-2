import { toast } from 'react-toastify';
import baseURL from '../baseURL'


export const getAllUsers = async() => {
    try{
        const response = await baseURL.get(`/admin/getAllUsers`);
        if (response) {
            return response.data;
        }
    }catch(error){
        console.error(`Error fetching users: ${error.message}`);
        toast.error("Error fetching users")
    }
}

export const getHeaders = async() => {
    try{
        const response = await baseURL.get(`/admin/getHeaders`);
        if (response) {
            return response.data;
        }
    }catch(error){
        console.error(`Error fetching headers: ${error.message}`);
        toast.error("Error fetching data")
    }
}

export const getPermissions = async() => {
    try{
        const response = await baseURL.get(`/admin/getPermissions`);
        if (response) {
            return response.data;
        }
    }catch(error){
        console.error(`Error fetching permissions: ${error.message}`);
        toast.error("Error fetching data")
    }
}

export const addPermission = async(permission) => {
    try{
        const response = await baseURL.post(`/admin/addPermission`,permission);
        if (response) {
            return response.data;
        }
    }catch(error){
        console.error(`Error adding permission: ${error.message}`);
        toast.error("Error adding permission")
    }
}

export const updateSingleUserActivity = async(id,isActive)=>{
    try{
        const response = await baseURL.patch(`/admin/userStatus`,{id,isActive})
        if(response) return response.data
    }catch(error){
        toast.error(error.message)
    }
}

export const updatePermissions = async(userId,permissions)=>{
    try{
        const response = await baseURL.put(`/admin/updatePermissions`,{userId,permissions})
        if(response) return response.data
    }catch(error){
        toast.error(error.message)
    }
}

export const editProjectName = async(project) => {
    try{
        const response = await baseURL.patch(`/admin/updateProjectName`,project);
        if(response) return response.data
    }catch(error){
        console.error(`Error updating project name: ${error.message}`);
        toast.error("Internal error")
    }
}

export const removeAProject = async(projectId,name) => {
    try{
        const response = await baseURL.patch(`/admin/removeProject`,{projectId,name});
        if(response) return response.data
    }catch(error){
        console.error(`Error removing project: ${error.message}`);
        toast.error("Internal error")
    }
}

export const cloneAProject = async(projectId,name) => {
    try{
        const response = await baseURL.put(`/admin/cloneProject`,{projectId,name});
        if(response) return response.data
    }catch(error){
        console.error(`Error cloning project: ${error.message}`);
        toast.error("Internal error")
    }
}

export const getAllBanners = async()=>{
    try {
        const response = await baseURL.get('/admin/getBanners')
        if(response) return response?.data
    } catch (error) {
        console.error(`Error getting banners : ${error.message}`);
        toast.error("Internal error")
    }
}

export const addNewBanner = async(banner)=>{
    try {
        const formData = new FormData()
        formData.append('banner',banner)
        const response = await baseURL.post('/admin/addBanner',formData,{
            headers:{'Content-Type' : 'multipart/form-data'}
        })
        if(response) return response?.data
    } catch (error) {
        console.error(`Error adding banner : ${error.message}`);
        toast.error("Internal error")
    }
}

export const applyBanner = async(currentBannerId,newBannerId)=>{
    try {
        const response = await baseURL.patch('/admin/applyBanner',{currentBannerId,newBannerId})
        if(response) return response?.data
    } catch (error) {
        console.error(`Error applying banner : ${error.message}`);
        toast.error("Internal error")
    }
}


export const removeBanner = async(bannerId)=>{
    try {
        const response = await baseURL.patch('/admin/removeBanner',{bannerId})
        if(response) return response?.data
    } catch (error) {
        console.error(`Error removing banner : ${error.message}`);
        toast.error("Internal error")
    }
}