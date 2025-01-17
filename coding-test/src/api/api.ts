import { QueryProps } from "../types/type";

export const getUserData = async ({count, gender, birthday}: QueryProps) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_IRONTRAIN_API_URL}/api/v2/persons?_quantity=${count}&_gender=${gender}&_birthday_start=${birthday}`);
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log('fail');
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
}