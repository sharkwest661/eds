import axios from "axios";
// import { EDU_URL } from "./constants";
import { Languages } from "../../utils/statics/constants";
import { useAuthStore } from "../../store/useAuthStore";

const token = useAuthStore.getState().token;
const EDU_URL = import.meta.env.VITE_EDU_URL;

const getAxiosHeaders = () => ({
  Token: token || JSON.parse(localStorage.getItem("notSafeAuthToken")),
});

export const getCompanyData = async (lang = Languages["aze"]) => {
  const url = EDU_URL + `/home/${lang}`;
  return axios(url);
};

export const addUser = async (body) => {
  const url = EDU_URL + "/addUser";
  return axios.post(url, body);
};

export const accessToken = async (body) => {
  const url = EDU_URL + "/accessToken";
  return axios.post(url, body);
};

export const checkEmail = async (email) => {
  const url = EDU_URL + `/checkEmail/${email}`;
  return axios(url);
};

export const checkUsername = async (username) => {
  const url = EDU_URL + `/checkUsername/${username}`;
  return axios(url);
};

export const getTopics = async () => {
  const url = EDU_URL + "/getTopics";
  return axios(url);
};

export const getTopTopics = async () => {
  const url = EDU_URL + "/getTopTopics";
  return axios(url);
};

export const getExamTypes = async () => {
  const url = EDU_URL + "/examTypes";
  return axios(url);
};

export const getExams = async (body) => {
  const url = EDU_URL + "/getExams";
  return axios.post(url, body, {
    headers: getAxiosHeaders(),
  });
};

export const getExamDetail = async (id) => {
  const url = EDU_URL + `/getExamDetail/${id}`;
  return axios(url, {
    headers: getAxiosHeaders(),
  });
};

export const getExamQuestions = async (id) => {
  const url = EDU_URL + `/getExamQuestions/${id}`;
  return axios.get(url, {
    headers: getAxiosHeaders(),
  });
};
