import { addStateDal, getAllStatesDal, getStateByIdDal, updateStateDal, deleteStateDal } from "../dal/states_dal";

export const addStateService = async (stateData) => {
    try {
        const newState = await addStateDal(stateData);
        return { message: "State added successfully", statusCode: "201", data: newState };
    } catch (error) {
        if (error.code === 'P2002') {
            return { message: "State code already exists", statusCode: "400" };
        }
        return { message: error.message, statusCode: "500" };
    }
};

export const getStatesService = async () => {
    try {
        const states = await getAllStatesDal();
        return { message: "States fetched successfully", statusCode: "200", data: states };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const getStateByIdService = async (id) => {
    try {
        const state = await getStateByIdDal(id);
        if (!state) return { message: "State not found", statusCode: "404" };
        return { message: "State fetched successfully", statusCode: "200", data: state };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const updateStateService = async (id, stateData) => {
    try {
        const updatedState = await updateStateDal(id, stateData);
        return { message: "State updated successfully", statusCode: "200", data: updatedState };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const deleteStateService = async (id) => {
    try {
        await deleteStateDal(id);
        return { message: "State deleted successfully", statusCode: "200" };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};
