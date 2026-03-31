import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import * as equipmentService from "./equipment.service";

export const getAllEquipments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters: any = {};
        const { q, category, status, sort, page, limit, isFeatured } = req.query;

        if (q) filters.q = q;
        if (category) filters.category = category;
        if (status) filters.status = status;
        if (sort) filters.sort = sort;
        if (page) filters.page = page;
        if (limit) filters.limit = limit;
        if (isFeatured) filters.isFeatured = isFeatured === "true";

        const equipments = await equipmentService.getAllEquipments(filters);
        res.status(200).json({ success: true, ...equipments });
    } catch (error) {
        next(error);
    }
}

export const getEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const equipment = await equipmentService.getEquipmentBySlug(slug as string);
        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        next(error);
    }
}

export const createEquipmentImageUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await equipmentService.createEquipmentImageUpload(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipment = await equipmentService.createEquipment(req.body);
        res.status(201).json({ success: true, data: equipment });
    } catch (error) {
        next(error);
    }
}

export const updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const equipment = await equipmentService.updateEquipment(id as string, req.body);
        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        next(error);
    }
}

export const deleteEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await equipmentService.deleteEquipment(id as string);
        res.status(200).json({ success: true, message: "Equipment deleted successfully" });
    } catch (error) {
        next(error);
    }
}
