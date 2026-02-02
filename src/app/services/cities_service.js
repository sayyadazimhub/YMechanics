import { addCityDal, getAllCitiesDal, getCitiesByStateDal, getCityByIdDal, updateCityDal, deleteCityDal } from "../dal/cities_dal";

export const addCityService = async (cityData) => {
    try {
        const newCity = await addCityDal(cityData);
        return { message: "City added successfully", statusCode: "201", data: newCity };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const getCitiesService = async (stateId = null) => {
    try {
        let cities;
        if (stateId) {
            cities = await getCitiesByStateDal(stateId);
        } else {
            cities = await getAllCitiesDal();
        }
        return { message: "Cities fetched successfully", statusCode: "200", data: cities };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const getCityByIdService = async (id) => {
    try {
        const city = await getCityByIdDal(id);
        if (!city) return { message: "City not found", statusCode: "404" };
        return { message: "City fetched successfully", statusCode: "200", data: city };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const updateCityService = async (id, cityData) => {
    try {
        const updatedCity = await updateCityDal(id, cityData);
        return { message: "City updated successfully", statusCode: "200", data: updatedCity };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const deleteCityService = async (id) => {
    try {
        await deleteCityDal(id);
        return { message: "City deleted successfully", statusCode: "200" };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};
