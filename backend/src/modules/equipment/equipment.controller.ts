import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import * as equipmentService from "./equipment.service";

export const getAllEquipments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: implement filter
        const { category, status } = req.query;
        const filters: any = {};
        if (category) filters.categoryId = category;
        if (status) filters.status = status;

        const equipments = await equipmentService.getAllEquipments(filters);
        res.status(200).json({ status: "success", data: equipments });
    } catch (error) {
        next(error);
    }
}

export const getEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const equipment = await equipmentService.getEquipmentBySlug(slug as string);
        if (!equipment) {
            throw new ApiError(404, "Equipment not found");
        }
        res.status(200).json({ status: "success", data: equipment });
    } catch (error) {
        next(error);
    }
}

export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipment = await equipmentService.createEquipment(req.body);
        res.status(201).json({ status: "success", data: equipment });
    } catch (error) {
        next(error);
    }
}

export const updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const equipment = await equipmentService.updateEquipment(id as string, req.body);
        res.status(200).json({ status: "success", data: equipment });
    } catch (error) {
        next(error);
    }
}
